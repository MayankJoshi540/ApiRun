import { Challenge, UserStats } from '../types';

export const initialUserStats: UserStats = {
  solvedCount: 1,
  challengesSolved: 1,
  totalChallenges: 8,
  totalTestsPassed: 11,
  totalSubmissions: 4,
  averageLatencyMs: 14.8,
  currentStreak: 3,
  rankTitle: 'L2 Backend Engineer',
};

export const challenges: Challenge[] = [
  {
    id: 'create-user-api',
    title: 'Create a User API',
    slug: 'create-user-api',
    difficulty: 'BEGINNER',
    category: 'REST API',
    summary: 'Build an API for creating, validating, and retrieving users with proper HTTP status codes.',
    estimatedMinutes: 25,
    concepts: ['HTTP', 'REST', 'Validation'],
    status: 'SOLVED',
    problemStatement: `Design and implement a standard RESTful User Management API.

The API must allow clients to register new users, fetch user lists, and inspect individual user profiles by unique ID. You must strictly adhere to HTTP protocol semantics, including correct status code usage (201, 200, 400, 404, 409, 422) and accurate Content-Type response headers.`,
    requirements: [
      {
        id: 'req-1',
        title: 'POST /users payload validation',
        detail: 'Body must require "name" (string, 2-50 chars) and "email" (valid RFC 5322 email string). Return 400 Bad Request on missing fields, and 422 Unprocessable Entity on invalid email formatting.',
        isCritical: true,
        badge: 'Validation'
      },
      {
        id: 'req-2',
        title: 'Unique email enforcement',
        detail: 'If a user attempts to register with an email that already exists in the store, respond with HTTP 409 Conflict and an appropriate error payload: {"error": "email_already_exists"}.',
        isCritical: true,
        badge: 'Database'
      },
      {
        id: 'req-3',
        title: 'Auto-generated identifiers and timestamps',
        detail: 'On successful user creation, return HTTP 201 Created with JSON body containing generated "id" (UUID or numeric IF), "name", "email", and ISO 8601 "createdAt". Never return plaintext passwords or internal columns.',
        isCritical: false,
        badge: 'REST'
      },
      {
        id: 'req-4',
        title: 'GET /users/:id lookup & 404 handling',
        detail: 'GET requests with a valid ID return 200 OK with the user object. If the identifier does not exist, return HTTP 404 Not Found with {"error": "user_not_found"}.',
        isCritical: true,
        badge: 'HTTP'
      }
    ],
    constraints: [
      'Content-Type must always be application/json; charset=utf-8',
      'All email addresses must be normalized to lowercase before saving',
      'Whitespace must be stripped from the start and end of user name',
      'Average response latency must remain under 50ms'
    ],
    endpoints: [
      {
        id: 'ep-post-users',
        method: 'POST',
        path: '/users',
        summary: 'Create a new user profile',
        description: 'Creates a new user record after verifying field requirements and uniqueness.',
        headers: [
          { key: 'Content-Type', value: 'application/json', required: true, description: 'Must specify JSON body encoding' }
        ],
        requestBody: {
          contentType: 'application/json',
          exampleJson: JSON.stringify({ name: 'Mayank Patel', email: 'mayank@example.com' }, null, 2),
          fields: [
            { name: 'name', type: 'string', required: true, description: 'User display name (2 to 50 characters, trimmed)' },
            { name: 'email', type: 'string', required: true, description: 'Valid RFC 5322 compliant unique email address' }
          ]
        },
        responses: [
          {
            statusCode: 201,
            statusText: 'Created',
            description: 'User successfully created in database',
            exampleJson: JSON.stringify({ id: 1, name: 'Mayank Patel', email: 'mayank@example.com', createdAt: '2026-09-02T12:00:00.000Z'}, null, 2),
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'Location': '/users/1' }
          },
          {
            statusCode: 400,
            statusText: 'Bad Request',
            description: 'Missing required field (name or email is missing/null)',
            exampleJson: JSON.stringify({error: 'missing_required_field', message: 'Field "name" is required.'}, null, 2)
          },
          {
            statusCode: 409,
            statusText: 'Conflict',
            description: 'Email address already registered',
            exampleJson: JSON.stringify({error: 'email_already_exists', message: 'A user with email "mayank@example.com" already exists.'}, null, 2)
          },
          {
            statusCode: 422,
            statusText: 'Unprocessable Entity',
            description: 'Email syntax violates RFC standard',
            exampleJson: JSON.stringify({error: 'invalid_email_format', message: 'Provided email address is malformed.'}, null, 2)
          }
        ],
        curlExample: 'curl -X POST http://localhost:8000/users -H "Content-Type: application/json" -d \'{"name":"Mayank Patel","email":"mayank@example.com"}\''
      },
      {
        id: 'ep-get-users',
        method: 'GET',
        path: '/users',
        summary: 'List all active users',
        description: 'Returns an array of registered user summaries sorted by creation timestamp descending.',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Collection of users',
            exampleJson: JSON.stringify({
              data: [
                {id: 1, name: 'Mayank Patel', email: 'mayank@example.com', createdAt: '2026-09-02T12:00:00.000Z'},
                {id: 2, name: 'Sarah Lin', email: 'sarah@example.com', createdAt: '2026-09-02T12:05:00.000Z'}
              ],
              total: 2,
              page: 1,
              limit: 20
            }, null, 2)
          }
        ]
      },
      {
        id: 'ep-get-user-id',
        method: 'GET',
        path: '/users/:id',
        summary: 'Fetch user by ID',
        description: 'Retrieves a single user record by their identifier.',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'User details found',
            exampleJson: JSON.stringify({id: 1, name: 'Mayank Patel', email: 'mayank@example.com', createdAt: '2026-09-02T12:00:00.000Z'}, null, 2)
          },
          {
            statusCode: 404,
            statusText: 'Not Found',
            description: 'No user exists with the specified ID',
            exampleJson: JSON.stringify({error: 'user_not_found', message: 'User with id 999 does not exist.'}, null, 2)
          }
        ]
      },
      {
        id: 'ep-del-user-id',
        method: 'DELETE',
        path: '/users/:id',
        summary: 'Delete user by ID',
        responses: [
          { statusCode: 204, statusText: 'No Content', description: 'User successfully deleted' },
          { statusCode: 404, statusText: 'Not Found', description: 'User not found', exampleJson: JSON.stringify({error: 'user_not_found'}, null, 2) }
        ]
      }
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Creates a valid user',
        category: 'Contract',
        description: 'POST /users with valid name and email returns 201 Created and persisted object with id.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ name: 'Mayank Patel', email: 'mayank@example.com' }),
        expectedStatus: 201,
        expectedResponseSnippet: '"name": "Mayank Patel"'
      },
      {
        id: 'tc-2',
        name: 'Rejects invalid email format',
        category: 'Validation',
        description: 'POST /users with invalid email string yields HTTP 422.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ name: 'Test User', email: 'invalid-email-string' }),
        expectedStatus: 422,
        expectedResponseSnippet: '"error": "invalid_email_format"'
      },
      {
        id: 'tc-3',
        name: 'Rejects missing name parameter',
        category: 'Validation',
        description: 'POST /users without name field must return HTTP 400 Bad Request.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ email: 'noname@example.com' }),
        expectedStatus: 400,
        expectedResponseSnippet: '"error": "missing_required_field"'
      },
      {
        id: 'tc-4',
        name: 'Rejects duplicate email with 409 Conflict',
        category: 'Edge Case',
        description: 'Registering an already registered email yields 409 Conflict.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ name: 'Duplicate Mayank', email: 'mayank@example.com' }),
        expectedStatus: 409,
        expectedResponseSnippet: '"error": "email_already_exists"'
      },
      {
        id: 'tc-5',
        name: 'Returns 404 for non-existent user ID',
        category: 'Contract',
        description: 'GEU /users/99999 returns HTTP 404 Not Found, not a 500 error.',
        endpoint: '/users/99999',
        method: 'GET',
        expectedStatus: 404,
        expectedResponseSnippet: '"error": "user_not_found"'
      },
      {
        id: 'tc-6',
        name: 'Trims leading/trailing whitespace in name [Hidden]',
        category: 'Edge Case',
        description: 'POST /users with padded name saves trimmed string.',
        endpoint: '/users',
        method: 'POST',
        isHidden: true,
        requestPayload: JSON.stringify({ name: '  Padded Name  ', email: 'padded@example.com' }),
        expectedStatus: 201,
        expectedResponseSnippet: '"name": "Padded Name"'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// In-memory data store
const users: User[] = [];

// Simple RFC email regex validator
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// POST /users - Create a new user
app.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body;

  // 1. Check required fields
  if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
    return res.status(400).json({ error: 'missing_required_field' });
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  // 2. Validate email format
  if (!isValidEmail(normalizedEmail)) {
    return res.status(422).json({ error: 'invalid_email_format' });
  }

  // 3. Check for duplicate email
  const existingUser = users.find(u => u.email === normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ error: 'email_already_exists' });
  }

  // 4. Save and return new user
  const newUser: User = {
    id: users.length + 1,
    name: trimmedName,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return res.status(201).json(newUser);
});

