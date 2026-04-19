import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'تسجيل الدخول | ROAD BIKER';
    // Listener FIRST, then check existing session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/admin');
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin');
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (mode: 'signin' | 'signup') => {
    if (!email || password.length < 6) {
      toast.error('أدخل بريداً صحيحاً وكلمة مرور 6 أحرف فأكثر');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success('تم إنشاء الحساب وتسجيل الدخول!');
          navigate('/admin');
        } else {
          toast.success('تم إنشاء الحساب! تحقق من بريدك لتأكيد الحساب.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('مرحباً بعودتك!');
        navigate('/admin');
      }
    } catch (e: any) {
      toast.error(e.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>دخول لوحة الإدارة</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="signin">دخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>
            {(['signin', 'signup'] as const).map((mode) => (
              <TabsContent key={mode} value={mode} className="space-y-4">
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>كلمة المرور</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" />
                </div>
                <Button onClick={() => handleAuth(mode)} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'signin' ? 'دخول' : 'إنشاء حساب'}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
          <p className="text-xs text-muted-foreground text-center mt-4">
            بعد إنشاء أول حساب، اطلب من المسؤول منحك صلاحية admin من قاعدة البيانات.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
