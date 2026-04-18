import { Link } from 'react-router-dom';
import { HardHat, Shirt, Footprints, Wrench, Sparkles } from 'lucide-react';

const categories = [
  { slug: 'helmets', icon: HardHat, label: 'الخوذ', color: 'from-red-600/20 to-red-800/20' },
  { slug: 'jackets', icon: Shirt, label: 'الجاكيتات', color: 'from-blue-600/20 to-blue-800/20' },
  { slug: 'boots', icon: Footprints, label: 'البوت', color: 'from-amber-600/20 to-amber-800/20' },
  { slug: 'accessories', icon: Sparkles, label: 'الإكسسوارات', color: 'from-purple-600/20 to-purple-800/20' },
  { slug: 'parts', icon: Wrench, label: 'قطع الغيار', color: 'from-green-600/20 to-green-800/20' },
];

export function CategoriesSection() {
  return (
    <section id="categories" className="container py-12">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold">
          تصفح <span className="text-gradient-accent">الأقسام</span>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">اختر القسم الذي يناسبك</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            to={`/category/${cat.slug}`}
            className={`group flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br ${cat.color} border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-glow hover:-translate-y-1`}
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <cat.icon className="h-7 w-7 text-primary" />
            </div>
            <span className="text-sm font-bold">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
