import { useState } from 'react';
import { ASSETS, FLIGHT_DATA, PADLOCK_CODES } from '@/lib/flightData';
import confetti from 'canvas-confetti';
import { Gift, Ticket, Download, X } from 'lucide-react';

interface Stage11Props {
  playSFX: (type: string) => void;
  vibrate: (pattern?: number | number[]) => void;
}

function Dial({ 
  value, 
  onChange, 
  playSFX 
}: { 
  value: number; 
  onChange: (v: number) => void;
  playSFX: (type: string) => void;
}) {
  const handleClick = () => {
    playSFX('dial');
    onChange((value + 1) % 10);
  };

  return (
    <button onClick={handleClick} className="dial">
      {value}
    </button>
  );
}

function Padlock({
  isOpen,
  code,
  currentCode,
  onCodeChange,
  playSFX,
  vibrate,
  onUnlock,
  hint
}: {
  isOpen: boolean;
  code: string;
  currentCode: string;
  onCodeChange: (code: string) => void;
  playSFX: (type: string) => void;
  vibrate: (pattern?: number | number[]) => void;
  onUnlock: () => void;
  hint: string;
}) {
  const digits = currentCode.split('').map(Number);

  const handleDigitChange = (index: number, newValue: number) => {
    const newCode = digits.map((d, i) => i === index ? newValue : d).join('');
    onCodeChange(newCode);

    // Check if correct
    if (newCode === code) {
      playSFX('unlock');
      vibrate([100, 50, 100, 50, 200]);
      setTimeout(onUnlock, 500);
    }
  };

  // Temperature hint
  const getTemperature = () => {
    let matches = 0;
    for (let i = 0; i < 3; i++) {
      if (currentCode[i] === code[i]) matches++;
    }
    if (matches === 3) return '🔥 ¡CORRECTO!';
    if (matches === 2) return '🔥 ¡Muy caliente!';
    if (matches === 1) return '🌡️ Tibio...';
    return '❄️ Frío';
  };

  return (
    <div className="text-center">
      {/* Suitcase */}
      <div className="suitcase mx-auto mb-4">
        <div className="suitcase-handle w-20" />
        <div className="suitcase-body w-32 h-24 flex items-center justify-center">
          {isOpen ? (
            <div className="text-4xl">🎁</div>
          ) : (
            <div className="text-zinc-500 text-xs p-2">
              {hint}
            </div>
          )}
        </div>
        <div className="suitcase-wheel left-4" />
        <div className="suitcase-wheel right-4" />
      </div>

      {/* Padlock */}
      {!isOpen && (
        <div className="inline-block">
          {/* Shackle */}
          <div className={`padlock-shackle mx-auto ${isOpen ? 'open' : ''}`} />
          
          {/* Body */}
          <div className="padlock-body flex flex-col items-center justify-center gap-2 px-4">
            {/* Dials */}
            <div className="flex gap-2">
              {digits.map((digit, i) => (
                <Dial
                  key={i}
                  value={digit}
                  onChange={(v) => handleDigitChange(i, v)}
                  playSFX={playSFX}
                />
              ))}
            </div>
          </div>

          {/* Temperature hint */}
          <div className="mt-4 text-sm font-medium">
            {getTemperature()}
          </div>
        </div>
      )}
    </div>
  );
}

function PrizeModal({ 
  prize, 
  onClose 
}: { 
  prize: { image: string; title: string; description: string }; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
      <div className="terminal-card max-w-sm w-full relative animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold mb-4">{prize.title}</h3>
          
          <img 
            src={prize.image} 
            alt={prize.title}
            className="w-full aspect-square object-cover rounded-xl mb-4 shadow-strong"
          />
          
          <p className="text-muted-foreground">{prize.description}</p>
        </div>
      </div>
    </div>
  );
}

