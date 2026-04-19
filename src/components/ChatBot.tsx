import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const WELCOME: Msg = {
  role: 'assistant',
  content:
    'مرحباً بك في **ROAD BIKER** 🏍️\nأنا وكيلك الذكي. يمكنني:\n- اقتراح منتجات بالأسعار والروابط\n- تتبع طلبك (أعطني رقم الطلب + بريدك)\n- شرح سياسات الشحن والإرجاع والدفع\n- توصيلك بالدعم البشري على واتساب\n\nكيف أقدر أساعدك؟',
};

function getSessionId() {
  let id = sessionStorage.getItem('chat_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('chat_session_id', id);
  }
  return id;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: 'user', content: text };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].filter((m) => m !== WELCOME),
          sessionId: getSessionId(),
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast.error('تم تجاوز الحد المسموح، حاول لاحقاً.');
        else if (resp.status === 402) toast.error('الرصيد غير كافٍ. أضف رصيداً للمتابعة.');
        else toast.error('حدث خطأ في المساعد.');
        return;
      }

      const data = await resp.json();
      const reply = data.message || data.error || 'لم أتمكن من الرد.';
      setMessages((p) => [...p, { role: 'assistant', content: reply }]);
    } catch (e) {
      console.error(e);
      toast.error('فشل الاتصال بالمساعد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="فتح المساعد"
        className="fixed bottom-5 left-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm h-[32rem] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="px-4 py-3 bg-gradient-to-l from-primary to-primary/80 text-primary-foreground">
            <div className="font-bold">وكيل ROAD BIKER الذكي 🤖</div>
            <div className="text-xs opacity-90">منتجات • طلبات • شحن • دعم</div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                  }`}
                >
                  <div className="prose prose-sm max-w-none prose-a:text-primary prose-a:underline dark:prose-invert">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-2xl rounded-tl-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="اسأل عن منتج، طلب، أو سياسة..."
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
              aria-label="إرسال"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
