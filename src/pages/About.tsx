import { Link } from 'react-router-dom';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { ArrowRight, Shield, Truck, Award, Heart, Users, Wrench } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'منتجات أصلية',
    desc: 'نتعامل فقط مع وكلاء معتمدين لضمان أصالة كل قطعة نبيعها.',
  },
  {
    icon: Truck,
    title: 'شحن سريع',
    desc: 'نوصل طلبك في أسرع وقت لجميع مناطق المملكة العربية السعودية.',
  },
  {
    icon: Award,
    title: 'جودة عالمية',
    desc: 'علامات تجارية رائدة مثل SCOYCO و ILM و DID و ROAD LOCK.',
  },
  {
    icon: Wrench,
    title: 'دعم فني متخصص',
    desc: 'فريقنا يساعدك في اختيار المقاس والقطعة المناسبة لدراجتك.',
  },
];

const stats = [
  { value: '6+', label: 'علامات تجارية' },
  { value: '24/7', label: 'دعم العملاء' },
  { value: '100%', label: 'منتجات أصلية' },
  { value: 'KSA', label: 'شحن لكل المملكة' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <section className="border-b border-border bg-gradient-hero">
        <div className="container py-12 md:py-20 space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowRight className="h-4 w-4" />
            العودة للمتجر
          </Link>
          <h1 className="font-heading text-4xl md:text-6xl font-bold">
            <span className="text-gradient-accent">من نحن</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            <span className="font-bold text-foreground">ROAD BIKER (رود بايكر)</span> هو متجرك المتخصص في عالم الدراجات النارية في المملكة العربية السعودية.
            نقدم لك أفضل إكسسوارات السلامة، قطع الغيار الأصلية، ومعدات الحماية من أرقى العلامات التجارية العالمية.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Heart className="h-4 w-4" />
            قصتنا
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">شغف الطريق يجمعنا</h2>
          <p className="text-muted-foreground leading-relaxed">
            بدأت رحلتنا من حب حقيقي للدراجات النارية وثقافة الراكبين. أردنا أن نوفر للمجتمع السعودي
            مكاناً يجدون فيه كل ما يحتاجونه — من أبسط الإكسسوارات إلى أفضل معدات الحماية —
            بأسعار تنافسية وجودة لا يتم التنازل عنها.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            اليوم، نفخر بثقة آلاف الدراجين في جميع أنحاء المملكة، ونعمل كل يوم على توسيع تشكيلتنا
            وتحسين تجربة التسوق لخدمتكم بشكل أفضل.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold mb-1">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border border-primary/20 p-8 md:p-12 text-center space-y-4">
          <Users className="h-12 w-12 text-primary mx-auto" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold">انضم إلى عائلة الدراجين</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            تصفح منتجاتنا أو تواصل معنا مباشرة لاختيار ما يناسب احتياجك.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-glow"
            >
              تصفح المنتجات
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border border-border bg-card font-bold hover:border-primary/40 transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
}
