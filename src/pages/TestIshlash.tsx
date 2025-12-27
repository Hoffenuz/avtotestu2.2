import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  User, 
  LogIn, 
  Play, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  Globe
} from "lucide-react";
import { TestInterfaceBase } from "@/components/TestInterfaceBase";

const languages = [
  { id: "uz-lat" as const, label: "O'zbekcha (Lotin)", flag: "🇺🇿", file: "700baza2.json" },
  { id: "uz" as const, label: "Ўзбекча (Кирилл)", flag: "🇺🇿", file: "700baza.json" },
  { id: "ru" as const, label: "Русский", flag: "🇷🇺", file: "700baza.json" },
];

export default function TestIshlash() {
  const [testStarted, setTestStarted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'uz-lat' | 'uz' | 'ru'>('uz');
  const { user, profile, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!user) return null;

  const dataFile = languages.find(l => l.id === selectedLang)?.file || "700baza.json";

  if (testStarted) {
    return (
      <TestInterfaceBase 
        onExit={() => setTestStarted(false)} 
        dataSource={`/${dataFile}`}
        testName="Test ishlash"
        questionCount={20}
        timeLimit={30 * 60}
        randomize={true}
      />
    );
  }

  const handleLanguageChange = (langId: 'uz-lat' | 'uz' | 'ru') => {
    setSelectedLang(langId);
    setLanguage(langId);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back to Home Button */}
          <Link to="/">
            <Button variant="outline" className="mb-6 gap-2">
              <Home className="w-4 h-4" />
              Bosh sahifa
            </Button>
          </Link>

          {/* Profile Section */}
          <div className="mb-8">
            {user ? (
              <Button
                variant="default"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-3 h-auto py-3 px-4 bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base">{profile?.full_name || profile?.username || 'Profil'}</div>
                  {profile?.username && profile?.full_name && (
                    <div className="text-xs text-primary-foreground/70">@{profile.username}</div>
                  )}
                </div>
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => navigate('/auth')}
                className="flex items-center gap-3 h-auto py-3 px-4 bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                <span className="font-semibold">Kirish</span>
              </Button>
            )}
          </div>

          {/* Main Content */}
          <div className="text-center">
            {/* Hero Section */}
            <div className="flex flex-col items-center gap-4 mb-10">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Test ishlash
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  700 ta savoldan tasodifiy 20 ta savol. Bilimingizni sinab ko'ring!
                </p>
              </div>
            </div>

            {/* Language Selection */}
            <Card className="p-6 bg-card border-border mb-8 max-w-xl mx-auto">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center justify-center gap-2">
                <Globe className="w-4 h-4" />
                Til tanlang
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {languages.map((lang) => (
                  <Button
                    key={lang.id}
                    variant={selectedLang === lang.id ? "default" : "outline"}
                    className={`flex flex-col items-center gap-2 h-auto py-4 ${
                      selectedLang === lang.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-primary/10 hover:border-primary"
                    }`}
                    onClick={() => handleLanguageChange(lang.id)}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-xs font-medium">{lang.label}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 lg:gap-5 mb-8 max-w-xl mx-auto">
              <Card className="p-4 lg:p-5 bg-card border-border text-center">
                <HelpCircle className="w-6 lg:w-8 h-6 lg:h-8 text-primary mx-auto mb-2 lg:mb-3" />
                <div className="text-2xl lg:text-3xl font-bold text-foreground">20</div>
                <div className="text-xs lg:text-sm text-muted-foreground mt-1">Savollar</div>
              </Card>
              <Card className="p-4 lg:p-5 bg-card border-border text-center">
                <Clock className="w-6 lg:w-8 h-6 lg:h-8 text-primary mx-auto mb-2 lg:mb-3" />
                <div className="text-2xl lg:text-3xl font-bold text-foreground">30</div>
                <div className="text-xs lg:text-sm text-muted-foreground mt-1">daqiqa</div>
              </Card>
              <Card className="p-4 lg:p-5 bg-card border-border text-center">
                <CheckCircle className="w-6 lg:w-8 h-6 lg:h-8 text-primary mx-auto mb-2 lg:mb-3" />
                <div className="text-2xl lg:text-3xl font-bold text-foreground">80%</div>
                <div className="text-xs lg:text-sm text-muted-foreground mt-1">O'tish balli</div>
              </Card>
            </div>

            {/* Start Button */}
            <Button
              size="lg"
              className="w-full max-w-xl h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-[hsl(var(--cta-green))] hover:bg-[hsl(var(--cta-green-hover))]"
              onClick={() => setTestStarted(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Testni boshlash
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
