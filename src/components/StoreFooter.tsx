import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { VisitCounter } from './VisitCounter';

export function StoreFooter() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-heading text-xl font-bold text-primary mb-4">ROAD BIKER</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              متجر رود بايكر المتخصص في إكسسوارات الدراجات النارية وقطع الغيار ومعدات الحماية من أفضل العلامات التجارية العالمية.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold mb-4">المتجر</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link to="/offers" className="hover:text-primary transition-colors">العروض</Link></li>
              <li><Link to="/category/helmets" className="hover:text-primary transition-colors">الخوذ</Link></li>
              <li><Link to="/category/jackets" className="hover:text-primary transition-colors">الجاكيتات</Link></li>
              <li><Link to="/category/parts" className="hover:text-primary transition-colors">قطع الغيار</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">الشركة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">تواصل معنا</Link></li>
              <li><Link to="/category/accessories" className="hover:text-primary transition-colors">الإكسسوارات</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <a
              href="https://wa.me/966500123007"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(142,70%,40%)] text-[hsl(0,0%,100%)] hover:opacity-90 transition-opacity text-sm font-medium mb-4"
            >
              <MessageCircle className="h-4 w-4" />
              واتساب
            </a>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> info@roadbiker.sa</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> الرياض، السعودية</li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              السبت – الخميس: 9 ص – 11 م
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Road Biker. جميع الحقوق محفوظة.</span>
          <VisitCounter />
        </div>
      </div>
    </footer>
  );
}
