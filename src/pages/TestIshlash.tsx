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
  { id: "uz-lat" as const, label: "Lotin", flag: "🇺🇿", file: "700baza2.json" },
  { id: "uz" as const, label: "Кирилл", flag: "🇺🇿", file: "700baza.json" },
  { id: "ru" as const, label: "Русский", flag: "🇷🇺", file: "700baza.json" },
];

export default function TestIshlash() {
  const [testStarted, setTestStarted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'uz-lat' | 'uz' | 'ru'>('uz');
  const { user, profile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

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
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-primary/5 flex items-center">
        <div className="w-full max-w-3xl mx-auto px-4 py-4">
          {/* Top Bar: Home + Language Selection */}
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Bosh sahifa
              </Button>
            </Link>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  variant={selectedLang === lang.id ? "default" : "ghost"}
                  size="sm"
                  className={`px-3 py-1 h-8 text-xs ${
                    selectedLang === lang.id 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => handleLanguageChange(lang.id)}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Compact Main Content */}
          <div className="text-center">
            {/* Profile + Hero inline */}
            <div className="flex items-center justify-between mb-4">
              {user ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium text-sm">{profile?.full_name || profile?.username || 'Profil'}</span>
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium text-sm">Kirish</span>
                </Button>
              )}

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Test ishlash
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    700 dan 20 ta tasodifiy savol
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards - Compact */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Card className="p-3 bg-card border-border text-center">
                <HelpCircle className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold text-foreground">20</div>
                <div className="text-xs text-muted-foreground">Savollar</div>
              </Card>
              <Card className="p-3 bg-card border-border text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold text-foreground">30</div>
                <div className="text-xs text-muted-foreground">daqiqa</div>
              </Card>
              <Card className="p-3 bg-card border-border text-center">
                <CheckCircle className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold text-foreground">80%</div>
                <div className="text-xs text-muted-foreground">O'tish balli</div>
              </Card>
            </div>

            {/* Start Button */}
            <Button
              size="lg"
              className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-[hsl(var(--cta-green))] hover:bg-[hsl(var(--cta-green-hover))]"
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
