import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, X, Copy, Check, Truck, Flame, Gift } from 'lucide-react';
import { toast } from 'sonner';

const offers = [
  {
    icon: Flame,
    text: 'احصل على خصم 15% على كل المتجر — استخدم كود',
    code: 'RIDER15',
    suffix: 'عرض محدود',
  },
  {
    icon: Gift,
    text: 'خصم 50 ريال على الطلبات فوق 500 ريال — كود',
    code: 'SAVE50',
    suffix: 'لفترة محدودة',
  },
  {
    icon: Truck,
    text: 'شحن مجاني لجميع الطلبات فوق 300 ريال — كود',
    code: 'FREESHIP',
    suffix: 'يطبق تلقائياً',
  },
];

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dismissed) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % offers.length), 5000);
    return () => clearInterval(id);
  }, [dismissed]);

  if (dismissed) return null;

  const copyCode = async (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`تم نسخ الكود: ${code}`, { position: 'top-center' });
    setTimeout(() => setCopied(null), 2000);
  };

  const offer = offers[index];
  const Icon = offer.icon;
  const isCopied = copied === offer.code;

  return (
    <div className="relative bg-gradient-to-l from-primary via-primary to-accent text-primary-foreground overflow-hidden">
      <Link
        to="/offers"
        className="container flex items-center justify-center gap-2 md:gap-3 py-2 px-10 text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <div
          key={index}
          className="flex items-center justify-center gap-2 md:gap-3 animate-fade-in min-w-0"
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{offer.text}</span>
          <button
            onClick={(e) => copyCode(e, offer.code)}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-background/20 hover:bg-background/30 font-bold tracking-wider transition-colors flex-shrink-0"
          >
            {offer.code}
            {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <span className="hidden md:inline">— {offer.suffix}</span>
        </div>
      </Link>

      {/* Indicator dots */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex gap-1">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              setIndex(i);
            }}
            aria-label={`عرض ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-4 bg-primary-foreground' : 'w-1.5 bg-primary-foreground/40'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setDismissed(true)}
        aria-label="إغلاق"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-background/20 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
