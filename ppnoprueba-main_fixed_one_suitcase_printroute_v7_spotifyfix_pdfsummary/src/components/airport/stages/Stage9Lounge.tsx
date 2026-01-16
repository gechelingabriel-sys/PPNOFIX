import { useState } from 'react';
import { ASSETS, FLIGHT_DATA } from '@/lib/flightData';
import { Music, ExternalLink } from 'lucide-react';

const PLAYLIST_PREVIEW = [
  { time: '22:10', title: 'Despegue suave', artist: 'Pipino Air FM', status: 'BOARDING' },
  { time: '22:13', title: 'Luces de pista', artist: 'Terminal Beats', status: 'ON TIME' },
  { time: '22:17', title: 'Café de Lounge', artist: 'Jet Lag Jazz', status: 'ON TIME' },
  { time: '22:21', title: 'Ventana 23A', artist: 'Cloudy Grooves', status: 'ON TIME' },
  { time: '22:26', title: 'Equipaje en cinta', artist: 'Belt Operators', status: 'LAST CALL' },
  { time: '22:30', title: 'Gate G23', artist: 'Boarding Crew', status: 'ON TIME' },
  { time: '22:34', title: 'Altitud de crucero', artist: 'Cabin Mode', status: 'ON TIME' },
  { time: '22:38', title: 'Aterrizaje suave', artist: 'Runway Nights', status: 'ON TIME' },
];

interface Stage9Props {
  onNext: () => void;
  playSFX: (type: string) => void;
}

export function Stage9Lounge({ onNext, playSFX }: Stage9Props) {
  const [showPlayer, setShowPlayer] = useState(true);
  const [selected, setSelected] = useState(0);

  const handleShowPlayer = () => {
    playSFX('click');
    setShowPlayer(true);
  };

  const handleSelect = (idx: number) => {
    setSelected(idx);
    playSFX('beep');
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
                {/* Simulated Departures board (premium look, mobile-friendly) */}
                <div className="departures-board mb-4">
                  <div className="departures-board__header">
                    <div>
                      <div className="departures-board__title">DEPARTURES</div>
                      <div className="departures-board__sub">Playlist Lounge — Vuelo {FLIGHT_DATA.flightNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs tracking-widest text-zinc-300">GATE {FLIGHT_DATA.gate}</div>
                      <div className="font-mono text-[10px] tracking-[0.35em] text-amber-200/90">NOW PLAYING</div>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <div className="mb-3 rounded-xl bg-black/25 border border-white/10 px-4 py-3">
                      <div className="font-mono text-xs text-amber-200/90">{PLAYLIST_PREVIEW[selected].title}</div>
                      <div className="font-mono text-[10px] tracking-widest text-zinc-400">{PLAYLIST_PREVIEW[selected].artist}</div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-white/10">
                      {PLAYLIST_PREVIEW.map((row, idx) => (
                        <button
                          key={row.time + row.title}
                          type="button"
                          onClick={() => handleSelect(idx)}
                          className={`departures-row w-full text-left ${idx === selected ? 'bg-white/5' : 'bg-transparent'} hover:bg-white/5 transition-colors`}
                        >
                          <div className="departures-cell col-span-2 sm:col-span-2">{row.time}</div>
                          <div className="departures-cell col-span-7 sm:col-span-7">
                            <span className="font-semibold">{row.title}</span>
                            <span className="ml-2 text-zinc-400/90">— {row.artist}</span>
                          </div>
                          <div className="departures-cell col-span-3 sm:col-span-3 text-right">
                            <span className={`departures-status ${row.status === 'LAST CALL' ? 'text-red-300' : row.status === 'BOARDING' ? 'text-amber-200' : 'text-emerald-200'}`}>{row.status}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>



                {/* Spotify preview (embebido) */}
                <div className="mt-4 p-3 rounded-2xl border border-white/10 bg-black/20">
                  <div className="text-xs uppercase tracking-widest text-white/70 mb-2">Preview de la playlist</div>
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <iframe
                      title="Spotify Playlist"
                      src={ASSETS.spotifyEmbed}
                      width="100%"
                      height="352"
                      style={{ borderRadius: 12 }}                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[11px] text-white/60 mt-2">
                    Si tu navegador bloquea el embed, usa el botón "Abrir en Spotify".
                  </p>
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
