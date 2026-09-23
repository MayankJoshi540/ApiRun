'use client';

import React from 'react';

interface LanguageItem {
  name: string;
  runtime: string;
  accentColor: string;
  glowColor: string;
  svg: React.ReactNode;
}

const ROW_1_LANGUAGES: LanguageItem[] = [
  {
    name: 'Python',
    runtime: 'FastAPI / Django',
    accentColor: 'text-[#38BDF8]',
    glowColor: 'hover:border-[#38BDF8]/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M11.91 2c-3.1 0-5.61 2.2-5.61 4.93v2.46h5.61v.82H4.43C2.53 10.21 1 11.58 1 14.05c0 2.46 1.53 4.11 3.43 4.11h1.72v-2.46c0-2.02 1.76-3.7 3.76-3.7h5.61c1.88 0 3.42-1.53 3.42-3.42V6.93C18.97 4.2 16.46 2 11.91 2zm-1.89 2.05a1.03 1.03 0 110 2.06 1.03 1.03 0 010-2.06z" fill="#38BDF8"/>
        <path d="M12.09 22c3.1 0 5.61-2.2 5.61-4.93v-2.46h-5.61v-.82h7.48c1.9 0 3.43-1.37 3.43-3.84 0-2.46-1.53-4.11-3.43-4.11h-1.72v2.46c0 2.02-1.76 3.7-3.76 3.7H8.47c-1.88 0-3.42 1.53-3.42 3.42v1.65c0 2.73 2.51 4.93 7.04 4.93zm1.89-2.05a1.03 1.03 0 110-2.06 1.03 1.03 0 010 2.06z" fill="#FACC15"/>
      </svg>
    )
  },
  {
    name: 'Go',
    runtime: 'Gin / Fiber / Standard',
    accentColor: 'text-[#00ADD8]',
    glowColor: 'hover:border-[#00ADD8]/50 hover:shadow-[0_0_25px_rgba(0,173,216,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M1.98 10.43c.27-.47.66-.86 1.15-1.12.49-.27 1.05-.39 1.62-.35.57.04 1.1.25 1.54.6.43.36.74.84.88 1.39l-1.34.4c-.08-.32-.26-.6-.5-.8-.25-.2-.55-.31-.87-.33-.32-.02-.63.05-.9.2-.27.15-.48.37-.63.63-.15.27-.22.57-.2.88.02.3.13.59.32.83.19.23.45.4.75.47.3.07.61.05.9-.06.29-.11.53-.3.7-.55l1.24.64c-.3.44-.7.78-1.18 1-.48.21-1.01.29-1.54.22-.53-.07-1.02-.29-1.42-.64-.4-.36-.68-.82-.82-1.34-.14-.52-.13-1.07.03-1.58.16-.51.46-.95.87-1.27.4-.33.9-.52 1.41-.57.52-.05 1.04.05 1.5.29.47.24.85.6 1.11 1.05zM12 9.5h5.5v1.4H13.6v2.1h3.4v1.4h-3.4v2.6H12V9.5zm8 0h1.6v7.5H20V9.5z" fill="#00ADD8"/>
      </svg>
    )
  },
  {
    name: 'TypeScript',
    runtime: 'Node / Bun / Deno',
    accentColor: 'text-[#3178C6]',
    glowColor: 'hover:border-[#3178C6]/50 hover:shadow-[0_0_25px_rgba(49,120,198,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M14.7 13.5c.3.5.7.9 1.2 1.2.5.3 1.1.4 1.8.4.6 0 1.1-.1 1.5-.4.4-.3.6-.6.6-1.1 0-.3-.1-.6-.3-.8-.2-.2-.5-.4-.9-.5l-1.3-.4c-.8-.3-1.4-.6-1.9-1.1-.5-.5-.7-1.1-.7-1.8 0-.8.3-1.5.9-2.1.6-.6 1.5-.9 2.5-.9.9 0 1.7.2 2.4.7.7.5 1.1 1.1 1.3 1.9l-1.8.7c-.1-.4-.4-.8-.7-1-.3-.2-.8-.4-1.3-.4-.5 0-.9.1-1.2.3-.3.2-.5.5-.5.8 0 .3.1.5.3.7.2.2.5.3.9.4l1.3.4c.9.3 1.6.7 2.1 1.2.5.5.7 1.2.7 2 0 .9-.3 1.6-1 2.2-.7.6-1.6.9-2.7.9-1.1 0-2.1-.3-2.9-.9-.8-.6-1.3-1.4-1.5-2.4l1.7-.5zm-8.8-6.3h8.2v1.8h-3.1v9.6h-2V9h-3.1V7.2z" fill="#FFFFFF"/>
      </svg>
    )
  },
  {
    name: 'Rust',
    runtime: 'Actix / Axum / Tokio',
    accentColor: 'text-[#DEA584]',
    glowColor: 'hover:border-[#DEA584]/50 hover:shadow-[0_0_25px_rgba(222,165,132,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#DEA584" strokeWidth="2"/>
        <path d="M8 8h4.5c1.4 0 2.5 1.1 2.5 2.5S13.9 13 12.5 13H10v3H8V8zm2 3.5h2.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H10v1zm3 1.5l2.5 3h2l-2.8-3.4c.8-.4 1.3-1.2 1.3-2.1 0-1.4-1.1-2.5-2.5-2.5H8v8h2v-3h3z" fill="#DEA584"/>
      </svg>
    )
  },
  {
    name: 'Node.js',
    runtime: 'Express / Fastify / NestJS',
    accentColor: 'text-[#5FA04E]',
    glowColor: 'hover:border-[#5FA04E]/50 hover:shadow-[0_0_25px_rgba(95,160,78,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l9.5 5.5v11L12 24l-9.5-5.5v-11L12 2zm0 2.3L4.5 8.7v6.6L12 19.7l7.5-4.4V8.7L12 4.3z" fill="#5FA04E"/>
        <circle cx="12" cy="12" r="3" fill="#5FA04E"/>
      </svg>
    )
  },
  {
    name: 'Java',
    runtime: 'Spring Boot / Quarkus',
    accentColor: 'text-[#E76F00]',
    glowColor: 'hover:border-[#E76F00]/50 hover:shadow-[0_0_25px_rgba(231,111,0,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 2c1.5 2.5 1 4.5-1 6.5 2.5-.5 4.5-2 4-5-1.5 3-3.5 4.5-4 7 2-.5 4-2 3.5-5-.5 3-2 5-3.5 6.5 3 0 5.5-1.5 5.5-4C16.5 11 12 14 12 18c0 1.5.5 3 2 4-3.5-1-4-4-2-6-3 2-2 5 .5 7-4.5-1-6-4.5-3-8 1-1.5 2.5-2.5 2.5-5 0-3-2-5.5-2-8z" fill="#E76F00"/>
        <path d="M4 19c3 1.5 8 1.5 11 0l-.5 1.5c-3 1-8 1-10 0L4 19z" fill="#5382A1"/>
      </svg>
    )
  }
];

