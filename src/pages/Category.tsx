import { useParams, Link, Navigate } from 'react-router-dom';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight, PackageX, Loader2 } from 'lucide-react';

// Maps URL slug -> Shopify product_type + Arabic display title + tagline
const CATEGORIES: Record<string, { type: string; title: string; tagline: string }> = {
  helmets: {
    type: 'خوذ',
    title: 'الخوذ',
    tagline: 'حماية الرأس أولاً — أفضل الخوذ العالمية',
  },
  jackets: {
    type: 'ملابس واقية',
    title: 'الجاكيتات والملابس الواقية',
    tagline: 'جاكيتات احترافية للحماية والأناقة في كل رحلة',
  },
  boots: {
    type: 'أحذية',
    title: 'البوت والأحذية',
    tagline: 'أحذية متينة لحماية القدم والكاحل',
  },
  accessories: {
    type: 'إكسسوارات',
    title: 'الإكسسوارات والحماية',
    tagline: 'قفازات، حوامل، وكل ما تحتاجه لرحلتك',
  },
  parts: {
    type: 'قطع غيار',
    title: 'قطع الغيار',
    tagline: 'قطع غيار أصلية لجميع موديلات الدراجات',
  },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? CATEGORIES[slug] : undefined;

  // Always call hooks before any return
  const { data: products, isLoading } = useProducts(50, config ? `product_type:"${config.type}"` : undefined);

  if (!config) {
    return <Navigate to="/" replace />;
  }

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
            <span className="text-gradient-accent">{config.title}</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">{config.tagline}</p>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <PackageX className="h-16 w-16 text-muted-foreground mx-auto" />
            <p className="text-xl font-bold text-muted-foreground">لا توجد منتجات في هذا القسم حالياً</p>
            <Link to="/" className="inline-block px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              تصفح كل المنتجات
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{products.length} منتج</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.node.id} product={product} index={index} />
              ))}
            </div>
          </>
        )}
      </section>

      <StoreFooter />
    </div>
  );
}
