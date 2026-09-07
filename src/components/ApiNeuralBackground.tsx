import React, { useEffect, useRef } from 'react';

export const ApiNeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      // 1. Pure deep dark background #08090c
      ctx.fillStyle = '#08090c';
      ctx.fillRect(0, 0, width, height);

      // 2. Soft top ambient vignette
      const radialGrad = ctx.createRadialGradient(
        width / 2, 0, 0,
        width / 2, 0, Math.min(width, 900)
      );
      radialGrad.addColorStop(0, 'rgba(16, 185, 129, 0.035)');
      radialGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.008)');
      radialGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  );
};
