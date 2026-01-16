import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, User, CheckCircle2 } from 'lucide-react';
import { ASSETS, FLIGHT_DATA } from '@/lib/flightData';

interface Stage5Props {
  onNext: () => void;
  playSFX: (type: string) => void;
  vibrate: (pattern?: number | number[]) => void;
}

export function Stage5Security({ onNext, playSFX, vibrate }: Stage5Props) {
  const [step, setStep] = useState<'intro' | 'camera' | 'scanning' | 'complete'>('intro');
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    playSFX('beep');
    setStep('camera');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 320 }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.warn('Camera access denied:', error);
      setCameraError(true);
    }
  };

  const handleScan = () => {
    playSFX('beep');
    setStep('scanning');
    vibrate(100);

    // Simulate scanning
    setTimeout(() => {
      stopCamera();
      playSFX('success');
      vibrate([100, 50, 100]);
      setStep('complete');

      setTimeout(onNext, 2000);
    }, 2500);
  };

  const skipCamera = () => {
    playSFX('beep');
    setStep('scanning');
    
    setTimeout(() => {
      playSFX('success');
      vibrate([100, 50, 100]);
      setStep('complete');
      setTimeout(onNext, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Control de Seguridad
          </h2>
          <p className="text-muted-foreground">
            Verificación biométrica
          </p>
        </div>

        {/* Scanner Device */}
        <div className="terminal-card mb-8">
          {/* Device frame */}
          <div className="relative bg-gradient-to-b from-zinc-200 to-zinc-300 rounded-2xl p-4 shadow-strong">
            {/* Top bezel with indicator lights */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${step === 'complete' ? 'bg-led-green' : step === 'scanning' ? 'bg-led-amber animate-pulse' : 'bg-zinc-400'}`} />
                <span className="text-xs font-mono text-zinc-600">BIOMETRIC SCAN</span>
              </div>
              <div className="text-xs font-mono text-zinc-500">v2.3</div>
            </div>

            {/* Screen */}
            <div className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden">
              {step === 'intro' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                  <User className="w-20 h-20 mb-4 opacity-30" />
                  <p className="text-sm">Preparado para escaneo</p>
                </div>
              )}

              {step === 'camera' && !cameraError && (
                <>
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Scan overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-led-green rounded-full opacity-50" />
                    <div className="absolute w-40 h-40 border border-led-green rounded-full animate-pulse" />
                  </div>
                  {/* Scan line */}
                  <div className="absolute inset-x-0 h-1 bg-led-green/50 animate-[scan_2s_ease-in-out_infinite]" 
                    style={{ 
                      animation: 'scan 2s ease-in-out infinite',
                      top: '50%'
                    }} 
                  />
                </>
              )}

              {(step === 'camera' && cameraError) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <img 
                    src={ASSETS.cotyPhoto} 
                    alt={FLIGHT_DATA.passenger}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-zinc-700"
                  />
                  <p className="text-zinc-400 text-sm mb-2">Cámara no disponible</p>
                  <p className="text-zinc-500 text-xs">Usando foto de perfil</p>
                </div>
              )}

              {step === 'scanning' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <img 
                    src={ASSETS.cotyPhoto} 
                    alt={FLIGHT_DATA.passenger}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-led-amber"
                  />
                  <div className="flex items-center gap-2 text-led-amber">
                    <div className="w-2 h-2 rounded-full bg-led-amber animate-pulse" />
                    <span className="text-sm font-mono">ANALIZANDO...</span>
                  </div>
                </div>
              )}

              {step === 'complete' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/20">
                  <img 
                    src={ASSETS.cotyPhoto} 
                    alt={FLIGHT_DATA.passenger}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-led-green"
                  />
                  <CheckCircle2 className="w-12 h-12 text-led-green mb-2" />
                  <span className="text-led-green font-mono text-sm">IDENTIDAD VERIFICADA</span>
                </div>
              )}
            </div>

            {/* Bottom panel */}
            <div className="mt-4 flex justify-between items-center px-2">
              <div className="text-xs font-mono text-zinc-600">
                {FLIGHT_DATA.passenger.toUpperCase()}
              </div>
              <div className="text-xs font-mono text-zinc-600">
                {FLIGHT_DATA.flightNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-3">
          {step === 'intro' && (
            <button onClick={startCamera} className="btn-airport">
              <Camera className="w-5 h-5 mr-2" />
              Iniciar Escaneo
            </button>
          )}

          {step === 'camera' && (
            <>
              <button onClick={handleScan} className="btn-gold">
                Verificar Identidad
              </button>
              {cameraError && (
                <button 
                  onClick={skipCamera}
                  className="block w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  Continuar sin cámara
                </button>
              )}
            </>
          )}

          {step === 'complete' && (
            <div className="stamp-approved animate-stamp">
              ✓ AUTORIZADO
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100px); opacity: 0.3; }
          50% { transform: translateY(100px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
