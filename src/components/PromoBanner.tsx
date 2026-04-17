import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (dismissed) return null;

  const copyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText('RIDER15');
    setCopied(true);
    toast.success('تم نسخ الكود: RIDER15', { position: 'top-center' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gradient-to-l from-primary via-primary to-accent text-primary-foreground">
      <Link
        to="/offers"
        className="container flex items-center justify-center gap-2 md:gap-3 py-2 px-10 text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Tag className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">احصل على خصم 15% — استخدم كود</span>
        <button
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-background/20 hover:bg-background/30 font-bold tracking-wider transition-colors"
        >
          RIDER15
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <span className="hidden md:inline">— عرض محدود</span>
      </Link>
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
