import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Copy, Check, Tag, Flame, Gift, Truck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const OFFER_END_DATE = new Date('2026-05-31T23:59:59');

const coupons = [
  {
    code: 'RIDER15',
    title: 'خصم 15% على كل المتجر',
    desc: 'استخدم الكود عند الدفع للحصول على خصم 15% على جميع المنتجات',
    icon: Flame,
    gradient: 'from-primary/20 to-accent/20',
    accent: 'text-primary',
  },
  {
    code: 'SAVE50',
    title: 'خصم 50 ريال',
    desc: 'خصم فوري 50 ريال على الطلبات التي تتجاوز 500 ريال',
    icon: Gift,
    gradient: 'from-accent/20 to-primary/20',
    accent: 'text-accent',
  },
  {
    code: 'FREESHIP',
    title: 'شحن مجاني',
    desc: 'شحن مجاني لجميع الطلبات فوق 300 ريال — تطبق تلقائياً',
    icon: Truck,
    gradient: 'from-primary/20 to-primary/10',
    accent: 'text-primary',
  },
];

function useCountdown(target: Date) {
  const [time, setTime] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setTime(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const clamped = Math.max(0, time);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  };
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-card border border-primary/30 flex items-center justify-center shadow-glow">
        <span className="font-heading text-2xl md:text-4xl font-bold text-primary tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground mt-2">{label}</span>
    </div>
  );
}

export default function OffersPage() {
  const { days, hours, minutes, seconds } = useCountdown(OFFER_END_DATE);
  const { data: products, isLoading } = useProducts(8);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`تم نسخ الكود: ${code}`, { position: 'top-center' });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-[100px]" />
        </div>

        <div className="container relative py-12 md:py-20 text-center space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 rotate-180" />
            العودة للمتجر
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            <Flame className="h-4 w-4" />
            عروض محدودة المدة
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="text-gradient-accent">عروض حصرية</span> للدراجين
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            استفد من أقوى الخصومات على أفضل ماركات الدراجات النارية. العرض ينتهي قريباً!
          </p>

          {/* Countdown */}
          <div className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">ينتهي العرض خلال:</p>
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <CountdownBox value={days} label="يوم" />
              <span className="font-heading text-2xl md:text-4xl font-bold text-primary">:</span>
              <CountdownBox value={hours} label="ساعة" />
              <span className="font-heading text-2xl md:text-4xl font-bold text-primary">:</span>
              <CountdownBox value={minutes} label="دقيقة" />
              <span className="font-heading text-2xl md:text-4xl font-bold text-primary">:</span>
              <CountdownBox value={seconds} label="ثانية" />
            </div>
          </div>
        </div>
      </section>

      {/* Coupons */}
      <section className="container py-16 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            <span className="text-gradient-accent">أكواد</span> الخصم
          </h2>
          <p className="text-muted-foreground">انسخ الكود واستخدمه عند إتمام الشراء</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((c) => {
            const Icon = c.icon;
            const isCopied = copied === c.code;
            return (
              <div
                key={c.code}
                className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${c.gradient} p-6 space-y-4 group hover:border-primary/40 transition-all hover:shadow-glow`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center ${c.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Tag className="h-5 w-5 text-muted-foreground/40" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading text-xl font-bold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>

                <button
                  onClick={() => copyCode(c.code)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/40 bg-background/50 hover:bg-primary/10 transition-colors"
                >
                  <span className="font-heading text-lg font-bold tracking-wider text-primary">
                    {c.code}
                  </span>
                  {isCopied ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <Copy className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Discounted Products */}
      <section className="container pb-20">
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            منتجات <span className="text-gradient-accent">العروض</span>
          </h2>
          <p className="text-muted-foreground">طبق الكوبونات على هذه المنتجات</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.node.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">لا توجد منتجات حالياً</p>
        )}
      </section>

      <StoreFooter />
    </div>
  );
}
