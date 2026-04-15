import { Truck, Shield, Headphones } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-[100px]" />
      </div>

      <div className="container relative py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            شحن مجاني للطلبات فوق 300 ريال
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            كل ما يحتاجه{' '}
            <span className="text-gradient-accent">الدراج</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            اكتشف أفضل إكسسوارات الدراجات النارية، قطع الغيار، والملابس الواقية من أفضل العلامات التجارية العالمية
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a href="#products" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity shadow-glow">
              تسوق الآن
            </a>
            <a href="#categories" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors">
              تصفح الأقسام
            </a>
          </div>
        </div>

        {/* Features strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: 'شحن سريع', desc: 'توصيل لجميع مناطق المملكة' },
            { icon: Shield, title: 'منتجات أصلية', desc: 'ضمان الجودة من أفضل العلامات' },
            { icon: Headphones, title: 'دعم فني', desc: 'خدمة عملاء متاحة دائماً' },
          ].map((feature) => (
            <div key={feature.title} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
