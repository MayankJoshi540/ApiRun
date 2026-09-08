import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Background image from public/background.png */}
      <img
        src="/background.png"
        alt="APIRun Hero Background"
        className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none"
        style={{ 
          objectPosition: 'center bottom',
          minHeight: '100%',
          minWidth: '100%'
        }}
      />

      {/* 2. Seamless bottom transition into page background */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5, 7, 8, 0.7) 60%, #050708 100%)'
        }}
      />
    </div>
  );
};
