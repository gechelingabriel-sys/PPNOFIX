import { useState } from 'react';
import { FLIGHT_DATA, ASSETS } from '@/lib/flightData';

interface Stage6Props {
  onNext: () => void;
  playSFX: (type: string) => void;
  vibrate: (pattern?: number | number[]) => void;
}

const STAMPS = [
  { country: 'ARG', color: '#3B82F6', delay: 0 },
  { country: 'ESP', color: '#EF4444', delay: 1200 },
  { country: 'VIP', color: '#D97706', delay: 2400 }
];

function PassportPage({ onStamp, stamps }: { onStamp: () => void; stamps: number[] }) {
  return (
    <div className="relative">
      {/* Passport cover (closed state styling reference) */}
      <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-lg shadow-strong overflow-hidden">
        {/* Embossed border */}
        <div className="absolute inset-2 border border-amber-600/30 rounded-lg" />
        
        {/* Content */}
        <div className="relative p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-amber-400/80 text-xs tracking-[0.3em] uppercase mb-1">
              {FLIGHT_DATA.airline}
            </div>
            <div className="text-amber-300 text-lg font-bold tracking-wide">
              PASAPORTE
            </div>
            <div className="text-amber-400/60 text-[10px] tracking-widest mt-1">
              PASSPORT • PASSEPORT
            </div>
          </div>

          {/* Emblem */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center">
              <span className="text-4xl">✈</span>
            </div>
          </div>

          {/* Photo section */}
          <div className="bg-blue-950/50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Photo */}
              <div className="aspect-[3/4] rounded border border-amber-500/20 overflow-hidden">
                <img 
                  src={ASSETS.cotyPhoto} 
                  alt={FLIGHT_DATA.passenger}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Data */}
              <div className="col-span-2 text-left space-y-2">
                <div>
                  <div className="text-[8px] text-amber-400/60 uppercase">Nombre</div>
                  <div className="text-amber-200 text-sm font-mono">{FLIGHT_DATA.passenger}</div>
                </div>
                <div>
                  <div className="text-[8px] text-amber-400/60 uppercase">Vuelo</div>
                  <div className="text-amber-200 text-sm font-mono">{FLIGHT_DATA.flightNumber}</div>
                </div>
                <div>
                  <div className="text-[8px] text-amber-400/60 uppercase">Destino</div>
                  <div className="text-amber-200 text-sm font-mono">{FLIGHT_DATA.route.destination}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stamps area */}
          <div className="relative h-32 bg-blue-950/30 rounded-lg border border-dashed border-amber-500/20 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-amber-400/20 text-xs">
              ÁREA DE SELLOS
            </div>
            
            {/* Stamps */}
            {stamps.includes(0) && (
              <div className="absolute top-2 left-4 rotate-[-8deg] animate-stamp">
                <div className="border-4 border-blue-500 text-blue-500 px-4 py-2 rounded-lg font-bold text-sm">
                  <div className="text-[8px] text-center">SALIDA</div>
                  ARG ✓
                </div>
              </div>
            )}
            
            {stamps.includes(1) && (
              <div className="absolute top-6 right-4 rotate-[5deg] animate-stamp">
                <div className="border-4 border-red-500 text-red-500 px-4 py-2 rounded-lg font-bold text-sm">
                  <div className="text-[8px] text-center">ENTRADA</div>
                  ESP ✓
                </div>
              </div>
            )}
            
            {stamps.includes(2) && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rotate-[-3deg] animate-stamp">
                <div className="border-4 border-amber-500 text-amber-500 px-4 py-2 rounded-full font-bold text-sm">
                  ★ VIP ★
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tap to stamp indicator */}
      {stamps.length < 3 && (
        <button 
          onClick={onStamp}
          className="absolute inset-0 flex items-end justify-center pb-4 bg-transparent"
        >
          <span className="bg-foreground/90 text-background px-4 py-2 rounded-full text-sm font-medium animate-pulse">
            Toca para sellar
          </span>
        </button>
      )}
    </div>
  );
}

export function Stage6Passport({ onNext, playSFX, vibrate }: Stage6Props) {
  const [stamps, setStamps] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);

  const handleStamp = () => {
    if (stamps.length >= 3 || complete) return;

    const nextStamp = stamps.length;
    playSFX('stamp');
    vibrate(50);
    
    setStamps(prev => [...prev, nextStamp]);

    if (nextStamp === 2) {
      setTimeout(() => {
        playSFX('success');
        setComplete(true);
        setTimeout(onNext, 1500);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Control de Pasaportes
          </h2>
          <p className="text-muted-foreground">
            Recibe tus sellos oficiales
          </p>
        </div>

        {/* Passport */}
        <div className="mb-8 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <PassportPage onStamp={handleStamp} stamps={stamps} />
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-3 mb-6">
          {STAMPS.map((stamp, index) => (
            <div 
              key={stamp.country}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${
                stamps.includes(index) 
                  ? 'border-current opacity-100' 
                  : 'border-muted-foreground/30 opacity-40'
              }`}
              style={{ color: stamps.includes(index) ? stamp.color : undefined }}
            >
              {stamp.country}
            </div>
          ))}
        </div>

        {/* Complete */}
        {complete && (
          <div className="text-center animate-slide-in">
            <div className="stamp-approved">
              ✓ PASAPORTE SELLADO
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
