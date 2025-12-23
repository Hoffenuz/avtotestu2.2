import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, LogOut, Trophy, CheckCircle, XCircle, ArrowLeft, Clock } from 'lucide-react';

interface TestResult {
  id: string;
  variant: number;
  correct_answers: number;
  total_questions: number;
  time_taken_seconds: number | null;
  completed_at: string;
}

const Profile = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) {
          console.error('Error fetching results:', error);
        } else {
          setResults(data || []);
        }
      } catch (err) {
        console.error('Results fetch error:', err);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Group results by variant and get best score for each
  const bestResultsByVariant = results.reduce((acc, result) => {
    const existing = acc[result.variant];
    if (!existing || result.correct_answers > existing.correct_answers) {
      acc[result.variant] = result;
    }
    return acc;
  }, {} as Record<number, TestResult>);

  const sortedVariants = Object.keys(bestResultsByVariant)
    .map(Number)
    .sort((a, b) => a - b);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Orqaga
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Profile Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {profile?.full_name || profile?.username || 'Foydalanuvchi'}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              {profile?.username && (
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{results.length}</div>
            <p className="text-xs text-muted-foreground">Jami testlar</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{sortedVariants.length}</div>
            <p className="text-xs text-muted-foreground">Variantlar</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {results.reduce((sum, r) => sum + r.correct_answers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">To'g'ri javoblar</p>
          </Card>
          <Card className="p-4 text-center">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {results.reduce((sum, r) => sum + (r.total_questions - r.correct_answers), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Noto'g'ri javoblar</p>
          </Card>
        </div>

        {/* Results by Variant */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Variant bo'yicha eng yaxshi natijalar
          </h2>

          {loadingResults ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : sortedVariants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Hali test natijalaringiz yo'q</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Testni boshlash
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedVariants.map((variant) => {
                const result = bestResultsByVariant[variant];
                const score = Math.round((result.correct_answers / result.total_questions) * 100);
                const passed = score >= 80;

                return (
                  <div
                    key={variant}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        passed ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        <span className={`text-sm font-bold ${
                          passed ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {variant}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Variant {variant}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(result.time_taken_seconds)}
                          </span>
                          <span>
                            {new Date(result.completed_at).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        passed ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {result.correct_answers} / {result.total_questions}
                      </div>
                      <div className={`text-sm ${
                        passed ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {score}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Profile;