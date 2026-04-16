import { Truck, Shield, Headphones } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState, useCallback } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

import heroSlide1 from '@/assets/hero-slide-1.jpg';
import heroSlide2 from '@/assets/hero-slide-2.jpg';
import heroSlide3 from '@/assets/hero-slide-3.jpg';

const slides = [
  {
    image: heroSlide1,
    title: 'تشكيلة جاكيتات SCOYCO',
    subtitle: 'حماية وأسلوب وراحة لكل رحلة',
    cta: 'تسوق الآن',
    href: '#products',
  },
  {
    image: heroSlide2,
    title: 'خوذ احترافية',
    subtitle: 'أفضل الخوذ العالمية بأسعار مميزة',
    cta: 'اكتشف المجموعة',
    href: '#products',
  },
  {
    image: heroSlide3,
    title: 'قطع غيار أصلية',
    subtitle: 'جنازير وسبروكت وقطع غيار لجميع الموديلات',
    cta: 'تصفح القطع',
    href: '#products',
  },
];

export function HeroSection() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  const handleApiSet = useCallback((newApi: CarouselApi) => {
    setApi(newApi);
    if (newApi) {
      newApi.on('select', onSelect);
      onSelect();
    }
  }, [onSelect]);

  return (
    <section className="relative overflow-hidden">
      <Carousel
        opts={{ loop: true, direction: 'rtl' }}
        plugins={[plugin.current]}
        setApi={handleApiSet}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 relative">
              <div className="relative h-[400px] md:h-[520px] lg:h-[600px] overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1920}
                  height={800}
                  {...(index === 0 ? {} : { loading: 'lazy' as const })}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container">
                    <div className="max-w-lg mr-auto text-right space-y-4 md:space-y-6">
                      <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-white/80">{slide.subtitle}</p>
                      <a
                        href={slide.href}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity shadow-glow"
                      >
                        {slide.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? 'bg-primary w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </Carousel>

      {/* Features strip */}
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
