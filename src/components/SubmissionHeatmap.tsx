'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar } from '@/components/ui/GoogleIcon';
import { UserSubmission } from '@/lib/userProgress';

interface SubmissionHeatmapProps {
  submissions?: Record<string, UserSubmission>;
  streak?: number;
  solvedCount?: number;
}

interface DayData {
  date: Date;
  dateKey: string;
  count: number;
  monthName: string;
  dayOfMonth: number;
  dayOfWeek: number;
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
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Compute real counts from user submission history
  const { dateToCount, last30DaysSubmissions, currentCalculatedStreak, totalYearSubmissions } = useMemo(() => {
    const counts: Record<string, number> = {};
    let recentSubmissions = 0;
    let totalYear = 0;
    
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(todayDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const oneYearAgo = new Date(todayDate);
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    Object.values(submissions).forEach((sub) => {
      if (sub.timestamp) {
        const d = new Date(sub.timestamp);
        if (!isNaN(d.getTime())) {
          const key = d.toISOString().split('T')[0];
          counts[key] = (counts[key] || 0) + 1;
          
          if (d.getTime() >= thirtyDaysAgo.getTime()) {
            recentSubmissions++;
          }
          if (d.getTime() >= oneYearAgo.getTime()) {
            totalYear++;
          }
        }
      }
    });

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
      last30DaysSubmissions: recentSubmissions || (solvedCount > 0 ? solvedCount : 0),
      currentCalculatedStreak: Math.max(curS, streak || (solvedCount > 0 ? 1 : 0)),
      totalYearSubmissions: totalYear || (solvedCount > 0 ? solvedCount : 0),
    };
  }, [submissions, streak, solvedCount]);

  // Generate 52 weeks aligned to Sunday
  const { weeks, monthHeaders } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - dayOfWeek));

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

  // Scroll to current date (end of scroll) on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [weeks]);

  const handleMouseEnterCell = (e: React.MouseEvent<HTMLDivElement>, day: DayData) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay(day);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  return (
    <div className="w-full flex flex-col font-sans select-none relative">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-[-0.01em]">Practice Activity</h2>
            <p className="text-xs text-[#86868b] mt-0.5">52-week submission frequency and consistency</p>
          </div>
        </div>

        {/* Real Streak Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#d1d1d6]">
            <span className="text-[#86868b]">Current Streak:</span>
            <span className="text-white font-semibold tabular-nums">{currentCalculatedStreak} {currentCalculatedStreak === 1 ? 'day' : 'days'}</span>
          </div>

          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#d1d1d6]">
            <span className="text-[#86868b]">Past 30 Days:</span>
            <span className="text-white font-semibold tabular-nums">{last30DaysSubmissions} solves</span>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <div className="min-w-[1100px] flex flex-col px-1">
          {/* Month Header Labels */}
          <div className="h-5 relative mb-2 ml-11 text-xs font-medium text-[#86868b]">
            {monthHeaders.map((m, idx) => (
              <span
                key={idx}
                className="absolute whitespace-nowrap transform"
                style={{ left: `${m.weekIndex * 20}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid Container with Day Labels */}
          <div className="flex items-start">
            {/* Day of Week Labels aligned row-for-row */}
            <div className="flex flex-col gap-1 text-[11px] font-medium text-[#86868b] pr-3 select-none shrink-0 w-11">
              <div className="h-4" /> {/* Sun */}
              <div className="h-4 flex items-center justify-end leading-none">Mon</div>
              <div className="h-4" /> {/* Tue */}
              <div className="h-4 flex items-center justify-end leading-none">Wed</div>
              <div className="h-4" /> {/* Thu */}
              <div className="h-4 flex items-center justify-end leading-none">Fri</div>
              <div className="h-4" /> {/* Sat */}
            </div>

            {/* 52-Week Activity Grid */}
            <div className="flex gap-1 flex-grow">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.days.map((day, dIdx) => {
                    const isFuture = day.isFuture;

                    let bgClass = 'bg-white/[0.05] border border-white/[0.04]';
                    if (isFuture) {
                      bgClass = 'bg-transparent border border-transparent opacity-0 pointer-events-none';
                    } else if (day.count >= 4) {
                      bgClass = 'bg-[#30d158] border border-[#30d158] shadow-[0_0_8px_rgba(48,209,88,0.35)]';
                    } else if (day.count >= 2) {
                      bgClass = 'bg-[#248040] border border-[#248040]';
                    } else if (day.count === 1) {
                      bgClass = 'bg-[#1a5e30] border border-[#1a5e30]';
                    } else if (day.isToday) {
                      bgClass = 'bg-white/[0.08] border border-white/60 ring-1 ring-white/20';
                    }

                    return (
                      <div
                        key={dIdx}
                        onMouseEnter={(e) => !isFuture && handleMouseEnterCell(e, day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-4 h-4 rounded-[3.5px] cursor-pointer transition-all duration-150 hover:scale-110 hover:border-white hover:z-10 ${bgClass}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 mt-2 border-t border-white/[0.06] text-xs text-[#86868b]">
        <div>
          <span>Total verified solves: </span>
          <strong className="text-[#f5f5f7] font-semibold tabular-nums">{totalYearSubmissions} challenges</strong>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span>Less</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-[3px] bg-white/[0.05] border border-white/[0.04]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#1a5e30] border border-[#1a5e30]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#248040] border border-[#248040]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#30d158] border border-[#30d158]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/[0.14] shadow-[0_12px_24px_rgba(0,0,0,0.6)] text-[11px] text-white whitespace-nowrap animate-in fade-in duration-100"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="font-semibold text-white">
            {hoveredDay.count === 0 ? 'No submissions' : `${hoveredDay.count} submission${hoveredDay.count > 1 ? 's' : ''}`}
          </div>
          <div className="text-[10px] text-[#86868b] mt-0.5">
            {hoveredDay.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      )}
    </div>
  );
};
