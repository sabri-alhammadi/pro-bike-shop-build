import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Loader2, PackageX } from 'lucide-react';

export function ProductGrid() {
  const { data: products, isLoading, error } = useProducts(20);

  if (isLoading) {
    return (
      <section id="products" className="container py-16">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="container py-16">
        <div className="text-center py-20 text-destructive">
          حدث خطأ في تحميل المنتجات
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="container py-16">
      <div className="text-center mb-10">
        <h2 className="font-heading text-3xl md:text-4xl font-bold">
          <span className="text-gradient-accent">المنتجات</span> المميزة
        </h2>
        <p className="text-muted-foreground mt-2">أحدث المنتجات المتوفرة لدينا</p>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <PackageX className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-xl font-bold text-muted-foreground">لا توجد منتجات حالياً</p>
          <p className="text-sm text-muted-foreground">
            أخبرنا بالمنتجات التي تريد إضافتها عبر المحادثة
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.node.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
