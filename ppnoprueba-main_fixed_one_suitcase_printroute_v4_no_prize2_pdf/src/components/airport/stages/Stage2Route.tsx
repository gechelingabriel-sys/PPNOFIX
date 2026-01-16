import { useState, useEffect, useRef } from 'react';
import { FLIGHT_DATA } from '@/lib/flightData';

interface Stage2Props {
  onNext: () => void;
  playSFX: (type: string) => void;
}

export function Stage2Route({ onNext, playSFX }: Stage2Props) {
  const [progress, setProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Route animation
  useEffect(() => {
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setShowComplete(true);
        playSFX('chime');
        setTimeout(onNext, 2000);
      }
    };

    requestAnimationFrame(animate);
  }, [onNext, playSFX]);

  // Draw route on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < rect.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, rect.height);
      ctx.stroke();
    }
    for (let i = 0; i < rect.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(rect.width, i);
      ctx.stroke();
    }

    // Route path (curved arc)
    const startX = 60;
    const startY = rect.height - 80;
    const endX = rect.width - 60;
    const endY = 80;
    const controlX = rect.width / 2;
    const controlY = -50;

    // Full route (dashed)
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke();

    // Progress route (solid)
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    // Calculate point on curve based on progress
    const t = progress;
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;

    // Draw partial curve
    for (let i = 0; i <= progress; i += 0.01) {
      const px = (1 - i) * (1 - i) * startX + 2 * (1 - i) * i * controlX + i * i * endX;
      const py = (1 - i) * (1 - i) * startY + 2 * (1 - i) * i * controlY + i * i * endY;
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Origin marker
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(startX, startY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fafafa';
    ctx.font = 'bold 8px "Space Grotesk"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CBA', startX, startY);

    // Destination marker
    ctx.fillStyle = showComplete ? '#16a34a' : '#71717a';
    ctx.beginPath();
    ctx.arc(endX, endY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fafafa';
    ctx.fillText('ALC', endX, endY);

    // Airplane
    const angle = Math.atan2(
      2 * (1 - t) * (controlY - startY) + 2 * t * (endY - controlY),
      2 * (1 - t) * (controlX - startX) + 2 * t * (endX - controlX)
    );

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Airplane body
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Wings
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(-12, -14);
    ctx.lineTo(-8, -14);
    ctx.lineTo(4, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(-12, 14);
    ctx.lineTo(-8, 14);
    ctx.lineTo(4, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-22, -8);
    ctx.lineTo(-18, -8);
    ctx.lineTo(-14, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();

  }, [progress, showComplete]);

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col">
        {/* Title */}
        <div className="text-center mb-6 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Ruta de Vuelo
          </h2>
          <p className="text-muted-foreground">
            {FLIGHT_DATA.route.originFull} → {FLIGHT_DATA.route.destinationFull}
          </p>
        </div>

        {/* Route visualization */}
        <div className="flex-1 terminal-card p-4 mb-6">
          <canvas 
            ref={canvasRef}
            className="w-full h-64 md:h-80"
            style={{ display: 'block' }}
          />
        </div>

        {/* Flight info */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="terminal-card py-4">
            <div className="text-2xl font-bold font-mono text-foreground">
              {Math.round(8500 * progress)}
            </div>
            <div className="text-xs text-muted-foreground">km recorridos</div>
          </div>
          <div className="terminal-card py-4">
            <div className="text-2xl font-bold font-mono text-foreground">
              {FLIGHT_DATA.flightNumber}
            </div>
            <div className="text-xs text-muted-foreground">vuelo</div>
          </div>
          <div className="terminal-card py-4">
            <div className="text-2xl font-bold font-mono text-foreground">
              {Math.round(progress * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">completado</div>
          </div>
        </div>

        {/* Status */}
        {showComplete && (
          <div className="text-center animate-slide-in">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-6 py-3 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold">Ruta confirmada</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
