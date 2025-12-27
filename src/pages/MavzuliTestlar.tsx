import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { MavzuliTestInterface } from "@/components/MavzuliTestInterface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, LogIn, ChevronDown, ChevronUp, BookOpen, Play, Clock, CheckCircle, HelpCircle, Home } from "lucide-react";

const topics = [
  { id: '32', name: 'Yangi Savollar' },
  { id: '31', name: 'Barcha savollar' },
  { id: '1', name: "Umumiy qoidalar" },
  { id: '2', name: "Haydovchi va piyodalarning umumiy vazifalari" },
  { id: '3', name: "Ogohlantiruvchi belgilar" },
  { id: '4', name: "Imtiyoz belgilar" },
  { id: '5', name: "Taqiqlovchi belgilar" },
  { id: '6', name: "Buyuruvchi belgilar" },
  { id: '7', name: "Axborot ishora belgilari" },
  { id: '8', name: "Qo'shimcha axborot belgilari" },
  { id: '9', name: "Yotiq chiziqlar 1" },
  { id: '10', name: "Yotiq va tik chiziqlar 2" },
  { id: '11', name: "Svetafor ishoralari" },
  { id: '12', name: "Tartibga soluvchining ishoralari" },
  { id: '13', name: "Ogohlantiruvchi va avariya ishoralari" },
  { id: '14', name: "Harakatlanishni (Manyovir) boshlash" },
  { id: '15', name: "Yo'lning qatnov qismida transport vositalarining joylashuvi" },
  { id: '16', name: "Harakatlanish tezligi" },
  { id: '17', name: "Quvib o'tish" },
  { id: '18', name: "To'xtash va to'xtab turish qoidalari 1" },
  { id: '19', name: "To'xtash va to'xtab turish qoidalari 2" },
  { id: '34', name: "Teng ahamiyatli chorrahalar" },
  { id: '33', name: "Tartibga solinmagan chorrahada asosiy yo'l" },
  { id: '20', name: "Chorrahalarda harakatlanish" },
  { id: '21', name: "Piyodalar o'tish joylari va turar joy dahalarida harakatlanish" },
  { id: '22', name: "Temir yo'l kesishmalari va Avtomagistrallarda harakat" },
  { id: '23', name: "Yo'nalishli transport vositalarining imtiyozlari va tashqi yoritish" },
  { id: '24', name: "Transport vositalarini shatakka olish" },
  { id: '25', name: "Transport boshqarishni o'rganish va Yo'l harakati xavfsizligini ta'minlash" },
  { id: '26', name: "Odam va yuk tashish" },
  { id: '27', name: "Transport vositalarida harakatlanish taqiqlanadigan vaziyatlar" },
  { id: '28', name: "Harakat xavfsizligini ta'minlash 1" },
  { id: '29', name: "Harakat xavfsizligini ta'minlash 2" },
  { id: '30', name: "Birinchi tibbiy yordam" },
];

export default function MavzuliTestlar() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleStartTest = () => {
    if (selectedTopic !== null) {
      setTestStarted(true);
    }
  };

  const visibleTopics = showAllTopics ? topics : topics.slice(0, 15);

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

  if (testStarted && selectedTopic) {
    const topicName = topics.find(t => t.id === selectedTopic)?.name || '';
    return (
      <MavzuliTestInterface
        onExit={() => {
          setTestStarted(false);
          setSelectedTopic(null);
        }}
        topicId={selectedTopic}
        topicName={topicName}
      />
    );
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-primary/5">
        <div className="flex flex-col lg:flex-row min-h-full">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-96 bg-card border-b lg:border-b-0 lg:border-r border-border p-4 lg:p-6 flex flex-col">
            {/* Back to Home */}
            <Link to="/" className="mb-4">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Bosh sahifa
              </Button>
            </Link>

            {/* Profile Section */}
            <div className="mb-6 pb-6 border-b border-border">
              {user ? (
                <Button
                  variant="default"
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-3 h-auto py-3 px-4 bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-base">{profile?.full_name || profile?.username || 'Profil'}</div>
                  </div>
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => navigate('/auth')}
                  className="w-full flex items-center gap-3 h-auto py-3 px-4 bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-semibold">Kirish</span>
                </Button>
              )}
            </div>

            {/* Topic Selection */}
            <div className="mb-6 flex-1 overflow-y-auto">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Mavzuni tanlang
              </h2>
              <div className="space-y-2">
                {visibleTopics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant={selectedTopic === topic.id ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto py-3 px-4 ${
                      selectedTopic === topic.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-primary/10 hover:border-primary"
                    }`}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <span className="text-sm font-medium line-clamp-2">{topic.name}</span>
                  </Button>
                ))}
              </div>
              {topics.length > 15 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-xs text-muted-foreground"
                  onClick={() => setShowAllTopics(!showAllTopics)}
                >
                  {showAllTopics ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 mr-1" />
                      Yashirish
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5 mr-1" />
                      Barchasini ko'rsatish ({topics.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-background to-primary/5">
            <div className="w-full max-w-2xl text-center">
              <div className="flex flex-col items-center gap-4 mb-10">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Mavzuli Testlar
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Mavzu bo'yicha testlarni yechib, bilimingizni mustahkamlang
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 lg:gap-5 mb-8">
                <Card className="p-4 lg:p-5 bg-card border-border text-center">
                  <HelpCircle className="w-6 lg:w-8 h-6 lg:h-8 text-primary mx-auto mb-2 lg:mb-3" />
                  <div className="text-2xl lg:text-3xl font-bold text-foreground">{topics.length}</div>
                  <div className="text-xs lg:text-sm text-muted-foreground mt-1">Mavzular</div>
                </Card>
                <Card className="p-4 lg:p-5 bg-card border-border text-center">
                  <Clock className="w-6 lg:w-8 h-6 lg:h-8 text-primary mx-auto mb-2 lg:mb-3" />
                  <div className="text-2xl lg:text-3xl font-bold text-foreground">60</div>
                  <div className="text-xs lg:text-sm text-muted-foreground mt-1">daqiqa</div>
                </Card>
                <Card className="p-4 lg:p-5 bg-card border-border text-center">
                  <CheckCircle className="w-6 lg:w-8 h-6 lg:h-8 text-primary mx-auto mb-2 lg:mb-3" />
                  <div className="text-2xl lg:text-3xl font-bold text-foreground">80%</div>
                  <div className="text-xs lg:text-sm text-muted-foreground mt-1">O'tish balli</div>
                </Card>
              </div>

              {selectedTopic && (
                <div className="mb-5 p-4 bg-primary/10 rounded-xl">
                  <span className="text-lg font-semibold text-primary">
                    Tanlangan: {topics.find(t => t.id === selectedTopic)?.name}
                  </span>
                </div>
              )}

              <Button
                size="lg"
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-[hsl(var(--cta-green))] hover:bg-[hsl(var(--cta-green-hover))]"
                onClick={handleStartTest}
                disabled={selectedTopic === null}
              >
                <Play className="w-5 h-5 mr-2" />
                {selectedTopic ? "Testni boshlash" : "Mavzuni tanlang"}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
