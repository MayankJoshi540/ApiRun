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
      className="group relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer select-none active:scale-[0.99] border bg-[#0c1015] hover:bg-[#10151d] border-white/[0.08] hover:border-emerald-500/30 shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-start gap-4 sm:gap-5">
        
        {/* Tactile Vertical Upvote Button */}
        <div className="shrink-0 pt-0.5">
          <button
            type="button"
            onClick={(e) => onVote(item.id, e)}
            className={`flex flex-col items-center justify-center min-w-[50px] sm:min-w-[54px] py-2.5 px-2 rounded-xl border transition-all duration-150 active:scale-90 cursor-pointer ${
              hasVoted
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold'
                : 'bg-white/[0.03] hover:bg-emerald-500/10 border-white/[0.08] hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400'
            }`}
            title={hasVoted ? 'Remove upvote' : 'Upvote this feedback'}
            aria-label={`${item.upvotesCount} upvotes`}
          >
            <ChevronUp className={`w-4 h-4 transition-transform duration-150 ${hasVoted ? 'scale-110 font-bold text-emerald-400' : 'group-hover:-translate-y-0.5'}`} />
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
              <span className="font-mono text-xs text-zinc-400 font-semibold px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
                {formatTicketNumber(item.id, index)}
              </span>

              {/* Feedback Type Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                  item.type === 'bug'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {item.type === 'bug' ? (
                  <Bug className="w-3.5 h-3.5" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{item.type === 'bug' ? 'Bug Report' : 'Feature'}</span>
              </span>

              {/* Status Badge */}
              {isClosed ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Resolved</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/[0.03] text-zinc-300 border border-white/[0.08]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Open for Discussion</span>
                </span>
              )}

              <span className="text-zinc-700 hidden sm:inline">•</span>

              {/* Submission Date */}
              <span className="text-zinc-500 font-mono text-xs">
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
                  className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/20 transition-all cursor-pointer active:scale-95"
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
            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors leading-snug tracking-[-0.01em]">
              {item.title}
            </h3>

            <p className="text-sm text-zinc-400 line-clamp-2 sm:line-clamp-3 leading-relaxed font-sans">
              {item.description}
            </p>
          </div>

          {/* Section C: Footer Metadata & Interactive Cue */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/[0.06] text-xs">
            <div className="flex items-center space-x-3 text-zinc-500">
              {/* Author */}
              <div className="flex items-center space-x-1.5">
                <UserIcon className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-mono text-zinc-400">
                  {item.userName || 'Anonymous Engineer'}
                </span>
              </div>

              <span className="text-zinc-700">•</span>

              {/* Replies Count */}
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08] text-zinc-400 group-hover:border-white/[0.12]">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400/80" />
                <span className="font-mono text-xs font-medium">
                  {item.commentsCount || item.comments?.length || 0} {item.comments?.length === 1 ? 'reply' : 'replies'}
                </span>
              </div>
            </div>

            {/* Click to open thread indicator */}
            <div className="inline-flex items-center space-x-1 text-emerald-400 font-medium text-xs group-hover:translate-x-0.5 transition-all">
              <span>Open Thread</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};
