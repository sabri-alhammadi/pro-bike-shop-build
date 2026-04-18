import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'rb_visit_counted';

export function useVisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const alreadyCounted = sessionStorage.getItem(STORAGE_KEY);

        if (!alreadyCounted) {
          const { data, error } = await supabase.rpc('increment_site_visits');
          if (!error && data != null && !cancelled) {
            sessionStorage.setItem(STORAGE_KEY, '1');
            setCount(Number(data));
            return;
          }
        }

        const { data, error } = await supabase
          .from('site_visits')
          .select('count')
          .eq('id', 1)
          .maybeSingle();
        if (!error && data && !cancelled) setCount(Number(data.count));
      } catch (e) {
        console.error('visit counter error', e);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}
