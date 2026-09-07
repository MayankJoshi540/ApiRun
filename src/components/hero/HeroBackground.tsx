import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Background Image from public/background.png with smooth entrance on reload */}
      <img
        src="/background.png"
        alt="API Run Hero Background"
        className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none animate-bg-reveal"
        style={{ 
          objectPosition: 'center bottom',
          minHeight: '100%',
          minWidth: '100%'
        }}
      />

      {/* 2. Seamless bottom transition */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5, 7, 8, 0.6) 60%, #050708 100%)'
        }}
      />
    </div>
  );
};
