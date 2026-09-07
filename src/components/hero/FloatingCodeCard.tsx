import React from 'react';

export const FloatingCodeCard: React.FC = () => {
  return (
    <div className="relative group animate-card-float-1 transition-all duration-500 hover:scale-105 hover:!rotate-0">
      {/* Background Soft Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00f2a9]/20 to-transparent rounded-2xl blur-lg opacity-40 group-hover:opacity-80 transition duration-500 pointer-events-none" />

      {/* Glassmorphic Card Container */}
      <div className="relative w-[240px] 2xl:w-[275px] rounded-2xl bg-[#080d14]/85 border border-white/[0.12] p-3.5 2xl:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-left select-none">
        {/* Window Action Dots */}
        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-white/[0.06]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 shadow-[0_0_6px_rgba(255,95,86,0.4)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 shadow-[0_0_6px_rgba(255,189,46,0.4)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 shadow-[0_0_6px_rgba(39,201,63,0.4)]" />
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
            <span className="text-[#38bdf8]">"/api/users"</span>
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
            <span className="text-[#00f2a9] font-bold">true</span>
            <span className="text-slate-300"> &#125;);</span>
          </div>
          <div className="text-slate-300">&#125;);</div>
        </div>
      </div>
    </div>
  );
};