// GET /users - List all users
app.get('/users', (_req: Request, res: Response) => {
  return res.status(200).json({ data: users, total: users.length });
});

// GET /users/:id - Fetch user by ID
app.get('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'user_not_found' });
  }

  return res.status(200).json(user);
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

type User struct {
	ID        int       \`json:"id"\`
	Name      string    \`json:"name"\`
	Email     string    \`json:"email"\`
	CreatedAt time.Time \`json:"createdAt"\`
}

type Store struct {
	sync.RWMutex
	users []User
}

var store = &Store{}
var emailRegex = regexp.MustCompile(\`^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$\`)

func handleUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	switch r.Method {
	case http.MethodPost:
		var body struct {
			Name  string \`json:"name"\`
			Email string \`json:"email"\`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Name == "" || body.Email == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "missing_required_field"})
			return
		}

		name := strings.TrimSpace(body.Name)
		email := strings.ToLower(strings.TrimSpace(body.Email))

		if !emailRegex.MatchString(email) {
			w.WriteHeader(http.StatusUnprocessableEntity)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid_email_format"})
			return
		}

		store.Lock()
		defer store.Unlock()

		for _, u := range store.users {
			if u.Email == email {
				w.WriteHeader(http.StatusConflict)
				json.NewEncoder(w).Encode(map[string]string{"error": "email_already_exists"})
				return
			}
		}

		newUser := User{
			ID:        len(store.users) + 1,
			Name:      name,
			Email:     email,
			CreatedAt: time.Now().UTC(),
		}
		store.users = append(store.users, newUser)

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newUser)

	case http.MethodGet:
		store.RLock()
		defer store.RUnlock()
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"data": store.users, "total": len(store.users)})

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/users", handleUsers)
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
import re

app = FastAPI(title="User Management API")

class UserCreate(BaseModel):
    name: str
    email: str

EMAIL_REGEX = r"^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
users_db = []

@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate):
    name = payload.name.strip()
    email = payload.email.strip().lower()

    if not name or not email:
        raise HTTPException(status_code=400, detail={"error": "missing_required_field"})

    if not re.match(EMAIL_REGEX, email):
        raise HTTPException(status_code=422, detail={"error": "invalid_email_format"})

    if any(u["email"] == email for u in users_db):
        raise HTTPException(status_code=409, detail={"error": "email_already_exists"})

    new_user = {
        "id": len(users_db) + 1,
        "name": name,
        "email": email,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
    users_db.append(new_user)
    return new_user

@app.get("/users")
def get_users():
    return {"data": users_db, "total": len(users_db)}

@app.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    user = next((u for u in users_db if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail={"error": "user_not_found"})
    return user`
    }
  },
   {
    id: 'url-shortener',
    title: 'URL Shortener API',
    slug: 'url-shortener',
    difficulty: 'BEGINNER',
    category: 'REST API',
    summary: 'Build an API that creates shortened URL codes, redirects clients, and counts visits.',
    estimatedMinutes: 30,
    concepts: ['REST', 'Database', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: `Implement a high-performance URL Shortener service with Base62 shortcode generation, HTTP 302 vs 301 redirection rules, and click analytics.`,
    requirements: [
      { id: 'u1', title: 'POST /shorten endpoint', detail: 'Accepts url and optional customAlias. Returns 201 Created with shortCode.', isCritical: true, badge: 'REST' },
      { id: 'u2', title: 'GET /:code Redirection', detail: 'Responds with 302 Found and Location header. If not found, return 404.', isCritical: true, badge: 'HTTP' },
      { id: 'u3', title: 'Click Counter Analytics', detail: 'GEU /analytics/:code returns clicks count, createdAt, originalUrl.', isCritical: false, badge: 'Database' }
    ],
    constraints: ['Short codes must be alphanumeric [0-9a-zA-Z]', 'Reject malformed URL protocols with 400'],
    endpoints: [
      {
        id: 'ep-shorten',
        method: 'POST',
        path: '/shorten',
        summary: 'Create shortened link',
        requestBody: {
          contentType: 'application/json',
          exampleJson: JSON.stringify({ url: 'https://github.com/torvalds/linux', customAlias: 'linux' }, null, 2),
          fields: [
            { name: 'url', type: 'string', required: true, description: 'Target destination URL' },
            { name: 'customAlias', type: 'string', required: false, description: 'Optional custom slug' }
          ]
        },
        responses: [
          { statusCode: 201, statusText: 'Created', description: 'Short link created', exampleJson: JSON.stringify({ shortCode: 'linux', shortUrl: 'http://rank.sh/linux' }, null, 2) },
          { statusCode: 409, statusText: 'Conflict', description: 'Alias already reserved' }
        ]
      },
      {
        id: 'ep-redirect',
        method: 'GET',
        path: '/:code',
        summary: 'Redirect to original URL',
        responses: [
          {
            statusCode: 302,
            statusText: 'Found',
            description: 'Redirects to target',
            headers: { Location: 'https://github.com/torvalds/linux' }
          },
          { statusCode: 404, statusText: 'Not Found', description: 'Shortcode not found' }
        ]
      }
    ],
    testCases: [
      { id: 'u-tc1', name: 'Creates short code for valid URL', category: 'Contract', description: 'POST /shorten returns 201 and shortCode.', endpoint: '/shorten', method: 'POST', requestPayload: JSON.stringify({ url: 'https://kernel.org' }), expectedStatus: 201 },
      { id: 'u-tc2', name: 'Redirects with HTTP 302', category: 'Contract', description: 'GET /:code yields 302 redirect.', endpoint: '/a1b2c3', method: 'GET', expectedStatus: 302 },
      { id: 'u-tc3', name: 'Rejects malformed URL protocols', category: 'Validation', description: 'Rejects non-http URLs with 400.', endpoint: '/shorten', method: 'POST', requestPayload: JSON.stringify({ url: 'javascript:alert(1)' }), expectedStatus: 400 }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

interface ShortLink {
  code: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

const urlStore = new Map<string, ShortLink>();

const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// POST /shorten - Create shortened URL
app.post('/shorten', (req: Request, res: Response) => {
  const { url, customAlias } = req.body;

  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    return res.status(400).json({ error: 'invalid_url_protocol' });
  }

  const shortCode = customAlias || crypto.randomBytes(4).toString('base64url');

  if (urlStore.has(shortCode)) {
    return res.status(409).json({ error: 'alias_already_exists' });
  }

  const record: ShortLink = {
    code: shortCode,
    originalUrl: url,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };

  urlStore.set(shortCode, record);
  return res.status(201).json({ shortCode, shortUrl: \`http://rank.sh/\${shortCode}\` });
});

// GET /:code - Redirect to original URL
app.get('/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const link = urlStore.get(code);

  if (!link) {
    return res.status(404).json({ error: 'shortcode_not_found' });
  }

  link.clicks += 1;
  return res.redirect(302, link.originalUrl);
});

export default app;`,
      go: `package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

type ShortLink struct {
	Code        string    \`json:"shortCode"\`
	OriginalURL string    \`json:"originalUrl"\`
	Clicks      int       \`json:"clicks"\`
	CreatedAt   time.Time \`json:"createdAt"\`
}

var (
	store = make(map[string]*ShortLink)
	mu    sync.RWMutex
)

func handleShorten(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req struct {
		URL         string \`json:"url"\`
		CustomAlias string \`json:"customAlias"\`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid_payload"})
		return
	}

	parsedURL, err := url.ParseRequestURI(req.URL)
	if err != nil || (parsedURL.Scheme != "http" && parsedURL.Scheme != "https") {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid_url_protocol"})
		return
	}

	mu.Lock()
	defer mu.Unlock()

	code := req.CustomAlias
	if code == "" {
		b := make([]byte, 4)
		rand.Read(b)
		code = base64.RawURLEncoding.EncodeToString(b)
	}

	if _, exists := store[code]; exists {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": "alias_already_exists"})
		return
	}

	link := &ShortLink{
		Code:        code,
		OriginalURL: req.URL,
		Clicks:      0,
		CreatedAt:   time.Now().UTC(),
	}
	store[code] = link

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"shortCode": code,
		"shortUrl":  "http://rank.sh/" + code,
	})
}

func main() {
	http.HandleFunc("/shorten", handleShorten)
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import secrets

app = FastAPI(title="URL Shortener API")

class ShortenRequest(BaseModel):
    url: str
    customAlias: Optional[str] = None

url_db = {}

@app.post("/shorten", status_code=status.HTTP_201_CREATED)
def shorten_url(payload: ShortenRequest):
    if not payload.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail={"error": "invalid_url_protocol"})

    code = payload.customAlias or secrets.token_urlsafe(4)

    if code in url_db:
        raise HTTPException(status_code=409, detail={"error": "alias_already_exists"})

    url_db[code] = {
        "shortCode": code,
        "originalUrl": payload.url,
        "clicks": 0,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }

    return {
        "shortCode": code,
        "shortUrl": f"http://rank.sh/{code}"
    }

@app.get("/{code}")
def redirect_url(code: str):
    link = url_db.get(code)
    if not link:
        raise HTTPException(status_code=404, detail={"error": "shortcode_not_found"})
    link["clicks"] += 1
    return RedirectResponse(url=link["originalUrl"], status_code=302)`
    }
  },
  {
    id: 'request-logger',
    title: 'Request Logger Middleware',
    slug: 'request-logger',
    difficulty: 'BEGINNER',
    category: 'Middleware',
    summary: 'Build middleware that records incoming API requests, attaches trace headers, and computes execution time.',
    estimatedMinutes: 20,
    concepts: ['HTTP', 'Middleware'],
    status: 'UNSOLVED',
    problemStatement: 'Construct a robust HTTP logging middleware pipeline. Every incoming request must be stamped with a correlation ID (UUIDv4) and measured for wall-clock latency.',
    requirements: [
      { id: 'l1', title: 'Inject X-Request-Id header', detail: 'If incoming request lacks X-Request-Id, generate UUIDv4. Propagate to all responses.', isCritical: true, badge: 'HTTP' },
      { id: 'l2', title: 'Execution time measurement', detail: 'Measure duration in ms and set in X-Response-Time header.', isCritical: true, badge: 'Middleware' }
    ],
    constraints: ['Do not buffer large request bodies in memory', 'Preserve existing client trace IDs'],
    endpoints: [
      {
        id: 'ep-log-all',
        method: 'GET',
        path: '/api/v1/ping',
        summary: 'Probe endpoint with middleware active',
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Returns pong with headers', headers: { 'X-Request-Id': 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'X-Response-Time': '3.8ms' } }
        ]
      }
    ],
    testCases: [
      { id: 'l-tc1', name: 'Generates X-Request-Id when omitted', category: 'Contract', description: 'Stamps valid UUIDv4 on outgoing headers.', endpoint: '/api/v1/ping', method: 'GET', expectedStatus: 200 },
      { id: 'l-tc2', name: 'Preserves existing client trace ID', category: 'Edge Case', description: 'Echoes inbound X-Request-ID unaltered.', endpoint: '/api/v1/ping', method: 'GET', expectedStatus: 200 }
    ]
  },
  {
    id: 'rate-limiter',
    title: 'Sliding Window Rate Limiter',
    slug: 'rate-limiter',
    difficulty: 'INTERMEDIATE',
    category: 'Infrastructure',
    summary: 'Implement a distributed sliding-window rate limiter with Redis and standard HTTP rate limit headers.',
    estimatedMinutes: 45,
    concepts: ['Redis', 'HTTP', 'Concurrency', 'Rate Limiting'],
    status: 'IN_PROGRESS',
    problemStatement: 'Protect downstream APIs from abuse by building a precise sliding-window rate limiter using Redis sorted sets (ZSET + Lua). Enforce a maximum of 60 req/min per IP. Reject excess with 429 Too Many Requests and Retry-After.',
    requirements: [
      { id: 'rl1', title: 'Standard Header compliance', detail: 'Returns X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.', isCritical: true, badge: 'HTTP' },
      { id: 'rl2', title: '429 rejection & Retry-After', detail: 'Exceeding quota yields 429 with Retry-After in seconds.', isCritical: true, badge: 'Rate Limiting' },
      { id: 'rl3', title: 'Atomic Redis evaluation', detail: 'Sliding log evaluation must avoid concurrency race conditions.', isCritical: true, badge: 'Concurrency' }
    ],
    constraints: ['Sliding window within 100ms precision', 'Auto-purge expired Redis timestamps'],
    endpoints: [
      {
        id: 'ep-rl-test',
        method: 'GET',
        path: '/api/resource',
        summary: 'Protected resource',
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Allowed' },
          { statusCode: 429, statusText: 'Too Many Requests', description: 'Quota exhausted', headers: { 'Retry-After': '18', 'X-RateLimit-Remaining': '0' } }
        ]
      }
    ],
    testCases: [
      { id: 'rl-tc1', name: 'Allows requests under limit', category: 'Contract', description: 'Decrements X-RateLimit-Remaining.', endpoint: '/api/resource', method: 'GET', expectedStatus: 200 },
      { id: 'rl-tc2', name: 'Returns 429 when 60-request quota breached', category: 'Validation', description: 'Rejects with 429 on excess.', endpoint: '/api/resource', method: 'GET', expectedStatus: 429 },
      { id: 'rl-tc3', name: 'Parallel concurrency race condition safety [Hidden]', category: 'Concurrency', description: '50 simultaneous requests test.', endpoint: '/api/resource', method: 'GET', isHidden: true, expectedStatus: 200 }
    ]
  },
  {
    id: 'idempotent-payment-webhook',
    title: 'Idempotent Payment Webhook',
    slug: 'idempotent-payment-webhook',
    difficulty: 'INTERMEDIATE',
    category: 'Webhooks',
    summary: 'Build a rock-solid webhook receiver that guarantees exactly-once payment processing despite retries.',
    estimatedMinutes: 40,
    concepts: ['Idempotency', 'Database', 'Webhooks', 'Security'],
    status: 'UNSOLVED',
    problemStatement: 'Payment gateways like Stripe frequently retry failed webhooks. Prevent double-charging using event deduplication and HMAC-SHA256 signature verification.',
    requirements: [
      { id: 'p1', title: 'HMAC-SHA256 Signature Verification', detail: 'Verify Stripe-Signature header. Reject bad signatures with 401 Unauthorized.', isCritical: true, badge: 'Security' },
      { id: 'p2', title: 'Event ID deduplication', detail: 'Subsequent calls with same event_id must return 200 OK without double-crediting balance.', isCritical: true, badge: 'Idempotency' }
    ],
    constraints: ['Parallel webhooks must not race on user balance', 'Respond within 200ms'],
    endpoints: [
      {
        id: 'ep-pay-webhook',
        method: 'POST',
        path: '/webhooks/stripe',
        summary: 'Receive payment events',
        requestBody: {
          contentType: 'application/json',
          exampleJson: JSON.stringify({ id: 'evt_101', type: 'payment_intent.succeeded', data: { amount: 5000 } }, null, 2),
          fields: [{ name: 'id', type: 'string', required: true, description: 'Unique event id' }]
        },
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Acknowledged', exampleJson: JSON.stringify({ received: true, status: 'processed' }, null, 2) },
          { statusCode: 401, statusText: 'Unauthorized', description: 'Invalid signature' }
        ]
      }
    ],
    testCases: [
      { id: 'p-tc1', name: 'Credits account on first arrival', category: 'Contract', description: 'New payment event acknowledges with 200.', endpoint: '/webhooks/stripe', method: 'POST', expectedStatus: 200 },
      { id: 'p-tc2', name: 'Deduplicates identical event without mutation', category: 'Edge Case', description: 'Retried webhook returns 200 without double-crediting.', endpoint: '/webhooks/stripe', method: 'POST', expectedStatus: 200 }
    ]
  },
  {
    id: 'jwt-auth-refresh',
    title: 'JWT Authentication & Refresh Flow',
    slug: 'jwt-auth-refresh',
    difficulty: 'INTERMEDIATE',
    category: 'Security',
    summary: 'Implement short-lived access tokens, sliding refresh token rotation, and token revocation.',
    estimatedMinutes: 35,
    concepts: ['Auth', 'Security', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: 'Implement secure JWT authentication with 15-minute accessToken and single-use rotating refreshTokens.',
    requirements: [
      { id: 'j1', title: 'POST /auth/login credentials exchange', detail: 'Valid credentials yield accessToken (JWT) and refreshToken (UUIDv4).', isCritical: true, badge: 'Auth' },
      { id: 'j2', title: 'Refresh Token Rotation', detail: 'Using refreshToken invalidates it and issues new pair.', isCritical: true, badge: 'Security' }
    ],
    constraints: ['Bearer authentication header parsing', 'Revoke entire family on token reuse'],
    endpoints: [
      {
        id: 'ep-auth-login',
        method: 'POST',
        path: '/auth/login',
        summary: 'Authenticate with credentials',
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Tokens issued', exampleJson: JSON.stringify({ accessToken: 'eyJhbGciOiJIUzI2NiIsInR5cCI6IkpXVCJ9...', refreshToken: '8f411b0e-2d33-4f9e-a89a-ec269e8b704c' }, null, 2) }
        ]
      }
    ],
    testCases: [
      { id: 'j-tc1', name: 'Issues JWT pair on valid credentials', category: 'Contract', description: 'POST /auth/login yields accessToken.', endpoint: '/auth/login', method: 'POST', expectedStatus: 200 },
      { id: 'j-tc2', name: 'Rejects invalid password with 401', category: 'Validation', description: 'Incorrect password returns 401 Unauthorized.', endpoint: '/auth/login', method: 'POST', expectedStatus: 401 }
    ]
  },
  {
    id: 'in-memory-kv-ttl',
    title: 'In-Memory Key-Value Store with TTL',
    slug: 'in-memory-kv-ttl',
    difficulty: 'INTERMEDIATE',
    category: 'Infrastructure',
    summary: 'Build an in-memory key-value engine with Millisecond TTL expirations and O(1) lookups.',
    estimatedMinutes: 35,
    concepts: ['Cache', 'Concurrency', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: 'Create a lightweight in-memory cache engine with expiration semantics similar to Redis. Support millisecond TTL and active eviction sweeps.',
    requirements: [
      { id: 'kv1', title: 'POST /kv/set with optional ttl_ms', detail: 'Stores key-value. Expired keys return 404 after elapsed duration.', isCritical: true, badge: 'Cache' },
      { id: 'kv2', title: 'GET /kv/get/:key retrieval', detail: 'Returns value or 404 if expired.', isCritical: true, badge: 'HTTP' }
    ],
    constraints: ['Key lookups must be O(1)', 'Active and passive sweep policies'],
    endpoints: [
      {
        id: 'ep-kv-set',
        method: 'POST',
        path: '/kv/set',
        summary: 'Set key-value',
        responses: [{ statusCode: 200, statusText: 'OK', description: 'Key saved' }]
      }
    ],
    testCases: [
      { id: 'kv-tc1', name: 'Sets and retrieves value', category: 'Contract', description: 'POST then GET returns matching value.', endpoint: '/kv/get/session_89', method: 'GET', expectedStatus: 200 },
      { id: 'kv-tc2', name: 'Key expires after TTL elapsed', category: 'Edge Case', description: 'Returns 404 after TTL expires.', endpoint: '/kv/get/session_89', method: 'GET', expectedStatus: 404 }
    ]
  },
  {
    id: 'job-queue-worker',
    title: 'Distributed Job Queue Worker API',
    slug: 'job-queue-worker',
    difficulty: 'ADVANCED',
    category: 'Distributed Systems',
    summary: 'Build an asynchronous job processing system with retry backoff, dead-letter queues, and status polling.',
    estimatedMinutes: 50,
    concepts: ['Queues', 'Redis', 'Concurrency', 'Database'],
    status: 'UNSOLVED',
    problemStatement: 'Design an asynchronous background job dispatch API with DLQ retry failover and priority scheduling.',
    requirements: [
      { id: 'q1', title: 'POST /jobs/enqueue dispatch', detail: 'Returns 202 Accepted with jobId and QUEUED status.', isCritical: true, badge: 'Queues' },
      { id: 'q2', title: 'Dead Letter Queue (DLQ) routing', detail: 'After 3 consecutive failures, transition to DEAD_LETTER.', isCritical: true, badge: 'Distributed Systems' }
    ],
    constraints: ['Visibility timeout locks', 'Support Priority queues'],
    endpoints: [
      {
        id: 'ep-job-enqueue',
        method: 'POST',
        path: '/jobs/enqueue',
        summary: 'Enqueue async workload',
        responses: [
          { statusCode: 202, statusText: 'Accepted', description: 'Job queued', exampleJson: JSON.stringify({ jobId: 'job_98x2', status: 'QUEUED' }, null, 2) }
        ]
      }
    ],
    testCases: [
      { id: 'q-tc1', name: 'Returns 202 Accepted with job ticket', category: 'Contract', description: 'Acknowledges queued workload.', endpoint: '/jobs/enqueue', method: 'POST', expectedStatus: 202 },
      { id: 'q-tc2', name: 'Moves to DEAD_LETTER after 3 failed retries [Hidden]', category: 'Edge Case', description: 'Verifies DLQ quarantine.', endpoint: '/jobs/job_fail/status', method: 'GET', isHidden: true, expectedStatus: 200 }
    ]
  }
];