const ROW_2_LANGUAGES: LanguageItem[] = [
  {
    name: 'C# / .NET',
    runtime: 'ASP.NET Core / WebAPI',
    accentColor: 'text-[#A070E8]',
    glowColor: 'hover:border-[#A070E8]/50 hover:shadow-[0_0_25px_rgba(160,112,232,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 2.3l7.5 4.1v7.2L12 19.7l-7.5-4.1V8.4L12 4.3z" fill="#512BD4"/>
        <path d="M11 9.5c-.3-.3-.7-.5-1.2-.5-.8 0-1.5.6-1.5 1.5v3c0 .9.7 1.5 1.5 1.5.5 0 .9-.2 1.2-.5l1 1c-.6.6-1.3.9-2.2.9-1.9 0-3.3-1.4-3.3-3.4v-2c0-2 1.4-3.4 3.3-3.4.9 0 1.6.3 2.2.9l-1 1zM14 9h1.5v1.5H14v1.5h1.5v1.5H14V15h-1.5V9H14zm3 0h1.5v1.5H17v1.5h1.5v1.5H17V15h-1.5V9H17z" fill="#FFFFFF"/>
      </svg>
    )
  },
  {
    name: 'C++',
    runtime: 'Crow / Boost.Beast',
    accentColor: 'text-[#659AD2]',
    glowColor: 'hover:border-[#659AD2]/50 hover:shadow-[0_0_25px_rgba(101,154,210,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 6v12l9 4 9-4V6l-9-4z" fill="#00599C"/>
        <path d="M12 4l7 3.1v9.8L12 20l-7-3.1V7.1L12 4z" fill="#004482"/>
        <path d="M10 10.5a2.5 2.5 0 00-2.5-2.5c-1.4 0-2.5 1.1-2.5 2.5v3c0 1.4 1.1 2.5 2.5 2.5a2.5 2.5 0 002.5-2.5h-1.5a1 1 0 01-1 1c-.6 0-1-.4-1-1v-3c0-.6.4-1 1-1a1 1 0 011 1H10zm3 1h1v-1h1v1h1v1h-1v1h-1v-1h-1v-1zm4 0h1v-1h1v1h1v1h-1v1h-1v-1h-1v-1z" fill="#FFFFFF"/>
      </svg>
    )
  },
  {
    name: 'Ruby',
    runtime: 'Rails / Sinatra / Hanami',
    accentColor: 'text-[#CC342D]',
    glowColor: 'hover:border-[#CC342D]/50 hover:shadow-[0_0_25px_rgba(204,52,45,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M19.5 3h-15L2 8.5l10 13 10-13L19.5 3z" fill="#CC342D"/>
        <path d="M12 18.5L4.8 9h14.4L12 18.5z" fill="#E85E56"/>
      </svg>
    )
  },
  {
    name: 'PHP',
    runtime: 'Laravel / Symfony / Swoole',
    accentColor: 'text-[#8892BF]',
    glowColor: 'hover:border-[#8892BF]/50 hover:shadow-[0_0_25px_rgba(136,146,191,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="6" fill="#777BB4"/>
        <path d="M8.5 10h-2l-1 4h1.5l.3-1.2h.7c1 0 1.7-.6 1.9-1.4.2-.8-.2-1.4-1.4-1.4zm-.4 1.4c-.1.4-.4.6-.8.6h-.5l.3-1.2h.5c.4 0 .6.2.5.6zm5.4-1.4h-2l-1 4h1.5l.3-1.2h.7c1 0 1.7-.6 1.9-1.4.2-.8-.2-1.4-1.4-1.4zm-.4 1.4c-.1.4-.4.6-.8.6h-.5l.3-1.2h.5c.4 0 .6.2.5.6zm5.4-1.4h-2l-1 4h1.5l.3-1.2h.7c1 0 1.7-.6 1.9-1.4.2-.8-.2-1.4-1.4-1.4zm-.4 1.4c-.1.4-.4.6-.8.6h-.5l.3-1.2h.5c.4 0 .6.2.5.6z" fill="#FFFFFF"/>
      </svg>
    )
  },
  {
    name: 'Kotlin',
    runtime: 'Ktor / Spring Boot',
    accentColor: 'text-[#7F52FF]',
    glowColor: 'hover:border-[#7F52FF]/50 hover:shadow-[0_0_25px_rgba(127,82,255,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M22 2L2 22h20V2z" fill="#7F52FF"/>
        <path d="M2 2l10 10L2 22V2z" fill="#C757BC"/>
        <path d="M12 12L2 2h20L12 12z" fill="#E26D5C"/>
      </svg>
    )
  },
  {
    name: 'Elixir',
    runtime: 'Phoenix / Plug / OTP',
    accentColor: 'text-[#A074C4]',
    glowColor: 'hover:border-[#A074C4]/50 hover:shadow-[0_0_25px_rgba(160,116,196,0.2)]',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.5 7.5 5 12 5 15.5 5 19.1 7.9 22 11.5 22c3.4 0 6.2-2.6 6.5-6 .3-3.5-2.5-7.5-6-14z" fill="#6E4A9E"/>
        <path d="M12 5c-2 4-4.5 7.5-4.5 10 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5c0-2.5-2.5-6-4.5-10z" fill="#9370DB"/>
      </svg>
    )
  }
];

