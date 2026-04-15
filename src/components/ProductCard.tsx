import { Link } from 'react-router-dom';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore, type ShopifyProduct } from '@/stores/cartStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const p = product.node;
  const image = p.images.edges[0]?.node;
  const variant = p.variants.edges[0]?.node;
  const price = p.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success('تمت الإضافة إلى السلة', { position: 'top-center' });
  };

  return (
    <Link
      to={`/product/${p.handle}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-300 shadow-card hover:shadow-glow animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {p.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">
            {parseFloat(price.amount).toFixed(0)} <span className="text-xs">{price.currencyCode}</span>
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
