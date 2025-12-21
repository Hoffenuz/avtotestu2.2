import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, BookOpen, Car, FileText, Clock, CheckCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface TestStartPageProps {
  onStartTest: (variant: number) => void;
}

const languages = [
  { id: "uz-lat" as const, label: "O'zbekcha", flag: "🇺🇿" },
  { id: "uz" as const, label: "Ўзбекча", flag: "🇺🇿" },
  { id: "ru" as const, label: "Русский", flag: "🇷🇺" },
];

// All 55 variants
const TOTAL_VARIANTS = 55;
const variants = Array.from({ length: TOTAL_VARIANTS }, (_, i) => i + 1);

export const TestStartPage = ({ onStartTest }: TestStartPageProps) => {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [showAllVariants, setShowAllVariants] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const categories = [
    { id: "theory", label: t("categories.theory"), icon: BookOpen, color: "bg-blue-500" },
    { id: "signs", label: t("categories.signs"), icon: FileText, color: "bg-green-500" },
    { id: "driving", label: t("categories.driving"), icon: Car, color: "bg-orange-500" },
    { id: "rules", label: t("categories.rules"), icon: Globe, color: "bg-purple-500" },
  ];

  const handleStartTest = () => {
    if (selectedVariant !== null) {
      onStartTest(selectedVariant);
    }
  };

  // Show first 20 variants by default, all when expanded
  const visibleVariants = showAllVariants ? variants : variants.slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground">{t("app.title")}</h1>
              <p className="text-xs text-muted-foreground">{t("app.subtitle")}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center px-3 py-4 gap-3">
          {/* Language Selection - Mobile */}
          <Card className="w-full p-3 bg-card/50 backdrop-blur-sm border-border">
            <h2 className="text-xs font-medium text-muted-foreground mb-2 text-center">{t("test.selectLanguage")}</h2>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  variant={language === lang.id ? "default" : "outline"}
                  className={`flex flex-col items-center gap-0.5 h-auto py-2 text-xs ${
                    language === lang.id 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/10 hover:border-primary"
                  }`}
                  onClick={() => setLanguage(lang.id)}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-[10px] font-medium">{lang.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Variant Selection - Mobile */}
          <Card className="w-full p-3 bg-card/50 backdrop-blur-sm border-border">
            <h2 className="text-xs font-medium text-muted-foreground mb-2 text-center">{t("test.selectVariant")}</h2>
            <div className="grid grid-cols-5 gap-2">
              {visibleVariants.map((v) => (
                <Button
                  key={v}
                  variant={selectedVariant === v ? "default" : "outline"}
                  className={`h-10 text-sm font-medium ${
                    selectedVariant === v 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/10 hover:border-primary"
                  }`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
            {TOTAL_VARIANTS > 20 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs text-muted-foreground"
                onClick={() => setShowAllVariants(!showAllVariants)}
              >
                {showAllVariants ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    {language === 'ru' ? 'Скрыть' : language === 'uz' ? 'Яшириш' : 'Yashirish'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    {language === 'ru' ? `Показать все (${TOTAL_VARIANTS})` : language === 'uz' ? `Барчасини кўрсатиш (${TOTAL_VARIANTS})` : `Barchasini ko'rsatish (${TOTAL_VARIANTS})`}
                  </>
                )}
              </Button>
            )}
          </Card>

          {/* Start Button - Mobile */}
          <Button
            size="lg"
            className="w-full max-w-xs h-12 text-base font-semibold shadow-lg bg-primary hover:bg-primary/90"
            onClick={handleStartTest}
            disabled={selectedVariant === null}
          >
            {selectedVariant ? `${t("test.variant")} ${selectedVariant} - ${t("test.start")}` : t("test.selectVariantFirst")}
          </Button>

          {/* Quick Stats - Mobile */}
          <div className="w-full grid grid-cols-3 gap-2">
            <Card className="p-2 text-center bg-card/50 backdrop-blur-sm border-border">
              <div className="text-lg font-bold text-primary">20</div>
              <div className="text-[10px] text-muted-foreground">{t("test.questions")}</div>
            </Card>
            <Card className="p-2 text-center bg-card/50 backdrop-blur-sm border-border">
              <div className="text-lg font-bold text-primary">30</div>
              <div className="text-[10px] text-muted-foreground">{t("test.minutes")}</div>
            </Card>
            <Card className="p-2 text-center bg-card/50 backdrop-blur-sm border-border">
              <div className="text-lg font-bold text-primary">80%</div>
              <div className="text-[10px] text-muted-foreground">{t("test.passingScore")}</div>
            </Card>
          </div>

          {/* Instructions - Mobile */}
          <Card className="w-full p-3 bg-card/50 backdrop-blur-sm border-border">
            <h3 className="text-xs font-semibold text-foreground mb-1">{t("test.instructions")}:</h3>
            <ul className="text-[10px] text-muted-foreground space-y-0.5">
              <li>• {t("test.instruction1")}</li>
              <li>• {t("test.instruction2")}</li>
              <li>• {t("test.instruction3")}</li>
            </ul>
          </Card>
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sidebar - Desktop */}
        <aside className="w-96 xl:w-[420px] bg-card border-r border-border p-8 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("app.title")}</h1>
              <p className="text-base text-muted-foreground mt-2">{t("app.subtitle")}</p>
            </div>
          </div>

          {/* Language Selection - Desktop */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-muted-foreground mb-4">{t("test.selectLanguage")}</h2>
            <div className="flex gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  variant={language === lang.id ? "default" : "outline"}
                  className={`flex-1 flex flex-col items-center gap-2 h-auto py-4 text-base ${
                    language === lang.id 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/10 hover:border-primary"
                  }`}
                  onClick={() => setLanguage(lang.id)}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Variant Selection - Desktop */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-muted-foreground mb-4">{t("test.selectVariant")}</h2>
            <div className="grid grid-cols-5 gap-2.5">
              {visibleVariants.map((v) => (
                <Button
                  key={v}
                  variant={selectedVariant === v ? "default" : "outline"}
                  className={`h-12 text-base font-medium ${
                    selectedVariant === v 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/10 hover:border-primary"
                  }`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
            {TOTAL_VARIANTS > 20 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-sm text-muted-foreground"
                onClick={() => setShowAllVariants(!showAllVariants)}
              >
                {showAllVariants ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1.5" />
                    {language === 'ru' ? 'Скрыть' : language === 'uz' ? 'Яшириш' : 'Yashirish'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1.5" />
                    {language === 'ru' ? `Показать все (${TOTAL_VARIANTS})` : language === 'uz' ? `Барчасини кўрсатиш (${TOTAL_VARIANTS})` : `Barchasini ko'rsatish (${TOTAL_VARIANTS})`}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Category Options - Desktop */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-muted-foreground mb-4">{t("test.selectCategory")}</h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant="outline"
                  className="flex flex-col items-center gap-3 h-auto py-5 hover:bg-primary/10 hover:border-primary"
                >
                  <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">{cat.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Instructions - Desktop */}
          <Card className="p-5 bg-muted/30 border-border mt-auto">
            <h3 className="text-base font-semibold text-foreground mb-3">{t("test.instructions")}:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {t("test.instruction1")}</li>
              <li>• {t("test.instruction2")}</li>
              <li>• {t("test.instruction3")}</li>
            </ul>
          </Card>
        </aside>

        {/* Main Content - Desktop */}
        <main className="flex-1 flex items-center justify-center p-12 bg-gradient-to-br from-background to-primary/5">
          <div className="max-w-lg w-full text-center">
            {/* Hero Section */}
            <div className="mb-10">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Car className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-3">{t("test.ready")}</h2>
              <p className="text-lg text-muted-foreground">{t("test.readyDescription")}</p>
            </div>

            {/* Stats Cards - Desktop */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <Card className="p-6 bg-card border-border">
                <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">20</div>
                <div className="text-sm text-muted-foreground">{t("test.questions")}</div>
              </Card>
              <Card className="p-6 bg-card border-border">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">30</div>
                <div className="text-sm text-muted-foreground">{t("test.minutes")}</div>
              </Card>
              <Card className="p-6 bg-card border-border">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">80%</div>
                <div className="text-sm text-muted-foreground">{t("test.passingScore")}</div>
              </Card>
            </div>

            {/* Selected Variant Display */}
            {selectedVariant && (
              <div className="mb-6 text-xl font-semibold text-primary">
                {t("test.selected")}: {t("test.variant")} {selectedVariant}
              </div>
            )}

            {/* Start Button - Desktop */}
            <Button
              size="lg"
              className="w-full h-16 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90"
              onClick={handleStartTest}
              disabled={selectedVariant === null}
            >
              {selectedVariant ? `${t("test.variant")} ${selectedVariant} - ${t("test.startTest")}` : t("test.selectVariantFirst")}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