export const BackendTechMarquee: React.FC = () => {
  const row1Duplicated = [...ROW_1_LANGUAGES, ...ROW_1_LANGUAGES, ...ROW_1_LANGUAGES];
  const row2Duplicated = [...ROW_2_LANGUAGES, ...ROW_2_LANGUAGES, ...ROW_2_LANGUAGES];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden relative select-none font-sans space-y-10 sm:space-y-12">
      {/* Prominent Section Header in Plus Jakarta Sans */}
      <div className="text-center space-y-3 max-w-3xl mx-auto px-4">
        <div className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
          SUPPORTED LANGUAGES &amp; RUNTIMES
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05]">
          Write in whatever you build with.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Submit and test real API endpoints in Python, Go, TypeScript, Rust, Node.js, Java, C#, C++, Ruby, PHP, and more.
        </p>
      </div>

      {/* 3D Perspective Stage */}
      <div 
        className="relative w-full max-w-7xl mx-auto overflow-hidden px-2 sm:px-4 py-4"
        style={{
          perspective: '1200px',
          maskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        {/* 3D Angled Plane */}
        <div 
          className="space-y-3 sm:space-y-5 transition-transform duration-500 will-change-transform"
          style={{
            transform: 'rotateX(14deg) rotateZ(-2.5deg) skewX(2deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Row 1: Marquee Left */}
          <div className="flex w-max animate-marquee-left space-x-3 sm:space-x-5 py-1">
            {row1Duplicated.map((item, idx) => (
              <div
                key={`r1-${idx}`}
                className={`flex items-center space-x-3 sm:space-x-3.5 px-4 sm:px-6 py-2.5 sm:py-4 rounded-2xl bg-[#0a0e17]/95 border border-white/[0.1] ${item.glowColor} transition-all duration-300 hover:scale-[1.05] hover:bg-white/[0.05] shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl group cursor-default shrink-0`}
              >
                <div className="shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {item.svg}
                </div>
                <div className="text-left font-sans">
                  <div className="text-xs sm:text-base font-bold text-white tracking-tight leading-none group-hover:text-emerald-300 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-[11px] sm:text-xs font-medium text-slate-400 tracking-normal mt-1 leading-none">
                    {item.runtime}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Marquee Right */}
          <div className="flex w-max animate-marquee-right space-x-3 sm:space-x-5 py-1">
            {row2Duplicated.map((item, idx) => (
              <div
                key={`r2-${idx}`}
                className={`flex items-center space-x-3 sm:space-x-3.5 px-4 sm:px-6 py-2.5 sm:py-4 rounded-2xl bg-[#0a0e17]/95 border border-white/[0.1] ${item.glowColor} transition-all duration-300 hover:scale-[1.05] hover:bg-white/[0.05] shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl group cursor-default shrink-0`}
              >
                <div className="shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {item.svg}
                </div>
                <div className="text-left font-sans">
                  <div className="text-xs sm:text-base font-bold text-white tracking-tight leading-none group-hover:text-emerald-300 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-[11px] sm:text-xs font-medium text-slate-400 tracking-normal mt-1 leading-none">
                    {item.runtime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
