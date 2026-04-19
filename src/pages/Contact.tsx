import { Link } from 'react-router-dom';
import { useState } from 'react';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { ArrowRight, MessageCircle, Phone, Mail, MapPin, Clock, Send, Bot, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error('من فضلك أكمل الاسم والرسالة');
      return;
    }
    const text = `مرحباً ROAD BIKER 👋\n\nالاسم: ${name}\nالهاتف: ${phone || 'غير مذكور'}\n\n${message}`;
    const url = `https://wa.me/966500123007?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success('تم تحويلك إلى واتساب لإرسال الرسالة');
  };

  const items = [
    {
      icon: MessageCircle,
      title: 'واتساب',
      value: '+966 50 012 3007',
      href: 'https://wa.me/966500123007',
      action: 'افتح المحادثة',
    },
    {
      icon: Phone,
      title: 'هاتف',
      value: '+966 50 012 3007',
      href: 'tel:+966500123007',
      action: 'اتصل الآن',
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@roadbiker.sa',
      href: 'mailto:info@roadbiker.sa',
      action: 'أرسل بريد',
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: 'الرياض، المملكة العربية السعودية',
      href: 'https://maps.google.com/?q=Riyadh',
      action: 'افتح الخريطة',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <section className="border-b border-border bg-gradient-hero">
        <div className="container py-10 md:py-14 space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowRight className="h-4 w-4" />
            العودة للمتجر
          </Link>
          <h1 className="font-heading text-3xl md:text-5xl font-bold">
            <span className="text-gradient-accent">تواصل</span> معنا
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            فريقنا جاهز لمساعدتك في اختيار المنتج المناسب أو الإجابة على أي استفسار.
          </p>
        </div>
      </section>

      <section className="container py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-bold mb-2">طرق التواصل</h2>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-glow transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{item.value}</p>
                </div>
                <span className="text-xs text-primary font-medium group-hover:underline">
                  {item.action}
                </span>
              </a>
            );
          })}

          <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm">ساعات العمل</h3>
              <p className="text-sm text-muted-foreground">السبت – الخميس: 9 صباحاً – 11 مساءً</p>
              <p className="text-sm text-muted-foreground">الجمعة: مغلق</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4 p-6 rounded-2xl bg-card border border-border h-fit">
          <h2 className="font-heading text-2xl font-bold">أرسل لنا رسالة</h2>
          <p className="text-sm text-muted-foreground">
            سيتم تحويلك إلى محادثة واتساب مع فريقنا.
          </p>

          <div>
            <label className="text-sm font-bold mb-2 block">الاسم *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك الكامل"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold mb-2 block">رقم الهاتف</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-right"
            />
          </div>

          <div>
            <label className="text-sm font-bold mb-2 block">الرسالة *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="كيف يمكننا مساعدتك؟"
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-glow"
          >
            <Send className="h-4 w-4" />
            إرسال عبر واتساب
          </button>
        </form>
      </section>

      {/* AI Support */}
      <section className="container pb-12">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-bl from-primary/10 via-card to-card p-6 md:p-8 shadow-glow">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
              <Bot className="h-7 w-7" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  مدعوم بالذكاء الاصطناعي
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold">
                  الدعم الفني الذكي — متاح 24/7
                </h2>
                <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed">
                  وكيلنا الذكي يجيب على استفساراتك خلال ثوانٍ، يقترح المنتجات المناسبة، يتابع طلبك،
                  ويشرح سياسات الشحن والإرجاع. وعند الحاجة يحوّلك مباشرة لفريق الدعم البشري على واتساب.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-border">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold">رد فوري</div>
                    <div className="text-xs text-muted-foreground">أقل من 5 ثوانٍ</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-border">
                  <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold">معلومات دقيقة</div>
                    <div className="text-xs text-muted-foreground">من كتالوج المتجر مباشرة</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-border">
                  <MessageCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold">تحويل بشري</div>
                    <div className="text-xs text-muted-foreground">واتساب عند الحاجة</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">جرّب أن تسأل:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'اقترح لي خوذة بسعر مناسب',
                    'ما هي سياسة الإرجاع؟',
                    'أين طلبي رقم #1234؟',
                    'كم تستغرق مدة الشحن؟',
                  ].map((q) => (
                    <span
                      key={q}
                      className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border"
                    >
                      {q}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  💡 افتح المساعد من الزر الدائري أسفل يسار الشاشة في أي وقت.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="container pb-12">
        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-bold">موقعنا على الخريطة</h2>
          <p className="text-muted-foreground text-sm">الرياض، المملكة العربية السعودية</p>
          <div className="rounded-2xl overflow-hidden border border-border shadow-glow aspect-[16/9] md:aspect-[21/9] bg-card">
            <iframe
              title="موقع ROAD BIKER على خرائط جوجل"
              src="https://www.google.com/maps?q=Riyadh,Saudi+Arabia&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href="https://maps.google.com/?q=Riyadh,Saudi+Arabia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <MapPin className="h-4 w-4" />
            افتح في خرائط جوجل
          </a>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
}
