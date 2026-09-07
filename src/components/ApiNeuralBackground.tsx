import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  isActivated: boolean;
  activationRadius: number;
  activationAlpha: number;
  type: 'gateway' | 'worker' | 'database' | 'standard';
}

interface Packet {
  startNode: number;
  endNode: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
  pathLength: number;
  hopsRemaining: number;
}

interface CircuitTrace {
  points: { x: number; y: number }[];
  speed: number;
  alpha: number;
  signalPos: number;
}

interface TelemetryFragment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
}

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

    // Mouse tracking for subtle parallax & interactive repulsion
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNetwork();
      initTraces();
    };

    window.addEventListener('resize', handleResize);

    // ----------------------------------------------------
    // Sharp, High-Contrast Modern Tech Network
    // ----------------------------------------------------
    let nodes: Node[] = [];
    const maxDistance = width < 768 ? 160 : 220;

    const initNetwork = () => {
      nodes = [];
      const count = width < 768 ? 32 : width < 1024 ? 48 : 65;
      
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const types: ('gateway' | 'worker' | 'database' | 'standard')[] = [
          'standard', 'standard', 'gateway', 'worker', 'database'
        ];
        const type = types[Math.floor(Math.random() * types.length)];

        const speed = 0.2 + Math.random() * 0.2;
        const angle = Math.random() * Math.PI * 2;

        nodes.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: type === 'gateway' ? 3.5 : type === 'database' ? 3.0 : 2.2,
          baseAlpha: 0.6 + Math.random() * 0.35,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.015,
          isActivated: false,
          activationRadius: 0,
          activationAlpha: 0,
          type
        });
      }
    };

    initNetwork();

    // Packets
    let packets: Packet[] = [];
    const colors = ['#00f2a9', '#38bdf8', '#22d3ee', '#34d399', '#a78bfa'];

    const spawnPacket = (startIdx?: number, endIdx?: number, hops = 1) => {
      if (nodes.length < 2) return;
      const sIdx = startIdx !== undefined ? startIdx : Math.floor(Math.random() * nodes.length);
      
      let candidateEnds: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (sIdx === j) continue;
        const dx = nodes[sIdx].x - nodes[j].x;
        const dy = nodes[sIdx].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDistance) {
          candidateEnds.push(j);
        }
      }

      if (candidateEnds.length === 0) return;
      const eIdx = endIdx !== undefined ? endIdx : candidateEnds[Math.floor(Math.random() * candidateEnds.length)];
      const startNode = nodes[sIdx];
      const endNode = nodes[eIdx];
      const pathDist = Math.hypot(endNode.x - startNode.x, endNode.y - startNode.y);

      packets.push({
        startNode: sIdx,
        endNode: eIdx,
        progress: 0,
        speed: (0.7 + Math.random() * 0.5) / (pathDist || 100),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2.5 + Math.random() * 1.0,
        pathLength: pathDist,
        hopsRemaining: hops
      });
    };

    for (let i = 0; i < 12; i++) {
      spawnPacket(undefined, undefined, Math.floor(Math.random() * 2) + 1);
    }

    // Telemetry fragments connecting background infrastructure to API evaluation
    const telemetryTerms = [
      'POST /users -> 201 CREATED [14ms]',
      'GET /users/:id -> 200 OK [6ms]',
      'CONTRACT :: SCHEMA VALID RFC-9110',
      'EDGE CASE :: 409 EMAIL_CONFLICT',
      'EDGE CASE :: 422 MALFORMED_RFC5322',
      'CONCURRENCY :: 100 BURST LOCK PASS',
      'POST /webhooks/stripe -> 200 OK',
      'IDEMPOTENCY :: DEDUP_KEY VERIFIED',
      'RATE_LIMIT 60/min -> 429 REJECT',
      'LATENCY :: 12.4ms (p99 < 25ms)',
      'REQUEST -> ATTACK -> PROVE',
      'ASSERTION :: 6/6 SUITE PASS',
      'REDIS :: ZSET_SLIDING_WINDOW_OK',
      'TLS 1.3 :: AES_GCM_256'
    ];

    let fragments: TelemetryFragment[] = [];

    const spawnFragment = () => {
      if (fragments.length > (width < 768 ? 4 : 7)) return;
      const text = telemetryTerms[Math.floor(Math.random() * telemetryTerms.length)];
      const x = Math.random() < 0.5 
        ? Math.random() * (width * 0.3) + 20 
        : Math.random() * (width * 0.32) + width * 0.65;
      const y = Math.random() * (height * 0.75) + 80;

      fragments.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.15 - Math.random() * 0.15,
        text,
        alpha: 0,
        maxAlpha: 0.45 + Math.random() * 0.3,
        life: 0,
        maxLife: 200 + Math.random() * 100
      });
    };

    for (let i = 0; i < 4; i++) {
      spawnFragment();
    }

    // Circuit Traces
    let circuitTraces: CircuitTrace[] = [];

    const initTraces = () => {
      circuitTraces = [];
      const count = width < 768 ? 3 : 5;
      for (let i = 0; i < count; i++) {
        const startX = (i / count) * width + (Math.random() * 120 - 60);
        const startY = Math.random() * height * 0.6;
        
        const points = [{ x: startX, y: startY }];
        let curX = startX;
        let curY = startY;

        for (let seg = 0; seg < 4; seg++) {
          if (seg % 2 === 0) {
            curY += 40 + Math.random() * 60;
          } else {
            curX += (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 80);
          }
          points.push({ x: curX, y: curY });
        }

        circuitTraces.push({
          points,
          speed: 0.5 + Math.random() * 0.4,
          alpha: 0.25 + Math.random() * 0.15,
          signalPos: Math.random()
        });
      }
    };

    initTraces();

    let nextPulseTime = performance.now() + 2500;
    let lastTime = performance.now();

    // ----------------------------------------------------
    // High-Contrast Render Loop (No blurry muddy gradients)
    // ----------------------------------------------------
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Clean, bright, modern dark canvas
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, width, height);

      // Clean crisp technical coordinate grid
      const gridSize = width < 768 ? 40 : 50;
      ctx.lineWidth = 1;

      // Subtle high-contrast grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Crosshair dots on grid intersections
      ctx.fillStyle = 'rgba(0, 242, 169, 0.3)';
      const step = gridSize * 2;
      for (let x = step; x < width; x += step) {
        for (let y = step; y < height; y += step) {
          ctx.fillRect(x - 1.5, y - 0.5, 3, 1);
          ctx.fillRect(x - 0.5, y - 1.5, 1, 3);
        }
      }

      // Circuit Traces
      for (let i = 0; i < circuitTraces.length; i++) {
        const trace = circuitTraces[i];
        ctx.strokeStyle = `rgba(56, 189, 248, ${trace.alpha * 0.6})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        if (trace.points.length > 0) {
          ctx.moveTo(trace.points[0].x, trace.points[0].y);
          for (let p = 1; p < trace.points.length; p++) {
            ctx.lineTo(trace.points[p].x, trace.points[p].y);
          }
        }
        ctx.stroke();

        trace.signalPos += 0.0035 * trace.speed;
        if (trace.signalPos > 1) trace.signalPos = 0;

        const totalSegments = trace.points.length - 1;
        const targetSeg = Math.min(Math.floor(trace.signalPos * totalSegments), totalSegments - 1);
        const segProgress = (trace.signalPos * totalSegments) - targetSeg;
        const p1 = trace.points[targetSeg];
        const p2 = trace.points[targetSeg + 1];

        if (p1 && p2) {
          const sx = p1.x + (p2.x - p1.x) * segProgress;
          const sy = p1.y + (p2.y - p1.y) * segProgress;

          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Node Physics & Movement
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 15) { n.x = 15; n.vx = Math.abs(n.vx); }
        if (n.x > width - 15) { n.x = width - 15; n.vx = -Math.abs(n.vx); }
        if (n.y < 15) { n.y = 15; n.vy = Math.abs(n.vy); }
        if (n.y > height - 15) { n.y = height - 15; n.vy = -Math.abs(n.vy); }

        // Mouse Repulsion
        if (mouseX > 0 && mouseY > 0) {
          const dx = n.x - mouseX;
          const dy = n.y - mouseY;
          const dist = Math.hypot(dx, dy);
          const repelRadius = 140;

          if (dist < repelRadius && dist > 1) {
            const force = (1 - dist / repelRadius) * 1.5;
            n.x += (dx / dist) * force;
            n.y += (dy / dist) * force;
          }
        }
      }

      // Connections (Crisp 1px lines)
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const proximityFactor = 1 - dist / maxDistance;
            const lineAlpha = proximityFactor * 0.18;

            ctx.strokeStyle = `rgba(0, 242, 169, ${lineAlpha})`;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // Nodes (Crisp solid dots without glowing halos)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = n.type === 'gateway' ? '#38bdf8' : n.type === 'database' ? '#a78bfa' : '#00f2a9';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Data Packets (Crisp solid particles without shadow blur)
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          const reachedNode = pkt.endNode;
          const hopsLeft = pkt.hopsRemaining - 1;
          packets.splice(p, 1);

          if (hopsLeft > 0 && Math.random() < 0.65) {
            spawnPacket(reachedNode, undefined, hopsLeft);
          }
          continue;
        }

        const startNode = nodes[pkt.startNode];
        const endNode = nodes[pkt.endNode];
        if (!startNode || !endNode) {
          packets.splice(p, 1);
          continue;
        }

        const curX = startNode.x + (endNode.x - startNode.x) * pkt.progress;
        const curY = startNode.y + (endNode.y - startNode.y) * pkt.progress;

        const trailLength = 0.15;
        const prevProgress = Math.max(0, pkt.progress - trailLength);
        const prevX = startNode.x + (endNode.x - startNode.x) * prevProgress;
        const prevY = startNode.y + (endNode.y - startNode.y) * prevProgress;

        ctx.strokeStyle = pkt.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(curX, curY);
        ctx.stroke();

        ctx.fillStyle = pkt.color;
        ctx.beginPath();
        ctx.arc(curX, curY, pkt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (packets.length < 11) {
        spawnPacket(undefined, undefined, 1);
      }

      // Activation Pulses
      if (time > nextPulseTime) {
        nextPulseTime = time + 3500 + Math.random() * 3000;
        if (nodes.length > 0) {
          const randNodeIdx = Math.floor(Math.random() * nodes.length);
          const targetNode = nodes[randNodeIdx];
          targetNode.isActivated = true;
          targetNode.activationRadius = targetNode.radius;
          targetNode.activationAlpha = 0.9;
          spawnPacket(randNodeIdx, undefined, 1);
        }
      }

      // Telemetry Tags
      ctx.font = '11px "JetBrains Mono", monospace';
      for (let f = fragments.length - 1; f >= 0; f--) {
        const frag = fragments[f];
        frag.life++;
        frag.x += frag.vx;
        frag.y += frag.vy;

        if (frag.life < 30) {
          frag.alpha = (frag.life / 30) * frag.maxAlpha;
        } else if (frag.life > frag.maxLife - 40) {
          frag.alpha = ((frag.maxLife - frag.life) / 40) * frag.maxAlpha;
        } else {
          frag.alpha = frag.maxAlpha;
        }

        if (frag.life >= frag.maxLife) {
          fragments.splice(f, 1);
          continue;
        }

        ctx.fillStyle = `rgba(0, 242, 169, ${frag.alpha})`;
        ctx.fillText(frag.text, frag.x, frag.y);
      }

      if (Math.random() < 0.02) {
        spawnFragment();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
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
