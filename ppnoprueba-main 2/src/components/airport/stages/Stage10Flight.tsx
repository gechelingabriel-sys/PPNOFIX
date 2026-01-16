import { useState, useEffect, useRef } from 'react';
import { ASSETS, FLIGHT_DATA } from '@/lib/flightData';
import { audioEngine } from '@/lib/audioEngine';
import { Plane, SkipForward, Volume2 } from 'lucide-react';

interface Stage10Props {
  onNext: () => void;
  playSFX: (type: string) => void;
}

export function Stage10Flight({ onNext, playSFX }: Stage10Props) {
  const [phase, setPhase] = useState<'boarding' | 'takeoff' | 'cruise' | 'landing' | 'arrived'>('boarding');
  const [progress, setProgress] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);

  const FLIGHT_DURATION = 60000; // 60 seconds

  // Preload flight audio
  useEffect(() => {
    audioEngine.preloadFlightAudio(ASSETS.flightAudio).then(() => {
      setAudioLoaded(true);
    });
  }, []);

  const startFlight = () => {
    playSFX('chime');
    setPhase('takeoff');
    
    // Start audio
    if (audioLoaded) {
      audioEngine.playFlightAudio();
      setAudioPlaying(true);
    }

    // Start progress animation
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / FLIGHT_DURATION, 1);
      setProgress(newProgress);

      // Update phase based on progress
      if (newProgress < 0.15) {
        setPhase('takeoff');
      } else if (newProgress < 0.85) {
        setPhase('cruise');
      } else if (newProgress < 1) {
        setPhase('landing');
      } else {
        setPhase('arrived');
        audioEngine.stopFlightAudio(true);
        setAudioPlaying(false);
        setTimeout(onNext, 2000);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const skipFlight = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    audioEngine.stopFlightAudio(true);
    setAudioPlaying(false);
    setProgress(1);
    setPhase('arrived');
    setTimeout(onNext, 1000);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioEngine.stopFlightAudio(false);
    };
  }, []);

  const getPhaseLabel = () => {
    switch (phase) {
      case 'boarding': return 'Preparando despegue...';
      case 'takeoff': return 'Despegando...';
      case 'cruise': return 'Altitud de crucero';
      case 'landing': return 'Iniciando descenso...';
      case 'arrived': return '¡Aterrizamos!';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-6 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Vuelo {FLIGHT_DATA.flightNumber}
          </h2>
          <p className="text-muted-foreground">
            {FLIGHT_DATA.route.origin} → {FLIGHT_DATA.route.destination}
          </p>
        </div>

        {/* Flight visualization */}
        <div className="terminal-card mb-6 overflow-hidden">
          {/* Sky gradient */}
          <div 
            className="relative h-48 transition-all duration-1000"
            style={{
              background: phase === 'boarding' 
                ? 'linear-gradient(180deg, #bfdbfe 0%, #dbeafe 100%)'
                : phase === 'arrived'
                  ? 'linear-gradient(180deg, #93c5fd 0%, #dbeafe 100%)'
                  : 'linear-gradient(180deg, #1e3a5f 0%, #60a5fa 50%, #93c5fd 100%)'
            }}
          >
            {/* Clouds */}
            {phase !== 'boarding' && (
              <>
                <div className="absolute top-8 left-4 w-16 h-8 bg-white/60 rounded-full blur-sm animate-[slideRight_8s_linear_infinite]" />
                <div className="absolute top-16 right-8 w-24 h-10 bg-white/40 rounded-full blur-md animate-[slideRight_12s_linear_infinite]" />
                <div className="absolute top-24 left-1/3 w-20 h-8 bg-white/50 rounded-full blur-sm animate-[slideRight_10s_linear_infinite]" />
              </>
            )}

            {/* Airplane */}
            <div 
              className="absolute transition-all duration-1000"
              style={{
                left: `${20 + progress * 60}%`,
                top: phase === 'takeoff' 
                  ? `${80 - progress * 50}%`
                  : phase === 'landing'
                    ? `${30 + (progress - 0.85) * 200}%`
                    : '40%',
                transform: `rotate(${phase === 'takeoff' ? '-15deg' : phase === 'landing' ? '10deg' : '0deg'}) translateX(-50%)`,
              }}
            >
              <div className="animate-plane-float">
                <Plane className="w-16 h-16 text-foreground drop-shadow-lg" />
              </div>
            </div>

            {/* Ground (visible during takeoff/landing) */}
            {(phase === 'boarding' || phase === 'takeoff' || phase === 'landing' || phase === 'arrived') && (
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-600 to-emerald-500 transition-all duration-1000"
                style={{
                  height: phase === 'boarding' || phase === 'arrived' ? '30%' : 
                          phase === 'takeoff' ? `${30 - progress * 100}%` :
                          phase === 'landing' ? `${(progress - 0.85) * 200}%` : '0%'
                }}
              >
                {/* Runway */}
                {(phase === 'boarding' || phase === 'arrived') && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-2 bg-zinc-700">
                    <div className="h-full flex justify-around items-center">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-4 h-1 bg-yellow-400" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Flight info panel */}
          <div className="bg-zinc-900 p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${phase === 'arrived' ? 'bg-led-green' : 'bg-led-amber animate-pulse'}`} />
                <span className="text-amber-400 font-mono text-sm">{getPhaseLabel()}</span>
              </div>
              {audioPlaying && (
                <Volume2 className="w-4 h-4 text-zinc-400 animate-pulse" />
              )}
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Route markers */}
            <div className="flex justify-between mt-2 text-xs font-mono">
              <span className="text-zinc-400">{FLIGHT_DATA.route.origin}</span>
              <span className="text-zinc-500">{Math.round(progress * 100)}%</span>
              <span className="text-zinc-400">{FLIGHT_DATA.route.destination}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center space-y-3">
          {phase === 'boarding' && (
            <button onClick={startFlight} className="btn-gold">
              <Plane className="w-5 h-5 mr-2" />
              Iniciar Vuelo
            </button>
          )}

          {phase !== 'boarding' && phase !== 'arrived' && (
            <button
              onClick={skipFlight}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Saltar vuelo
            </button>
          )}

          {phase === 'arrived' && (
            <div className="stamp-approved animate-stamp">
              ✓ ATERRIZAJE EXITOSO
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
