import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Challenge, UserStats } from '@/types';

export interface UserSubmission {
  code: string;
  language: string;
  testsPassed: number;
  timestamp: string;
}

export interface UserProfileData {
  bio?: string;
  location?: string;
  github?: string;
  displayName?: string;
  website?: string;
  title?: string;
}

export interface UserProgressRecord {
  userId: string;
  solvedChallengeIds: string[];
  inProgressChallengeIds: string[];
  submissions: Record<string, UserSubmission>;
  streak: number;
  lastActiveDate: string;
  updatedAt: string;
  profile?: UserProfileData;
}

const LOCAL_STORAGE_KEY_PREFIX = 'apirun_progress_';

export const getInitialProgress = (userId = 'guest'): UserProgressRecord => ({
  userId,
  solvedChallengeIds: [],
  inProgressChallengeIds: [],
  submissions: {},
  streak: 0,
  lastActiveDate: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  profile: {
    bio: 'Practicing production-grade backend engineering with Express, Go, and Python. Focused on resilient APIs, clean validation, and sub-20ms SLAs.',
    location: 'San Francisco, CA',
    github: '',
    title: 'Backend Engineer',
  },
});

/**
 * Loads a user's progress from Firestore.
 * Falls back to local storage if Firestore is unavailable or offline.
 */
export async function loadUserProgress(userId: string | null | undefined): Promise<UserProgressRecord> {
  const currentUid = userId || 'guest';
  const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${currentUid}`;

  // 1. If signed into Firebase and Firestore is active, fetch from remote
  if (db && userId && userId !== 'guest') {
    try {
      const userDocRef = doc(db, 'users', userId);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        const data = snap.data() as UserProgressRecord;
        // Save local copy for offline cache
        if (typeof window !== 'undefined') {
          localStorage.setItem(localKey, JSON.stringify(data));
        }
        return data;
      } else {
        // First-time user: initialize remote progress document
        const initial = getInitialProgress(userId);
        await setDoc(userDocRef, initial);
        if (typeof window !== 'undefined') {
          localStorage.setItem(localKey, JSON.stringify(initial));
        }
        return initial;
      }
    } catch (err) {
      console.warn('Firestore load failed, falling back to local storage:', err);
    }
  }

  // 2. Local storage fallback
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(localKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.warn('Local storage read error:', err);
    }
  }

  return getInitialProgress(currentUid);
}

/**
 * Saves a completed challenge for the user to Firestore and local storage.
 */
export async function recordChallengeSolved(
  userId: string | null | undefined,
  challengeId: string,
  submission?: { code: string; language: string; testsPassed: number }
): Promise<UserProgressRecord> {
  const currentUid = userId || 'guest';
  const existing = await loadUserProgress(userId);

  const updatedSolved = Array.from(new Set([...existing.solvedChallengeIds, challengeId]));
  const updatedInProgress = existing.inProgressChallengeIds.filter(id => id !== challengeId);

  const newSubmissions = { ...existing.submissions };
  if (submission) {
    newSubmissions[challengeId] = {
      ...submission,
      timestamp: new Date().toISOString(),
    };
  }

  const updatedRecord: UserProgressRecord = {
    ...existing,
    userId: currentUid,
    solvedChallengeIds: updatedSolved,
    inProgressChallengeIds: updatedInProgress,
    submissions: newSubmissions,
    updatedAt: new Date().toISOString(),
  };

  // 1. Sync to local storage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${currentUid}`, JSON.stringify(updatedRecord));
    } catch (e) {
      console.warn('Failed to cache progress locally:', e);
    }
  }

  // 2. Sync to Firestore if authenticated
  if (db && userId && userId !== 'guest') {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, updatedRecord, { merge: true });
    } catch (err) {
      console.error('Failed to sync solved challenge to Firestore:', err);
    }
  }

  return updatedRecord;
}

/**
 * Completely resets progress for a user in Firestore and local storage.
 */
export async function resetUserProgress(userId: string | null | undefined): Promise<UserProgressRecord> {
  const currentUid = userId || 'guest';
  const initial = getInitialProgress(currentUid);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${currentUid}`, JSON.stringify(initial));
      localStorage.removeItem('apirun_progress_guest');
      localStorage.removeItem('apirun_demo_auth_user');
    } catch (e) {
      console.warn('Failed to reset local storage:', e);
    }
  }

  if (db && userId && userId !== 'guest') {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, initial);
    } catch (err) {
      console.error('Failed to reset progress in Firestore:', err);
    }
  }

  return initial;
}

/**
 * Maps the default static challenges list to reflect the user's personal solved progress.
 */
export function applyUserProgressToChallenges(
  challenges: Challenge[],
  progress: UserProgressRecord
): Challenge[] {
  return challenges.map(c => {
    if (progress.solvedChallengeIds.includes(c.id) || progress.solvedChallengeIds.includes(c.slug)) {
      return { ...c, status: 'SOLVED' };
    }
    if (progress.inProgressChallengeIds.includes(c.id) || progress.inProgressChallengeIds.includes(c.slug)) {
      return { ...c, status: 'IN_PROGRESS' };
    }
    return { ...c, status: 'UNSOLVED' };
  });
}

/**
 * Updates user profile bio, location, github, etc.
 */
export async function updateUserProfile(
  userId: string | null | undefined,
  profileData: UserProfileData
): Promise<UserProgressRecord> {
  const currentUid = userId || 'guest';
  const existing = await loadUserProgress(userId);

  const updatedProfile: UserProfileData = {
    ...existing.profile,
    ...profileData,
  };

  const updatedRecord: UserProgressRecord = {
    ...existing,
    userId: currentUid,
    profile: updatedProfile,
    updatedAt: new Date().toISOString(),
  };

  // 1. Sync to local storage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${currentUid}`, JSON.stringify(updatedRecord));
    } catch (e) {
      console.warn('Failed to cache updated profile locally:', e);
    }
  }

  // 2. Sync to Firestore
  if (db && userId && userId !== 'guest') {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { profile: updatedProfile, updatedAt: updatedRecord.updatedAt }, { merge: true });
    } catch (err) {
      console.error('Failed to sync profile update to Firestore:', err);
    }
  }

  return updatedRecord;
}

