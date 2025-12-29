import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Play, 
  Clock, 
  HelpCircle,
  CheckCircle
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
  const { language, setLanguage } = useLanguage();
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Bosh sahifa</span>
            </Button>
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
            {languages.map((lang) => (
              <Button
                key={lang.id}
                variant={selectedLang === lang.id ? "default" : "ghost"}
                size="sm"
                className={`px-2 sm:px-3 py-1 h-8 text-xs ${
                  selectedLang === lang.id 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10"
                }`}
                onClick={() => handleLanguageChange(lang.id)}
              >
                {/* Show flags only on desktop */}
                <span className="hidden sm:inline mr-1">{lang.flag}</span>
                <span>{lang.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Icon & Title */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Test ishlash
              </h1>
              <p className="text-muted-foreground mt-1">
                700 ta savoldan 20 ta tasodifiy
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center gap-6 sm:gap-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">20</span>
              <span className="text-xs text-muted-foreground">Savollar</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">30</span>
              <span className="text-xs text-muted-foreground">Daqiqa</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">80%</span>
              <span className="text-xs text-muted-foreground">O'tish</span>
            </div>
          </div>

          {/* Start Button */}
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-[hsl(var(--cta-green))] hover:bg-[hsl(var(--cta-green-hover))] rounded-xl"
            onClick={() => setTestStarted(true)}
          >
            <Play className="w-5 h-5 mr-2" />
            Testni boshlash
          </Button>

          {/* Info text */}
          <p className="text-xs text-muted-foreground">
            Testni boshlash uchun ro'yxatdan o'tish shart emas
          </p>
        </div>
      </main>
    </div>
  );
}
