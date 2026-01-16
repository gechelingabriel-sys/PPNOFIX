import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { ASSETS } from '@/lib/flightData';

interface HeaderProps {
  stage: number;
  progress: number;
  sfxEnabled: boolean;
  ambientEnabled: boolean;
  onToggleSFX: () => void;
  onToggleAmbient: () => void;
  onReset?: () => void;
}

const STAGE_NAMES = [
  'Bienvenida',
  'Check-in',
  'Ruta',
  'Equipaje',
  'Cinta',
  'Seguridad',
  'Pasaporte',
  'Embarque',
  'Duty Free',
  'Lounge',
  'Vuelo',
  'Llegada'
];

export function Header({ 
  stage, 
  progress, 
  sfxEnabled, 
  ambientEnabled, 
  onToggleSFX, 
  onToggleAmbient,
  onReset 
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button 
            onClick={onReset}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Reiniciar experiencia"
          >
            <img 
              src={ASSETS.logo} 
              alt="Pipino Air" 
              className="h-8 w-auto"
            />
          </button>

          {/* Stage indicator */}
          <div className="flex-1 text-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {STAGE_NAMES[stage] || `Etapa ${stage + 1}`}
            </span>
          </div>

          {/* Audio controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSFX}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={sfxEnabled ? 'Silenciar efectos' : 'Activar efectos'}
            >
              {sfxEnabled ? (
                <Volume2 className="w-4 h-4 text-foreground" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={onToggleAmbient}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={ambientEnabled ? 'Silenciar ambiente' : 'Activar ambiente'}
            >
              {ambientEnabled ? (
                <Music className="w-4 h-4 text-foreground" />
              ) : (
                <Music2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-airport mt-2">
          <div 
            className="progress-airport-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}
