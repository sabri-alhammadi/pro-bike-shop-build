import { StoreHeader } from '@/components/StoreHeader';
import { HeroSection } from '@/components/HeroSection';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProductGrid } from '@/components/ProductGrid';
import { StoreFooter } from '@/components/StoreFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <HeroSection />
      <CategoriesSection />
      <ProductGrid />
      <StoreFooter />
    </div>
  );
};

export default Index;
