'use client';

import React, { useState, useMemo } from 'react';
import { Flame, Info, Calendar } from '@/components/ui/GoogleIcon';
import { UserSubmission } from '@/lib/userProgress';

interface SubmissionHeatmapProps {
  submissions?: Record<string, UserSubmission>;
  streak?: number;
  solvedCount?: number;
}

interface DayData {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  count: number;
  monthName: string;
  dayOfMonth: number;
  dayOfWeek: number; // 0=Sun, 6=Sat
  isToday: boolean;
  isFuture: boolean;
}

interface WeekData {
  days: DayData[];
  monthLabel?: string;
}

export const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({
  submissions = {},
  streak = 0,
  solvedCount = 0,
}) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  // 1. Process real submission timestamps into a date-to-count map
  const { dateToCount, totalYearSubmissions, totalActiveDays, maxStreak, currentCalculatedStreak } = useMemo(() => {
    const counts: Record<string, number> = {};
    let yearSubmissions = 0;
    const currentYear = new Date().getFullYear();

    Object.values(submissions).forEach((sub) => {
      if (sub.timestamp) {
        const d = new Date(sub.timestamp);
        if (!isNaN(d.getTime())) {
          const key = d.toISOString().split('T')[0];
          counts[key] = (counts[key] || 0) + 1;
          if (d.getFullYear() === currentYear) {
            yearSubmissions++;
          }
        }
      }
    });

    const activeDates = Object.keys(counts).filter(k => counts[k] > 0).sort();
    const activeDaysCount = activeDates.length;

    // Calculate max streak & current streak from real active dates
    let maxS = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    activeDates.forEach(dateStr => {
      const curDate = new Date(dateStr);
      if (prevDate) {
        const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      if (tempStreak > maxS) maxS = tempStreak;
      prevDate = curDate;
    });

    // Current streak (consecutive days leading up to today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayKey = today.toISOString().split('T')[0];
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    let curS = 0;
    if (counts[todayKey] || counts[yesterdayKey]) {
      let checkDate = new Date(counts[todayKey] ? today : yesterday);
      while (true) {
        const k = checkDate.toISOString().split('T')[0];
        if (counts[k] && counts[k] > 0) {
          curS++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      dateToCount: counts,
      totalYearSubmissions: yearSubmissions,
      totalActiveDays: activeDaysCount,
      maxStreak: Math.max(maxS, curS, streak || 0),
      currentCalculatedStreak: Math.max(curS, streak || 0),
    };
  }, [submissions, streak]);

  // 2. Generate exactly 52 weeks (364 days) of grid cells aligned to Sunday
  const { weeks, monthHeaders } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // End on the coming Saturday of current week to ensure complete 7-day columns
    const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - dayOfWeek));

    // 52 weeks = 364 days
    const totalWeeks = 52;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (totalWeeks * 7 - 1));

    const generatedWeeks: WeekData[] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let prevMonth = -1;

    for (let w = 0; w < totalWeeks; w++) {
      const days: DayData[] = [];
      let weekMonthLabel: string | undefined = undefined;

      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + (w * 7 + d));

        const y = cellDate.getFullYear();
        const m = cellDate.getMonth();
        const dayNum = cellDate.getDate();
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const monthShort = cellDate.toLocaleString('default', { month: 'short' });

        const isToday = cellDate.getTime() === today.getTime();
        const isFuture = cellDate.getTime() > today.getTime();
        const count = isFuture ? 0 : (dateToCount[dateKey] || 0);

        if (d === 0 && m !== prevMonth) {
          weekMonthLabel = monthShort;
          months.push({ label: monthShort, weekIndex: w });
          prevMonth = m;
        }

        days.push({
          date: cellDate,
          dateKey,
          count,
          monthName: monthShort,
          dayOfMonth: dayNum,
          dayOfWeek: d,
          isToday,
          isFuture,
        });
      }

      generatedWeeks.push({
        days,
        monthLabel: weekMonthLabel,
      });
    }

    return { weeks: generatedWeeks, monthHeaders: months };
  }, [dateToCount]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 sm:p-7 space-y-5 shadow-xl select-none font-sans">
      {/* Heatmap Header Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {totalYearSubmissions} {totalYearSubmissions === 1 ? 'Submission' : 'Submissions'} in {currentYear}
            </h2>
            <p className="text-[11px] text-zinc-400">
              Live submission activity across all backend problem sets
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-300">
          <div>
            Total Active Days: <strong className="text-white font-bold">{totalActiveDays}</strong>
          </div>
          <span className="text-zinc-600">•</span>
          <div>
            Max Streak: <strong className="text-[#10b981] font-bold">{maxStreak} {maxStreak === 1 ? 'day' : 'days'}</strong>
          </div>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="space-y-2">
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="min-w-[760px] space-y-1.5">
            
            {/* Month Header Labels */}
            <div className="flex pl-8 text-[10px] font-mono font-medium text-zinc-400 h-4 relative">
              {monthHeaders.map((m, idx) => (
                <div
                  key={idx}
                  className="absolute"
                  style={{ left: `${m.weekIndex * 14 + 32}px` }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid with Day of Week labels */}
            <div className="flex items-start space-x-1.5">
              {/* Day Labels (Sun, Mon, Wed, Fri) */}
              <div className="flex flex-col justify-between text-[9px] font-mono text-zinc-500 pr-1 select-none pt-0.5" style={{ height: '94px' }}>
                <span className="leading-none">Sun</span>
                <span className="leading-none">Tue</span>
                <span className="leading-none">Thu</span>
                <span className="leading-none">Sat</span>
              </div>

              {/* 52-Week Activity Grid */}
              <div className="flex space-x-[3px]">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col space-y-[3px]">
                    {week.days.map((day, dIdx) => {
                      const isFuture = day.isFuture;

                      // Exact color tiers: Dark when 0, premium emerald only when real submission exists
                      let bgClass = 'bg-[#12161f] border border-white/[0.04]';
                      if (isFuture) {
                        bgClass = 'bg-white/[0.02] border border-transparent opacity-30';
                      } else if (day.count >= 4) {
                        bgClass = 'bg-[#10b981] border border-[#10b981] shadow-sm';
                      } else if (day.count >= 2) {
                        bgClass = 'bg-emerald-600 border border-emerald-500 shadow-sm';
                      } else if (day.count === 1) {
                        bgClass = 'bg-emerald-800/90 border border-emerald-700/60';
                      } else if (day.isToday) {
                        bgClass = 'bg-[#151c28] border border-white/[0.15]';
                      }

                      return (
                        <div
                          key={dIdx}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-all duration-150 hover:scale-125 hover:z-20 ${bgClass}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Tooltip & Legend Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 pt-3 border-t border-white/[0.06] gap-2">
          
          {/* Hover Information / Live Date Indicator */}
          <div className="flex items-center space-x-2 text-xs font-mono min-h-[20px]">
            {hoveredDay ? (
              <span className="text-zinc-200">
                <strong className={hoveredDay.count > 0 ? 'text-[#10b981]' : 'text-zinc-400'}>
                  {hoveredDay.count === 0
                    ? 'No submissions'
                    : `${hoveredDay.count} ${hoveredDay.count === 1 ? 'submission' : 'submissions'}`}
                </strong>{' '}
                on {hoveredDay.monthName} {hoveredDay.dayOfMonth}, {hoveredDay.date.getFullYear()}
                {hoveredDay.isToday && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold">TODAY</span>}
              </span>
            ) : (
              <span className="text-zinc-400">
                Current Streak: <strong className="text-[#10b981] font-bold">{currentCalculatedStreak} {currentCalculatedStreak === 1 ? 'day' : 'days'}</strong>
              </span>
            )}
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-mono">
            <span>Less</span>
            <span className="w-[10px] h-[10px] rounded-[2px] bg-[#12161f] border border-white/[0.04]" title="0 submissions" />
            <span className="w-[10px] h-[10px] rounded-[2px] bg-emerald-800/90 border border-emerald-700/60" title="1 submission" />
            <span className="w-[10px] h-[10px] rounded-[2px] bg-emerald-600 border border-emerald-500" title="2-3 submissions" />
            <span className="w-[10px] h-[10px] rounded-[2px] bg-[#10b981] border border-[#10b981]" title="4+ submissions" />
            <span>More</span>
          </div>

        </div>
      </div>
    </div>
  );
};
