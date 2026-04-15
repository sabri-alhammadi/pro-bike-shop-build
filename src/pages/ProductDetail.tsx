import { useParams, Link } from 'react-router-dom';
import { useProductByHandle } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { Loader2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProductByHandle(handle || '');
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="text-center py-32 text-muted-foreground">المنتج غير موجود</div>
      </div>
    );
  }

  const images = product.images.edges;
  const variants = product.variants.edges;
  const selectedVariant = variants[selectedVariantIndex]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    const shopifyProduct = {
      node: product,
    };
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success('تمت الإضافة إلى السلة', { position: 'top-center' });
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowRight className="h-4 w-4" />
          العودة للمتجر
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-card border border-border">
              {images[selectedImageIndex]?.node ? (
                <img
                  src={images[selectedImageIndex].node.url}
                  alt={images[selectedImageIndex].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ShoppingCart className="h-16 w-16" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: { node: { url: string; altText: string | null } }, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      i === selectedImageIndex ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">{product.title}</h1>
            <p className="text-2xl font-bold text-primary">
              {selectedVariant ? parseFloat(selectedVariant.price.amount).toFixed(0) : '—'}{' '}
              <span className="text-base">{selectedVariant?.price.currencyCode}</span>
            </p>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Variant selection */}
            {product.options?.filter((o: { name: string }) => o.name !== 'Title').map((option: { name: string; values: string[] }) => (
              <div key={option.name}>
                <label className="text-sm font-bold mb-2 block">{option.name}</label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v: { node: { id: string; title: string; selectedOptions: Array<{ name: string; value: string }>; availableForSale: boolean } }, i: number) => {
                    const optValue = v.node.selectedOptions.find(o => o.name === option.name)?.value;
                    return (
                      <button
                        key={v.node.id}
                        onClick={() => setSelectedVariantIndex(i)}
                        disabled={!v.node.availableForSale}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          i === selectedVariantIndex
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/40'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {optValue || v.node.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handleAddToCart}
              disabled={cartLoading || !selectedVariant?.availableForSale}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {cartLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  أضف إلى السلة
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
