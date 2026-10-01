import React from 'react';

interface AppBackgroundProps {
  className?: string;
  opacity?: string;
  height?: string;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({
  className = '',
  opacity = 'opacity-75',
  height = 'h-[950px]',
}) => {
  return (
    <div className={`absolute top-0 left-0 right-0 ${height} overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* 1. Luminous Ambient Top Studio Glow */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16, 185, 129, 0.16), rgba(5, 150, 105, 0.04) 50%, transparent 80%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 2. High-Resolution Globe & Network Artwork */}
      <img
        src="/background.png"
        alt="APIRun Background"
        className={`absolute inset-0 w-full h-full object-cover object-bottom select-none ${opacity} brightness-105 saturate-[1.05]`}
        style={{ 
          objectPosition: 'center bottom',
          minHeight: '100%',
          minWidth: '100%'
        }}
      />

      {/* 3. Radiant Horizon Light Arc */}
      <div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[85%] max-w-4xl h-[160px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 75%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 4. Natural Bottom Fade into Page Surface */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5, 7, 8, 0.6) 50%, #050708 100%)'
        }}
      />
    </div>
  );
};
