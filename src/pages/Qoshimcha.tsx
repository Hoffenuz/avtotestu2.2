import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Target, 
  Eye,
  Lightbulb,
  FileText,
  HelpCircle,
  Award
} from "lucide-react";

const cards = [
  {
    icon: FileText,
    title: "Test tuzilishi",
    description: "Test savollari mavzular bo'yicha guruhlangan: belgilar, qoidalar, harakatlanish holatlari va birinchi yordamga oid savollar. Har bir savol bitta to'g'ri javobga ega.",
    color: "bg-blue-500",
  },
  {
    icon: Target,
    title: "O'rganish strategiyalari",
    description: "Belgilarni vizual tarzda yodlash, testlarni mashaqqat bilan yechish va noto'g'ri javoblarni alohida qayta ko'rib chiqish muvaffaqiyatni oshiradi.",
    color: "bg-green-500",
  },
  {
    icon: Lightbulb,
    title: "Amaliy mashqlar",
    description: "20 va 50 savollik mashqlar mavjud — boshlanish uchun 20 savol rejimidan boshlash tavsiya etiladi. Har bir mashq sizga xatolaringizni ko'rsatadi.",
    color: "bg-purple-500",
  },
  {
    icon: Eye,
    title: "Resurslar",
    description: "Grafik materiallar, rasmlar va video qo'llanmalar yordamida murakkab vaziyatlarni osonroq tushunishingiz mumkin.",
    color: "bg-orange-500",
  },
];

const tips = [
  { icon: CheckCircle, text: "Kuzatuvchi belgilarni diqqat bilan o'qing." },
  { icon: Clock, text: "Har bir savolga 30-45 soniya ajrating." },
  { icon: HelpCircle, text: "Amaliy savollarni qayta ko'rib, xatolarni tahlil qiling." },
  { icon: Award, text: "Har kuni kamida 2 ta test yechishga harakat qiling." },
  { icon: Target, text: "Xato javoblaringizni alohida yozib boring." },
  { icon: BookOpen, text: "YHQ kitobini test bilan birga o'qing." },
];

export default function Qoshimcha() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-hover to-primary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Qo'shimcha ma'lumotlar
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Testga tayyorlanish bo'yicha batafsil yo'riqnoma, amaliy maslahatlar va qo'llanmalar
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/darslik">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2">
                <BookOpen className="w-5 h-5" />
                Darslik
              </Button>
            </Link>
            <Link to="/variant">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2">
                <Play className="w-5 h-5" />
                Testlarni boshlash
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-8 pb-6">
                    <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-3">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tez maslahatlar
            </h2>
            <p className="text-muted-foreground">
              Imtihonga tayyorlanish uchun foydali ko'rsatmalar
            </p>
          </div>

          <Card className="border-none shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-foreground pt-2">{tip.text}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="border-none shadow-xl bg-gradient-to-r from-primary/5 to-success/5">
            <CardContent className="py-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Tayyormisiz?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                O'rgangan bilimlaringizni sinab ko'ring va imtihonga tayyorligingizni tekshiring!
              </p>
              <Link to="/variant">
                <Button size="lg" className="gap-2 px-8">
                  <Play className="w-5 h-5" />
                  Test ishlashni boshlash
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
