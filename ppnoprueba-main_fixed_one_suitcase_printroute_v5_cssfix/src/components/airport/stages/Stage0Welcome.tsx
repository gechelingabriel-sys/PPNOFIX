import { useState } from 'react';
import { ASSETS, FLIGHT_DATA } from '@/lib/flightData';

interface Stage0Props {
  onNext: () => void;
  onInitAudio: () => Promise<boolean>;
  playSFX: (type: string) => void;
}

export function Stage0Welcome({ onNext, onInitAudio, playSFX }: Stage0Props) {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleEnter = async () => {
    const audioReady = await onInitAudio();
    // Sound for airport sliding doors (after audio is unlocked by user gesture)
    if (audioReady) playSFX('door');
    setDoorsOpen(true);
    
    // Show content after doors start opening
    setTimeout(() => {
      setShowContent(true);
    }, 800);

    // Proceed to next stage
    setTimeout(() => {
      onNext();
    }, 2500);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background video/parallax */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src={ASSETS.parallaxVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Sliding doors */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {/* Left door */}
        <div 
          className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-zinc-800 to-zinc-700 border-r-4 border-zinc-600 flex items-center justify-end pr-8 transition-transform duration-[1500ms] ease-out ${doorsOpen ? '-translate-x-full' : 'translate-x-0'}`}
        >
          <div className="text-zinc-400 text-4xl font-bold tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
            TERMINAL
          </div>
          {/* Door handle */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-24 bg-zinc-500 rounded-full" />
        </div>

        {/* Right door */}
        <div 
          className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-zinc-800 to-zinc-700 border-l-4 border-zinc-600 flex items-center justify-start pl-8 transition-transform duration-[1500ms] ease-out ${doorsOpen ? 'translate-x-full' : 'translate-x-0'}`}
        >
          <div className="text-zinc-400 text-4xl font-bold tracking-widest" style={{ writingMode: 'vertical-lr' }}>
            PIPINO AIR
          </div>
          {/* Door handle */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-24 bg-zinc-500 rounded-full" />
        </div>
      </div>

      {/* Main content */}
      <div className={`relative z-10 text-center px-6 transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <img 
          src={ASSETS.logo} 
          alt="Pipino Air" 
          className="h-32 md:h-40 mx-auto mb-8 drop-shadow-lg"
        />
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Bienvenida, {FLIGHT_DATA.passenger}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-2">
          Tu vuelo {FLIGHT_DATA.flightNumber} está listo
        </p>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="font-mono">{FLIGHT_DATA.route.origin}</span>
          <span className="text-accent">✈</span>
          <span className="font-mono">{FLIGHT_DATA.route.destination}</span>
        </div>
      </div>

      {/* Enter button - only show when doors are closed */}
      {!doorsOpen && (
        <button
          onClick={handleEnter}
          className="relative z-30 btn-gold animate-pulse-glow"
        >
          Entrar al Terminal
        </button>
      )}

      {/* Floor reflection effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/20 to-transparent z-5" />
    </div>
  );
}
