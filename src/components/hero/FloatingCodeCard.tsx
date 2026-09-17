import React from 'react';

export const FloatingCodeCard: React.FC = () => {
  return (
    <div className="relative group animate-card-float-1 transition-all duration-500 hover:scale-105 hover:!rotate-0">
      {/* Clean Technical Card Container */}
      <div className="relative w-[240px] 2xl:w-[275px] rounded-2xl bg-[#080d14] border border-white/[0.12] p-3.5 2xl:p-4.5 shadow-xl text-left select-none">
        {/* Window Action Dots */}
        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-white/[0.06]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>

        {/* Syntax-Highlighted Monospace Code Snippet */}
        <div className="font-mono text-[12px] sm:text-[13px] leading-relaxed tracking-normal space-y-1">
          <div className="text-emerald-400/70 font-medium">
            // Build
          </div>
          <div className="text-[#f1f5f9]">
            <span className="text-pink-400">app</span>
            <span className="text-slate-400">.</span>
            <span className="text-blue-400">get</span>
            <span className="text-slate-300">(</span>
            <span className="text-[#38bdf8]">&quot;/api/users&quot;</span>
            <span className="text-slate-300">, (</span>
            <span className="text-amber-300">req</span>
            <span className="text-slate-400">, </span>
            <span className="text-amber-300">res</span>
            <span className="text-slate-300">) =&gt; &#123;</span>
          </div>
          <div className="pl-4 text-[#f1f5f9]">
            <span className="text-amber-300">res</span>
            <span className="text-slate-400">.</span>
            <span className="text-blue-400">json</span>
            <span className="text-slate-300">(&#123; </span>
            <span className="text-slate-300">success: </span>
            <span className="text-[#10b981] font-bold">true</span>
            <span className="text-slate-300"> &#125;);</span>
          </div>
          <div className="text-slate-300">&#125;);</div>
        </div>
      </div>
    </div>
  );
};
