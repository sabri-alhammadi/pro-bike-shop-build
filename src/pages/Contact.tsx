import { Link } from 'react-router-dom';
import { useState } from 'react';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { ArrowRight, MessageCircle, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
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

      <StoreFooter />
    </div>
  );
}
