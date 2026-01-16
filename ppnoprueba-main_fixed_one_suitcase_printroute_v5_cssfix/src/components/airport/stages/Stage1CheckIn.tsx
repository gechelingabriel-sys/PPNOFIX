import { useState, useEffect } from 'react';
import { FLIGHT_DATA, ASSETS } from '@/lib/flightData';

interface Stage1Props {
  onNext: () => void;
  playSFX: (type: string) => void;
}

interface FlipCharProps {
  char: string;
  delay: number;
}

function FlipChar({ char, delay }: FlipCharProps) {
  const [displayChar, setDisplayChar] = useState(' ');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const flipTimeout = setTimeout(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setDisplayChar(char);
        setIsFlipping(false);
      }, 150);
    }, delay);

    return () => clearTimeout(flipTimeout);
  }, [char, delay]);

  return (
    <span className={`flip-char ${isFlipping ? 'animate-flip' : ''}`}>
      {displayChar}
    </span>
  );
}

function DeparturesBoard() {
  const flights = [
    { flight: 'GAB-23', destination: 'ALICANTE', gate: 'G23', time: '12:00', status: 'BOARDING' },
    { flight: 'PA-101', destination: 'MADRID', gate: 'A12', time: '12:45', status: 'ON TIME' },
    { flight: 'PA-205', destination: 'BARCELONA', gate: 'B07', time: '13:15', status: 'DELAYED' },
  ];

  return (
    <div className="bg-zinc-900 rounded-xl p-4 md:p-6 shadow-strong overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-led-green animate-pulse" />
          <span className="text-amber-400 font-mono text-sm tracking-wider">DEPARTURES</span>
        </div>
        <span className="text-zinc-500 font-mono text-xs">
          {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-5 gap-2 mb-3 text-zinc-500 text-xs font-mono">
        <span>FLIGHT</span>
        <span className="col-span-2">DESTINATION</span>
        <span>GATE</span>
        <span>STATUS</span>
      </div>

      {/* Flights */}
      <div className="space-y-2">
        {flights.map((flight, index) => (
          <div 
            key={flight.flight}
            className={`grid grid-cols-5 gap-2 items-center py-2 ${index === 0 ? 'bg-amber-500/10 -mx-2 px-2 rounded' : ''}`}
          >
            <div className="flex gap-0.5">
              {flight.flight.split('').map((char, i) => (
                <FlipChar key={i} char={char} delay={index * 200 + i * 50} />
              ))}
            </div>
            <div className="col-span-2 flex gap-0.5 overflow-hidden">
              {flight.destination.slice(0, 8).split('').map((char, i) => (
                <FlipChar key={i} char={char} delay={index * 200 + i * 50 + 100} />
              ))}
            </div>
            <div className="flex gap-0.5">
              {flight.gate.split('').map((char, i) => (
                <FlipChar key={i} char={char} delay={index * 200 + i * 50 + 200} />
              ))}
            </div>
            <span className={`text-xs font-mono ${
              flight.status === 'BOARDING' ? 'text-led-green' :
              flight.status === 'DELAYED' ? 'text-led-amber' :
              'text-zinc-400'
            }`}>
              {flight.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Stage1CheckIn({ onNext, playSFX }: Stage1Props) {
  const [boardVisible, setBoardVisible] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setTimeout(() => setBoardVisible(true), 500);
  }, []);

  const handleConfirm = () => {
    playSFX('beep');
    setConfirmed(true);
    setTimeout(onNext, 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Check-in
          </h2>
          <p className="text-muted-foreground">
            Confirma tus datos de vuelo
          </p>
        </div>

        {/* Departures Board */}
        <div className={`mb-8 transition-all duration-700 ${boardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <DeparturesBoard />
        </div>

        {/* Passenger Card */}
        <div className="terminal-card mb-8 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start gap-4">
            <img 
              src={ASSETS.cotyPhoto} 
              alt={FLIGHT_DATA.passenger}
              className="w-20 h-20 rounded-xl object-cover shadow-medium"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">
                {FLIGHT_DATA.passenger}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vuelo</span>
                  <span className="font-mono font-semibold">{FLIGHT_DATA.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asiento</span>
                  <span className="font-mono font-semibold">{FLIGHT_DATA.seat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Puerta</span>
                  <span className="font-mono font-semibold">{FLIGHT_DATA.gate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono">{FLIGHT_DATA.route.origin}</div>
              <div className="text-xs text-muted-foreground">{FLIGHT_DATA.route.originFull}</div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="flex-1 h-px bg-border" />
              <div className="px-3 text-accent text-xl">✈</div>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono">{FLIGHT_DATA.route.destination}</div>
              <div className="text-xs text-muted-foreground">{FLIGHT_DATA.route.destinationFull}</div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={confirmed}
            className={`btn-gold ${confirmed ? 'opacity-50' : ''}`}
          >
            {confirmed ? 'Confirmado ✓' : 'Confirmar Check-in'}
          </button>
        </div>
      </div>
    </div>
  );
}