export function Stage11Arrival({ playSFX, vibrate }: Stage11Props) {
  const [suitcase1Code, setSuitcase1Code] = useState('000');
  const [suitcase2Code, setSuitcase2Code] = useState('000');
  const [suitcase1Open, setSuitcase1Open] = useState(false);
  const [suitcase2Open, setSuitcase2Open] = useState(false);
  const [showPrize1, setShowPrize1] = useState(false);
  const [showPrize2, setShowPrize2] = useState(false);
  const [showFinalPrizes, setShowFinalPrizes] = useState(false);

  const handleUnlock1 = () => {
    setSuitcase1Open(true);
    setShowPrize1(true);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleUnlock2 = () => {
    setSuitcase2Open(true);
    setShowPrize2(true);
    confetti({ particleCount: 50, spread: 60 });

    // Show final prizes after both are open
    if (suitcase1Open) {
      setTimeout(() => {
        setShowFinalPrizes(true);
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#D97706', '#F59E0B', '#FCD34D', '#EF4444', '#10B981']
        });
      }, 1500);
    }
  };

  const bothOpen = suitcase1Open && suitcase2Open;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            ¡Bienvenida a {FLIGHT_DATA.route.destinationFull}!
          </h2>
          <p className="text-muted-foreground">
            {FLIGHT_DATA.passenger}, tu aventura comienza
          </p>
        </div>

        {/* Thank you card */}
        <div className="terminal-card mb-6 text-center animate-slide-in">
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-xl font-bold mb-2">Gracias por volar con {FLIGHT_DATA.airline}</h3>
          <p className="text-muted-foreground mb-4">
            Has acumulado <span className="text-accent font-bold">{FLIGHT_DATA.miles} millas</span>
          </p>
          <div className="inline-block bg-gradient-to-r from-amber-100 to-amber-50 px-6 py-3 rounded-full">
            <span className="text-amber-800 font-bold">★ Pasajera VIP ★</span>
          </div>
        </div>

        {/* Voucher */}
        <div className="terminal-card mb-6 p-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-3">
            <Ticket className="w-5 h-5 text-accent" />
            <span className="font-semibold">Voucher Especial</span>
          </div>
          <div className="text-center mb-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
            <p className="font-bold text-foreground">🍫 ¡GANASTE!</p>
            <p className="text-sm font-medium text-foreground">UN RAMO DE CHOCOLATE BLANCO A ELECCIÓN</p>
            <p className="text-xs text-muted-foreground italic mt-1">Canjeable por tiempo indefinido</p>
          </div>
          <img 
            src={ASSETS.voucher} 
            alt="Voucher chocolate blanco"
            className="w-full rounded-lg shadow-medium"
          />
        </div>

        {/* Luggage with padlocks */}
        <div className="mb-8">
          <h3 className="text-center font-semibold mb-4">
            🔐 Desbloquea tus regalos
          </h3>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Pista: Una fecha muy especial (día/mes/año)
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Suitcase 1 */}
            <div className="terminal-card p-4">
              <Padlock
                isOpen={suitcase1Open}
                code={PADLOCK_CODES.suitcase1}
                currentCode={suitcase1Code}
                onCodeChange={setSuitcase1Code}
                playSFX={playSFX}
                vibrate={vibrate}
                onUnlock={handleUnlock1}
                hint="Día + inicio mes"
              />
            </div>

            {/* Suitcase 2 */}
            <div className="terminal-card p-4">
              <Padlock
                isOpen={suitcase2Open}
                code={PADLOCK_CODES.suitcase2}
                currentCode={suitcase2Code}
                onCodeChange={setSuitcase2Code}
                playSFX={playSFX}
                vibrate={vibrate}
                onUnlock={handleUnlock2}
                hint="Fin mes + año"
              />
            </div>
          </div>
        </div>

        {/* Final prizes */}
        {showFinalPrizes && (
          <div className="space-y-6 animate-slide-in">
            {/* Gift Card */}
            <div className="terminal-card p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50">
              <Gift className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">🎁 Gift Card</h3>
              <p className="text-foreground font-medium mb-2">
                Desayuno en casa ajena, con cosas ajenas, en cama ajena
              </p>
              <p className="text-sm text-muted-foreground italic">
                Válido infinito
              </p>
            </div>

            {/* Golden Ticket */}
            <div className="terminal-card p-6 text-center bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-100 border-2 border-amber-300">
              <div className="text-3xl mb-4">🎫</div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">★ Golden Ticket ★</h3>
              <p className="text-amber-900 font-medium">
                Cita en el parking del aeropuerto de Córdoba
              </p>
            </div>

            {/* Download PDF */}
            <div className="text-center">
              <button onClick={handlePrint} className="btn-gold no-print">
                <Download className="w-5 h-5 mr-2" />
                Descargar Recuerdo en PDF
              </button>
            </div>
          </div>
        )}

        {/* Prize modals */}
        {showPrize1 && (
          <PrizeModal
            prize={{
              image: ASSETS.prizes[0],
              title: 'Regalo #1',
              description: '¡Tu primer regalo desbloqueado!'
            }}
            onClose={() => setShowPrize1(false)}
          />
        )}

        {showPrize2 && !showPrize1 && (
          <PrizeModal
            prize={{
              image: ASSETS.prizes[1],
              title: 'Regalo #2',
              description: '¡Todos los regalos desbloqueados!'
            }}
            onClose={() => setShowPrize2(false)}
          />
        )}
      </div>

      {/* Print styles */}
      <div className="print-only hidden">
        <div className="p-8 text-center">
          <img src={ASSETS.logo} alt="Pipino Air" className="h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Recuerdo de Viaje</h1>
          <p>Vuelo {FLIGHT_DATA.flightNumber} • {FLIGHT_DATA.route.origin} → {FLIGHT_DATA.route.destination}</p>
          <p>Pasajera: {FLIGHT_DATA.passenger}</p>
          <p>Asiento: {FLIGHT_DATA.seat} • Puerta: {FLIGHT_DATA.gate}</p>
          <p className="mt-4">{FLIGHT_DATA.miles} millas acumuladas</p>
          <img src={ASSETS.qrCode} alt="QR" className="w-32 mx-auto mt-4" />
          <p className="text-sm text-gray-500 mt-4">{FLIGHT_DATA.date}</p>
        </div>
      </div>
    </div>
  );
}
