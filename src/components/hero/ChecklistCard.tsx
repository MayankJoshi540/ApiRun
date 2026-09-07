import React from 'react';
import { Check } from 'lucide-react';

export const ChecklistCard: React.FC = () => {
  const items = [
    'Write API',
    'Pass Tests',
    'Handle Edge Cases',
    'Deploy'
  ];

  return (
    <div className="relative group animate-card-float-2 transition-all duration-500 hover:scale-105 hover:!rotate-0">
      {/* Background Soft Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00f2a9]/15 to-transparent rounded-2xl blur-lg opacity-30 group-hover:opacity-70 transition duration-500 pointer-events-none" />

      {/* Glassmorphic Card Container */}
      <div className="relative w-[210px] 2xl:w-[240px] rounded-2xl bg-[#080d14]/85 border border-white/[0.12] p-3.5 2xl:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-left select-none">
        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2.5">
              {/* Glowing Mint Checkmark Bubble */}
              <div className="w-4.5 h-4.5 rounded-full bg-[#00f2a9]/20 border border-[#00f2a9] flex items-center justify-center text-[#00f2a9] shadow-[0_0_8px_rgba(0,242,169,0.35)] shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
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
