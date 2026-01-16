import { useState } from 'react';
import { ASSETS } from '@/lib/flightData';
import { Music, ExternalLink } from 'lucide-react';

interface Stage9Props {
  onNext: () => void;
  playSFX: (type: string) => void;
}

export function Stage9Lounge({ onNext, playSFX }: Stage9Props) {
  const [showPlayer, setShowPlayer] = useState(false);

  const handleShowPlayer = () => {
    playSFX('click');
    setShowPlayer(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            VIP Lounge
          </h2>
          <p className="text-muted-foreground">
            Relájate antes del vuelo
          </p>
        </div>

        {/* Lounge ambiance */}
        <div className="terminal-card mb-6 p-8 relative overflow-hidden animate-slide-in">
          {/* Ambient gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-orange-50/30" />
          
          <div className="relative text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-lg">
              <Music className="w-10 h-10 text-amber-600" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">
              Playlist del Viaje
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Una selección especial para ti
            </p>

            {!showPlayer ? (
              <button
                onClick={handleShowPlayer}
                className="btn-airport"
              >
                <Music className="w-5 h-5 mr-2" />
                Mostrar Playlist
              </button>
            ) : (
              <div className="animate-slide-in">
                {/* Spotify embed */}
                <div className="rounded-xl overflow-hidden shadow-strong mb-4">
                  <iframe
                    src={ASSETS.spotifyEmbed}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl"
                  />
                </div>

                {/* Open in Spotify link */}
                <a
                  href={ASSETS.spotifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir en Spotify
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Continue button */}
        {showPlayer && (
          <div className="text-center animate-slide-in">
            <button onClick={() => { playSFX('chime'); onNext(); }} className="btn-gold">
              Continuar al Embarque
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
