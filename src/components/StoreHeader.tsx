import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { CartDrawer } from './CartDrawer';
import { PromoBanner } from './PromoBanner';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'العروض', href: '/offers' },
  { label: 'الخوذ', href: '/category/helmets' },
  { label: 'الجاكيتات', href: '/category/jackets' },
  { label: 'الإكسسوارات', href: '/category/accessories' },
  { label: 'قطع الغيار', href: '/category/parts' },
  { label: 'تواصل معنا', href: '/contact' },
];

export function StoreHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <PromoBanner />
      <div className="container flex h-16 items-center justify-between gap-4 border-b border-border">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-heading text-2xl font-bold text-primary">ROAD BIKER</span>
          <span className="font-heading text-sm font-semibold text-muted-foreground hidden sm:inline">رود بايكر</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md text-foreground/70 hover:text-primary hover:bg-secondary transition-colors hidden sm:inline-flex">
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <CartDrawer />
          <button
            className="lg:hidden p-2 rounded-md text-foreground/70 hover:text-primary hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
