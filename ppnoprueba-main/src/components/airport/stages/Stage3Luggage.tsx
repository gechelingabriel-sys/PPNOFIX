import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Stage3Props {
  onNext: () => void;
  playSFX: (type: string) => void;
  vibrate: (pattern?: number | number[]) => void;
}

function ScaleDisplay({ weight, isWeighing }: { weight: number; isWeighing: boolean }) {
  return (
    <div className="relative">
      {/* Scale base */}
      <div className="relative w-full max-w-xs mx-auto">
        {/* Platform */}
        <div className="relative bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-xl p-1 shadow-strong">
          {/* Rollers */}
          <div className="flex justify-around mb-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-6 h-3 rounded-full bg-gradient-to-b from-zinc-500 to-zinc-600 shadow-inner"
                style={{
                  animation: isWeighing ? `spin 1s linear infinite` : 'none',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Weighing surface */}
          <div className="h-32 bg-gradient-to-b from-zinc-600 to-zinc-700 rounded-lg flex items-center justify-center">
            {/* Suitcase on scale */}
            <div className={`suitcase transform transition-all duration-500 ${isWeighing ? 'scale-95' : 'scale-100'}`}>
              {/* Handle */}
              <div className="suitcase-handle" />
              
              {/* Body */}
              <div className="suitcase-body w-24 h-20 flex flex-col justify-between p-2">
                {/* Top panel */}
                <div className="h-1 bg-zinc-600 rounded" />
                {/* Zipper */}
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-1 bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-500" />
                  <div className="w-3 h-3 bg-zinc-400 rounded border border-zinc-500" />
                </div>
                {/* Bottom panel */}
                <div className="h-1 bg-zinc-600 rounded" />
              </div>

              {/* Wheels */}
              <div className="suitcase-wheel left-2" />
              <div className="suitcase-wheel right-2" />

              {/* Tag */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 luggage-tag text-[8px] font-mono">
                GAB-23
              </div>
            </div>
          </div>
        </div>

        {/* LED Display */}
        <div className="mt-4 bg-zinc-900 rounded-lg p-4 text-center shadow-strong">
          <div className="led-display text-3xl text-led-green">
            {isWeighing ? (
              <span className="animate-pulse">--.-</span>
            ) : (
              <span>{weight.toFixed(2)}</span>
            )}
            <span className="text-lg ml-2 text-zinc-500">kg</span>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${!isWeighing ? 'bg-led-green' : 'bg-zinc-700'}`} />
            <div className={`w-2 h-2 rounded-full ${isWeighing ? 'bg-led-amber animate-pulse' : 'bg-zinc-700'}`} />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Stage3Luggage({ onNext, playSFX, vibrate }: Stage3Props) {
  const [isWeighing, setIsWeighing] = useState(false);
  const [weight, setWeight] = useState(0);
  const [showStamp, setShowStamp] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleWeigh = () => {
    if (isWeighing || complete) return;

    playSFX('beep');
    setIsWeighing(true);

    // Simulate weighing animation
    let currentWeight = 0;
    const targetWeight = 23.00;
    const interval = setInterval(() => {
      currentWeight += Math.random() * 5;
      if (currentWeight >= targetWeight) {
        currentWeight = targetWeight;
        clearInterval(interval);
        
        setWeight(currentWeight);
        setIsWeighing(false);

        // Success!
        setTimeout(() => {
          playSFX('success');
          vibrate([100, 50, 100]);
          setShowStamp(true);
          
          // Confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D97706', '#F59E0B', '#FCD34D']
          });

          // Proceed
          setTimeout(() => {
            setComplete(true);
            setTimeout(onNext, 1500);
          }, 2000);
        }, 500);
      } else {
        setWeight(currentWeight);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Control de Equipaje
          </h2>
          <p className="text-muted-foreground">
            Pesa tu equipaje en la balanza
          </p>
        </div>

        {/* Scale */}
        <div className="mb-8 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <ScaleDisplay weight={weight} isWeighing={isWeighing} />
        </div>

        {/* Stamp */}
        {showStamp && (
          <div className="text-center mb-8">
            <div className="stamp-approved animate-stamp inline-block">
              ✓ PESO APROBADO
            </div>
            <p className="text-green-600 font-semibold mt-4">
              ¡23 kg exactos! Número perfecto ✨
            </p>
          </div>
        )}

        {/* Action */}
        {!complete && !showStamp && (
          <div className="text-center">
            <button
              onClick={handleWeigh}
              disabled={isWeighing}
              className={`btn-airport ${isWeighing ? 'opacity-50' : ''}`}
            >
              {isWeighing ? 'Pesando...' : 'Pesar Equipaje'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
