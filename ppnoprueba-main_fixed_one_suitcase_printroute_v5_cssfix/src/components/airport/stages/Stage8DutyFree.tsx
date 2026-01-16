import { useState } from 'react';
import { ASSETS, FLIGHT_DATA } from '@/lib/flightData';
import { ShoppingCart, Check, Printer } from 'lucide-react';

interface Stage8Props {
  onNext: () => void;
  playSFX: (type: string) => void;
  vibrate: (pattern?: number | number[]) => void;
}

type Product = typeof ASSETS.dutyFreeProducts[number];

function ProductCard({ 
  product, 
  isSelected, 
  onSelect, 
  disabled 
}: { 
  product: Product; 
  isSelected: boolean; 
  onSelect: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled && !isSelected}
      className={`vitrine group transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-accent scale-[1.02]' 
          : disabled 
            ? 'opacity-50' 
            : 'hover:scale-[1.02]'
      }`}
    >
      <div className="vitrine-inner p-2">
        <div className="aspect-square overflow-hidden rounded-lg mb-2 bg-muted">
          <img 
            src={product.image} 
            alt={product.label}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        </div>
        <div className="text-center">
          <div className="text-xs font-medium text-foreground truncate">{product.label}</div>
          {isSelected && (
            <div className="mt-1">
              <Check className="w-4 h-4 text-accent mx-auto" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function ThermalPrinter({ isPrinting, ticket }: { isPrinting: boolean; ticket: string[] }) {
  return (
    <div className="relative">
      {/* Printer body */}
      <div className="bg-gradient-to-b from-zinc-200 to-zinc-300 rounded-xl p-4 shadow-strong">
        {/* Top */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-zinc-600" />
            <span className="text-xs font-mono text-zinc-600">IMPRESORA TÉRMICA</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${isPrinting ? 'bg-led-amber animate-pulse' : 'bg-led-green'}`} />
        </div>

        {/* Paper slot */}
        <div className="relative h-8 bg-zinc-800 rounded-lg overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600" />
        </div>

        {/* Ticket coming out */}
        {ticket.length > 0 && (
          <div 
            className={`thermal-ticket mt-1 ${isPrinting ? 'animate-ticket-print' : ''}`}
            style={{ 
              maxHeight: isPrinting ? '0' : '300px',
              transition: 'max-height 1.5s ease-out'
            }}
          >
            <div className="text-center mb-4">
              <div className="text-lg font-bold">★ DUTY FREE ★</div>
              <div className="text-[10px] text-zinc-500">{FLIGHT_DATA.airline}</div>
            </div>

            <div className="border-t border-dashed border-zinc-300 my-3" />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Vuelo:</span>
                <span className="font-mono">{FLIGHT_DATA.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Puerta:</span>
                <span className="font-mono">{FLIGHT_DATA.gate}</span>
              </div>
              <div className="flex justify-between">
                <span>Pasajero:</span>
                <span className="font-mono">{FLIGHT_DATA.passenger}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-zinc-300 my-3" />

            <div className="space-y-1">
              {ticket.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{item}</span>
                  <span>✓</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-zinc-300 my-3" />

            <div className="text-center">
              <div className="inline-block border-2 border-green-600 text-green-600 px-3 py-1 rounded font-bold text-xs rotate-[-3deg]">
                PAGADO
              </div>
            </div>

            {/* Barcode */}
            <div className="mt-4 flex justify-center">
              <div className="flex gap-0.5">
                {[...Array(30)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-zinc-800"
                    style={{ 
                      width: Math.random() > 0.5 ? '2px' : '1px',
                      height: '24px'
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-center text-[8px] font-mono text-zinc-400 mt-1">
              {FLIGHT_DATA.flightNumber}-{Date.now().toString().slice(-6)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Stage8DutyFree({ onNext, playSFX, vibrate }: Stage8Props) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isPaying, setIsPaying] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [ticketItems, setTicketItems] = useState<string[]>([]);

  const handleSelectProduct = (productId: string) => {
    if (isPaying) return;

    playSFX('click');
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handlePay = () => {
    if (selectedProducts.length === 0 || isPaying) return;

    playSFX('beep');
    setIsPaying(true);
    setIsPrinting(true);

    // Get selected product names
    const items = selectedProducts.map(id => 
      ASSETS.dutyFreeProducts.find(p => p.id === id)?.label || ''
    );

    // Simulate printing
    setTimeout(() => {
      playSFX('success');
      vibrate([50, 50, 100]);
      setTicketItems(items);
      setIsPrinting(false);

      // Proceed after showing ticket
      setTimeout(onNext, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Store signage */}
        <div className="text-center mb-6 animate-slide-in">
          <div className="inline-block bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 px-8 py-3 rounded-lg shadow-medium">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-wide">
              ✦ DUTY FREE ✦
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {FLIGHT_DATA.airline} • Tax Free Shopping
            </p>
          </div>
        </div>

        {/* Store interior */}
        <div className="terminal-card mb-6 relative overflow-hidden">
          {/* Ambient lighting */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent pointer-events-none" />
          
          {/* Shelving header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Selecciona hasta 2 productos</span>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="font-bold">{selectedProducts.length}/2</span>
            </div>
          </div>

          {/* Products grid (vitrine display) */}
          <div className="grid grid-cols-3 gap-3">
            {ASSETS.dutyFreeProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={() => handleSelectProduct(product.id)}
                disabled={selectedProducts.length >= 2}
              />
            ))}
          </div>
        </div>

        {/* Pay button or printer */}
        {!isPaying ? (
          <div className="text-center">
            <button
              onClick={handlePay}
              disabled={selectedProducts.length === 0}
              className={`btn-gold ${selectedProducts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Pagar en Caja
            </button>
          </div>
        ) : (
          <div className="animate-slide-in">
            <ThermalPrinter isPrinting={isPrinting} ticket={ticketItems} />
          </div>
        )}
      </div>
    </div>
  );
}
