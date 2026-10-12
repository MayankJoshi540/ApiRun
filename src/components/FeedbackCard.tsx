'use client';

import React from 'react';
import { 
  ChevronUp, 
  ChevronRight, 
  Bug, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  User as UserIcon, 
  Trash2, 
  Loader2 
} from '@/components/ui/GoogleIcon';
import { FeedbackItem } from '@/app/feedback/page';

interface FeedbackCardProps {
  item: FeedbackItem;
  index: number;
  hasVoted: boolean;
  isAdmin: boolean;
  isDeleting: boolean;
  onVote: (feedbackId: string, e: React.MouseEvent) => void;
  onSelect: (item: FeedbackItem) => void;
  onDelete: (feedbackId: string, e: React.MouseEvent) => void;
  formatDate: (isoStr: string) => string;
  formatTicketNumber: (id: string, index: number) => string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  item,
  index,
  hasVoted,
  isAdmin,
  isDeleting,
  onVote,
  onSelect,
  onDelete,
  formatDate,
  formatTicketNumber,
}) => {
  const isClosed = item.status === 'closed';

  return (
    <article
      onClick={() => onSelect(item)}
      className="group relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer select-none active:scale-[0.99] border bg-[#0D1518] hover:bg-[#101A1D] border-[#1B302D] hover:border-[#2A4B46] shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-start gap-4 sm:gap-5">
        
        {/* Tactile Vertical Upvote Button */}
        <div className="shrink-0 pt-0.5">
          <button
            type="button"
            onClick={(e) => onVote(item.id, e)}
            className={`flex flex-col items-center justify-center min-w-[50px] sm:min-w-[54px] py-2.5 px-2 rounded-xl border transition-all duration-150 active:scale-90 cursor-pointer ${
              hasVoted
                ? 'bg-[#10B981] text-[#050909] border-[#34D399] font-bold shadow-[0_2px_10px_rgba(16,185,129,0.3)]'
                : 'bg-[#101A1D] hover:bg-[#142327] border-[#1B302D] hover:border-[#2A4B46] text-[#9AA8A5] hover:text-[#F3F7F6]'
            }`}
            title={hasVoted ? 'Remove upvote' : 'Upvote this feedback'}
            aria-label={`${item.upvotesCount} upvotes`}
          >
            <ChevronUp className={`w-4 h-4 transition-transform duration-150 ${hasVoted ? 'scale-110 font-bold' : 'group-hover:-translate-y-0.5'}`} />
            <span className="text-xs sm:text-[13px] font-bold font-mono tabular-nums mt-0.5">
              {item.upvotesCount}
            </span>
          </button>
        </div>

        {/* Content Body: Header, Title, Description, Footer */}
        <div className="flex-1 min-w-0 space-y-3">
          
          {/* Section A: Header (Identity & Status) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* RFC Identifier */}
              <span className="font-mono text-xs text-[#9AA8A5] font-semibold px-2 py-0.5 rounded-md bg-[#101A1D] border border-[#1B302D]">
                {formatTicketNumber(item.id, index)}
              </span>

              {/* Feedback Type Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                  item.type === 'bug'
                    ? 'bg-[#2A1215] text-[#F87171] border-[#4A2024]'
                    : 'bg-[#0E2320] text-[#34D399] border-[#1B423C]'
                }`}
              >
                {item.type === 'bug' ? (
                  <Bug className="w-3.5 h-3.5" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                <span>{item.type === 'bug' ? 'Bug Report' : 'Feature RFC'}</span>
              </span>

              {/* Status Badge */}
              {isClosed ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#0B2920] text-[#10B981] border border-[#155E49]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>Resolved</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#0E1F24] text-[#2DD4BF] border border-[#183A42]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shrink-0" />
                  <span>Open for Discussion</span>
                </span>
              )}

              <span className="text-[#1B302D] hidden sm:inline">•</span>

              {/* Submission Date */}
              <span className="text-[#788783] font-mono text-xs">
                {formatDate(item.createdAt)}
              </span>
            </div>

            {/* Moderator Delete Control */}
            {isAdmin && (
              <div className="shrink-0">
                <button
                  type="button"
                  title="Delete this item permanently (Moderator)"
                  disabled={isDeleting}
                  onClick={(e) => onDelete(item.id, e)}
                  className="p-1.5 rounded-lg bg-[#101A1D] hover:bg-[#2A1215] text-[#788783] hover:text-[#F87171] border border-[#1B302D] hover:border-[#4A2024] transition-all cursor-pointer active:scale-95"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Section B: Core Content (Title & Description) */}
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-semibold text-[#F3F7F6] group-hover:text-[#10B981] transition-colors leading-snug tracking-[-0.01em]">
              {item.title}
            </h3>

            <p className="text-sm text-[#9AA8A5] line-clamp-2 sm:line-clamp-3 leading-relaxed font-sans">
              {item.description}
            </p>
          </div>

          {/* Section C: Footer Metadata & Interactive Cue */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#1B302D]/60 text-xs">
            <div className="flex items-center space-x-3 text-[#788783]">
              {/* Author */}
              <div className="flex items-center space-x-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#788783]" />
                <span className="text-xs font-mono text-[#9AA8A5]">
                  {item.userName || 'Anonymous Engineer'}
                </span>
              </div>

              <span className="text-[#1B302D]">•</span>

              {/* Replies Count */}
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[#101A1D] border border-[#1B302D] text-[#9AA8A5]">
                <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="font-mono text-xs font-medium">
                  {item.commentsCount || item.comments?.length || 0} {item.comments?.length === 1 ? 'reply' : 'replies'}
                </span>
              </div>
            </div>

            {/* Click to open thread indicator */}
            <div className="inline-flex items-center space-x-1 text-[#10B981] font-medium text-xs group-hover:translate-x-0.5 transition-transform">
              <span>Open Thread</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};
