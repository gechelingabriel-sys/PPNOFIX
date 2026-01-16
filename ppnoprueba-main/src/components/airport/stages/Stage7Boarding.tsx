import { useState, useEffect } from 'react';
import { ASSETS, FLIGHT_DATA } from '@/lib/flightData';

interface Stage7Props {
  onNext: () => void;
  playSFX: (type: string) => void;
  vibrate: (pattern?: number | number[]) => void;
}

function Turnstile({ isOpen, onPass }: { isOpen: boolean; onPass: () => void }) {
  return (
    <div className="relative">
      {/* Turnstile structure */}
      <div className="relative bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-xl p-4 shadow-strong">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-led-green' : 'bg-led-red'}`} />
            <span className="text-xs font-mono text-zinc-600">
              {isOpen ? 'ACCESO PERMITIDO' : 'ESCANEE QR'}
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-500">{FLIGHT_DATA.gate}</span>
        </div>

        {/* Scanner area */}
        <div className="flex gap-4 mb-4">
          {/* QR scanner slot */}
          <div className="flex-1 bg-zinc-800 rounded-lg p-4 flex items-center justify-center">
            <div className={`w-16 h-16 border-2 ${isOpen ? 'border-led-green' : 'border-amber-500 animate-pulse'}`}>
              <div className="w-full h-full grid grid-cols-2 gap-0.5 p-1">
                <div className="bg-current opacity-50 rounded-sm" />
                <div className="bg-current opacity-30 rounded-sm" />
                <div className="bg-current opacity-40 rounded-sm" />
                <div className="bg-current opacity-50 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Display */}
          <div className="w-24 bg-zinc-900 rounded-lg p-2 text-center">
            <div className="led-display text-led-green text-lg">
              {isOpen ? '✓' : '--'}
            </div>
            <div className="text-[8px] text-zinc-500 mt-1">GATE</div>
            <div className="text-amber-400 font-mono text-sm">{FLIGHT_DATA.gate}</div>
          </div>
        </div>

        {/* Turnstile bars */}
        <div className="relative h-24 bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Rotating bar */}
            <div 
              className={`absolute w-2 h-full bg-gradient-to-r from-zinc-400 to-zinc-300 transition-transform duration-500 origin-center ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            />
            <div 
              className={`absolute w-full h-2 bg-gradient-to-b from-zinc-400 to-zinc-300 transition-transform duration-500 origin-center ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            />
            {/* Center hub */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 border-2 border-zinc-400 z-10" />
          </div>

          {/* Side pillars */}
          <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-zinc-600 to-zinc-500" />
          <div className="absolute right-0 inset-y-0 w-4 bg-gradient-to-l from-zinc-600 to-zinc-500" />
        </div>

        {/* Pass button */}
        {isOpen && (
          <button
            onClick={onPass}
            className="w-full mt-4 btn-gold"
          >
            Pasar al Embarque
          </button>
        )}
      </div>
    </div>
  );
}

export function Stage7Boarding({ onNext, playSFX, vibrate }: Stage7Props) {
  const [scanned, setScanned] = useState(false);
  const [passed, setPassed] = useState(false);

  const handleScan = () => {
    playSFX('beep');
    vibrate(100);
    setScanned(true);
    playSFX('success');
  };

  const handlePass = () => {
    playSFX('door');
    vibrate([50, 50, 100]);
    setPassed(true);
    setTimeout(onNext, 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Puerta de Embarque
          </h2>
          <p className="text-muted-foreground">
            Escanea tu código QR
          </p>
        </div>

        {/* QR Code */}
        {!scanned && (
          <div className="terminal-card mb-8 text-center animate-slide-in">
            <p className="text-sm text-muted-foreground mb-4">Tu código de embarque</p>
            <button onClick={handleScan} className="inline-block hover:scale-105 transition-transform">
              <img 
                src={ASSETS.qrCode} 
                alt="Boarding QR"
                className="w-48 h-48 mx-auto rounded-lg shadow-medium"
              />
            </button>
            <p className="text-xs text-muted-foreground mt-4 animate-pulse">
              Toca el código para escanear
            </p>
          </div>
        )}

        {/* Turnstile */}
        <div className={`mb-8 transition-all duration-500 ${scanned ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
          <Turnstile isOpen={scanned} onPass={handlePass} />
        </div>

        {/* Status */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="terminal-card py-3">
            <div className="text-lg font-bold font-mono">{FLIGHT_DATA.gate}</div>
            <div className="text-[10px] text-muted-foreground">PUERTA</div>
          </div>
          <div className="terminal-card py-3">
            <div className="text-lg font-bold font-mono">{FLIGHT_DATA.seat}</div>
            <div className="text-[10px] text-muted-foreground">ASIENTO</div>
          </div>
          <div className="terminal-card py-3">
            <div className="text-lg font-bold font-mono">{FLIGHT_DATA.flightNumber}</div>
            <div className="text-[10px] text-muted-foreground">VUELO</div>
          </div>
        </div>

        {/* Complete */}
        {passed && (
          <div className="text-center mt-6 animate-slide-in">
            <div className="stamp-approved">
              ✓ EMBARQUE AUTORIZADO
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
