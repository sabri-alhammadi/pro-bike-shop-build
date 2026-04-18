import { Eye } from 'lucide-react';
import { useVisitCounter } from '@/hooks/useVisitCounter';

export function VisitCounter() {
  const count = useVisitCounter();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border text-xs text-muted-foreground">
      <Eye className="h-3.5 w-3.5 text-primary" />
      <span>
        تمت زيارة المتجر{' '}
        <span className="font-bold text-foreground tabular-nums">
          {count == null ? '...' : count.toLocaleString('ar-EG')}
        </span>{' '}
        مرة
      </span>
    </div>
  );
}
