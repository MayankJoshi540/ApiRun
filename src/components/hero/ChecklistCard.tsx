import React from 'react';
import { Check } from '@/components/ui/GoogleIcon';

export const ChecklistCard: React.FC = () => {
  const items = [
    'Write API',
    'Pass Tests',
    'Handle Edge Cases',
    'Deploy'
  ];

  return (
    <div className="relative group animate-card-float-2 transition-all duration-500 hover:scale-105 hover:!rotate-0">
      {/* Clean Technical Card Container */}
      <div className="relative w-[210px] 2xl:w-[240px] rounded-2xl bg-[#080d14] border border-white/[0.12] p-3.5 2xl:p-4.5 shadow-xl text-left select-none">
        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-[#10b981]/15 border border-[#10b981]/60 flex items-center justify-center text-[#10b981] shrink-0">
                <Check className="text-[11px]" />
              </div>
              <span className="text-[11px] 2xl:text-xs font-medium text-[#f1f5f9] tracking-tight">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
