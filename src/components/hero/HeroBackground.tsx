import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Luminous Ambient Top Studio Glow (Shine & depth behind navbar and headline) */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.05) 50%, transparent 80%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 2. High-Resolution Luminous Globe Artwork */}
      <img
        src="/background.png"
        alt="APIRun Hero Background"
        className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none opacity-90 brightness-110 saturate-[1.1]"
        style={{ 
          objectPosition: 'center bottom',
          minHeight: '100%',
          minWidth: '100%'
        }}
      />

      {/* 3. Radiant Horizon Light Arc Behind Globe Curve */}
      <div 
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[85%] max-w-4xl h-[180px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.16) 0%, rgba(16, 185, 129, 0.06) 40%, transparent 75%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 4. Smooth Bottom Transition into Page Background */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5, 7, 8, 0.7) 60%, #050708 100%)'
        }}
      />
    </div>
  );
};
