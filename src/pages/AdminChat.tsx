import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { SEOHead } from '@/components/SEOHead';
import { AdminChatPanel } from '@/components/admin/AdminChatPanel';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminChat() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user has admin role
  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <SEOHead
          title="Ruxsat yo'q"
          description="Admin paneli"
          canonicalUrl="/admin/chat"
        />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
              <h1 className="text-xl font-bold mb-2">Ruxsat yo'q</h1>
              <p className="text-muted-foreground mb-4">
                Bu sahifaga kirish uchun admin huquqlari kerak.
              </p>
              <Button onClick={() => navigate('/')}>
                Bosh sahifaga qaytish
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEOHead
        title="Admin Chat Panel"
        description="Foydalanuvchilar bilan suhbat"
        canonicalUrl="/admin/chat"
      />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Qo'llab-quvvatlash suhbatlari</h1>
          <p className="text-muted-foreground">
            Foydalanuvchilar xabarlariga javob bering
          </p>
        </div>
        <AdminChatPanel />
      </div>
    </MainLayout>
  );
}
