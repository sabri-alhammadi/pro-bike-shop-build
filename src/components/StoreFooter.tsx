import { MessageCircle } from 'lucide-react';

export function StoreFooter() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold text-primary mb-4">ROAD BIKER</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              متجر رود بايكر المتخصص في إكسسوارات الدراجات النارية وقطع الغيار ومعدات الحماية من أفضل العلامات التجارية العالمية.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">الرئيسية</a></li>
              <li><a href="#products" className="hover:text-primary transition-colors">المنتجات</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">العروض</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">اتصل بنا</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <a
              href="https://wa.me/966500123007"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(142,70%,40%)] text-[hsl(0,0%,100%)] hover:opacity-90 transition-opacity text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              واتساب
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              متاحين من السبت إلى الخميس<br />
              من 9 صباحاً حتى 11 مساءً
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Road Biker. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
