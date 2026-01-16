import { useState, useEffect } from 'react';

interface Stage4Props {
  onNext: () => void;
  playSFX: (type: string) => void;
}

function Suitcase({ 
  size, 
  color, 
  label, 
  onBelt,
  position
}: { 
  size: 'small' | 'large'; 
  color: string;
  label: string;
  onBelt: boolean;
  position: number;
}) {
  const isSmall = size === 'small';
  
  return (
    <div 
      className="absolute transition-all duration-1000 ease-out"
      style={{
        left: onBelt ? `${position}%` : '-30%',
        bottom: '2rem',
        transform: `translateX(-50%)`
      }}
    >
      <div className={`suitcase ${isSmall ? 'scale-75' : 'scale-100'}`}>
        {/* Handle */}
        <div 
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-7 rounded-t-lg border-2 border-b-0"
          style={{ 
            background: `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)`,
            borderColor: `${color}99`
          }}
        />
        
        {/* Body */}
        <div 
          className="relative rounded-xl overflow-hidden border-3"
          style={{ 
            width: isSmall ? '80px' : '100px',
            height: isSmall ? '60px' : '80px',
            background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
            borderColor: `${color}99`,
            borderWidth: '3px'
          }}
        >
          {/* Panels */}
          <div className="absolute inset-2 flex flex-col justify-between">
            <div className="h-1 bg-black/10 rounded" />
            <div className="flex items-center gap-1">
              <div className="flex-1 h-0.5 bg-black/20" />
              <div className="w-2 h-2 bg-black/20 rounded-sm" />
            </div>
            <div className="h-1 bg-black/10 rounded" />
          </div>

          {/* Stickers */}
          <div className="absolute bottom-2 right-2 text-[8px] font-mono bg-white/80 px-1 rounded">
            {label}
          </div>
        </div>

        {/* Wheels */}
        <div 
          className="absolute -bottom-2 left-3 w-4 h-4 rounded-full border-2"
          style={{ 
            background: 'linear-gradient(180deg, #3f3f46 0%, #18181b 100%)',
            borderColor: '#52525b'
          }}
        />
        <div 
          className="absolute -bottom-2 right-3 w-4 h-4 rounded-full border-2"
          style={{ 
            background: 'linear-gradient(180deg, #3f3f46 0%, #18181b 100%)',
            borderColor: '#52525b'
          }}
        />

        {/* Tag */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 bg-card border-l-4 border-accent px-2 py-1 rounded-r text-[7px] font-mono shadow-sm">
          GAB-23
        </div>
      </div>
    </div>
  );
}

export function Stage4ConveyorBelt({ onNext, playSFX }: Stage4Props) {
  const [suitcase1Arrived, setSuitcase1Arrived] = useState(false);
  const [suitcase2Arrived, setSuitcase2Arrived] = useState(false);
  const [bothCollected, setBothCollected] = useState(false);

  useEffect(() => {
    // First suitcase arrives
    setTimeout(() => {
      playSFX('beep');
      setSuitcase1Arrived(true);
    }, 1000);

    // Second suitcase arrives
    setTimeout(() => {
      playSFX('beep');
      setSuitcase2Arrived(true);
    }, 2500);

    // Auto proceed after both arrive
    setTimeout(() => {
      playSFX('success');
      setBothCollected(true);
      setTimeout(onNext, 1500);
    }, 4500);
  }, [onNext, playSFX]);

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Recogida de Equipaje
          </h2>
          <p className="text-muted-foreground">
            Tu equipaje está llegando a la cinta
          </p>
        </div>

        {/* Conveyor Belt Scene */}
        <div className="relative h-72 mb-8 terminal-card overflow-hidden">
          {/* Ceiling lights */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-300 to-transparent flex justify-around items-start pt-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-4 bg-yellow-100 rounded-b shadow-lg opacity-60" />
            ))}
          </div>

          {/* Belt area */}
          <div className="absolute bottom-8 left-4 right-4">
            {/* Belt sides */}
            <div className="absolute -left-2 bottom-0 w-4 h-20 bg-gradient-to-r from-zinc-600 to-zinc-500 rounded-l-lg" />
            <div className="absolute -right-2 bottom-0 w-4 h-20 bg-gradient-to-l from-zinc-600 to-zinc-500 rounded-r-lg" />
            
            {/* Belt surface */}
            <div className="conveyor-belt h-6" />
            
            {/* Belt structure */}
            <div className="mt-1 h-8 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-lg flex items-center justify-around px-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-4 bg-zinc-600 rounded" />
              ))}
            </div>
          </div>

          {/* Suitcases */}
          <Suitcase 
            size="large" 
            color="#27272a" 
            label="COTY-1"
            onBelt={suitcase1Arrived}
            position={35}
          />
          <Suitcase 
            size="small" 
            color="#be123c" 
            label="COTY-2"
            onBelt={suitcase2Arrived}
            position={65}
          />

          {/* Info display */}
          <div className="absolute top-12 left-4 right-4 flex justify-between items-center">
            <div className="bg-zinc-900 px-3 py-1 rounded text-xs font-mono text-amber-400">
              CINTA 23
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${suitcase1Arrived && suitcase2Arrived ? 'bg-led-green' : 'bg-led-amber animate-pulse'}`} />
              <span className="text-xs text-muted-foreground">
                {suitcase1Arrived && suitcase2Arrived ? 'Completo' : 'En proceso'}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`terminal-card py-4 text-center transition-all ${suitcase1Arrived ? 'border-green-500/50' : ''}`}>
            <div className="text-sm font-semibold mb-1">Valija Grande</div>
            <div className={`text-xs ${suitcase1Arrived ? 'text-green-600' : 'text-muted-foreground'}`}>
              {suitcase1Arrived ? '✓ Recibida' : 'Esperando...'}
            </div>
          </div>
          <div className={`terminal-card py-4 text-center transition-all ${suitcase2Arrived ? 'border-green-500/50' : ''}`}>
            <div className="text-sm font-semibold mb-1">Carry-on</div>
            <div className={`text-xs ${suitcase2Arrived ? 'text-green-600' : 'text-muted-foreground'}`}>
              {suitcase2Arrived ? '✓ Recibida' : 'Esperando...'}
            </div>
          </div>
        </div>

        {/* Complete */}
        {bothCollected && (
          <div className="text-center animate-slide-in">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-6 py-3 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-semibold">Equipaje completo</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
