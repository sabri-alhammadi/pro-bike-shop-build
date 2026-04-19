import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Package, MessageSquare, Eye, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const SHOPIFY_DOMAIN = 'pro-bike-shop-build-7rp8a.myshopify.com';
const STOREFRONT_TOKEN = 'd3d53d1526c2f54bc4ce5982f724c4f4';

type Conversation = {
  id: string;
  session_id: string;
  user_message: string;
  assistant_message: string;
  created_at: string;
};

type Product = {
  title: string;
  handle: string;
  price: string;
  inventory: number | null;
};

export default function Admin() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [visits, setVisits] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    document.title = 'لوحة الإدارة | ROAD BIKER';
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate('/auth');
        return;
      }
      setUserEmail(sessionData.session.user.email || '');
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', sessionData.session.user.id);
      const admin = !!roles?.some((r) => r.role === 'admin');
      setIsAdmin(admin);
      setChecking(false);
      if (admin) loadData();
    })();
  }, [navigate]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [convRes, visitRes, productsRes] = await Promise.all([
        supabase.from('chat_conversations').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('site_visits').select('count').eq('id', 1).single(),
        fetch(`https://${SHOPIFY_DOMAIN}/api/2025-07/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query: `{ products(first:50){ edges{ node{ title handle totalInventory priceRange{ minVariantPrice{ amount currencyCode } } } } } }`,
          }),
        }).then((r) => r.json()),
      ]);
      setConversations(convRes.data || []);
      setVisits(visitRes.data?.count ?? 0);
      const prods = (productsRes?.data?.products?.edges || []).map((e: any) => ({
        title: e.node.title,
        handle: e.node.handle,
        price: `${e.node.priceRange.minVariantPrice.amount} ${e.node.priceRange.minVariantPrice.currencyCode}`,
        inventory: e.node.totalInventory,
      }));
      setProducts(prods);
    } catch (e) {
      console.error(e);
      toast.error('تعذّر تحميل البيانات');
    } finally {
      setLoadingData(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>صلاحيات غير كافية</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              حسابك ({userEmail}) ليس له صلاحية admin. اطلب من مدير المتجر إضافة دورك.
            </p>
            <p className="text-xs text-muted-foreground bg-muted p-3 rounded-md font-mono text-left" dir="ltr">
              INSERT INTO user_roles (user_id, role)<br/>
              VALUES ('YOUR_USER_ID', 'admin');
            </p>
            <Button onClick={logout} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 ml-2" /> تسجيل خروج
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">لوحة إدارة ROAD BIKER</h1>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
          <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 ml-2" /> خروج
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{visits ?? '-'}</p>
                <p className="text-xs text-muted-foreground">إجمالي الزيارات</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{conversations.length}</p>
                <p className="text-xs text-muted-foreground">محادثات الشات بوت</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">المنتجات</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="conversations">
          <TabsList>
            <TabsTrigger value="conversations">المحادثات</TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-3">
            {loadingData && <Loader2 className="h-5 w-5 animate-spin" />}
            {!loadingData && conversations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">لا توجد محادثات بعد.</p>
            )}
            {conversations.map((c) => (
              <Card key={c.id}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {c.session_id.slice(0, 8)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString('ar-SA')}
                    </span>
                  </div>
                  <div className="text-sm"><strong>العميل:</strong> {c.user_message}</div>
                  <div className="text-sm text-muted-foreground"><strong>الوكيل:</strong> {c.assistant_message}</div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardContent className="pt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">المنتج</th>
                      <th className="text-right p-2">السعر</th>
                      <th className="text-right p-2">المخزون</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.handle} className="border-b">
                        <td className="p-2">{p.title}</td>
                        <td className="p-2">{p.price}</td>
                        <td className="p-2">
                          {p.inventory === null ? '-' : p.inventory <= 0 ? (
                            <Badge variant="destructive">نفذ</Badge>
                          ) : p.inventory < 5 ? (
                            <Badge>قليل ({p.inventory})</Badge>
                          ) : (
                            <Badge variant="secondary">{p.inventory}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
