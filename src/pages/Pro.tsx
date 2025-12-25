import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Clock, 
  BookOpen, 
  Award,
  Sparkles
} from "lucide-react";

const features = [
  { icon: Zap, text: "Barcha mavzularga kirish" },
  { icon: BookOpen, text: "55+ variant testlar" },
  { icon: Clock, text: "Cheksiz vaqt" },
  { icon: Shield, text: "Batafsil izohlar" },
  { icon: Award, text: "Sertifikat olish" },
  { icon: Star, text: "Prioritet qo'llab-quvvatlash" },
];

const plans = [
  {
    name: "Bepul",
    price: "0",
    period: "",
    description: "Boshlang'ich foydalanuvchilar uchun",
    features: [
      "10 ta variant",
      "Asosiy mavzular",
      "Reklama bilan",
      "Kunlik limit: 5 test",
    ],
    highlighted: false,
    buttonText: "Hozirgi reja",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "29,000",
    period: "so'm/oy",
    description: "Jadal o'rganuvchilar uchun",
    features: [
      "Barcha 55+ variant",
      "Barcha mavzular",
      "Reklama yo'q",
      "Cheksiz testlar",
      "Batafsil izohlar",
      "Statistika",
    ],
    highlighted: true,
    buttonText: "Pro olish",
    buttonVariant: "default" as const,
  },
  {
    name: "Pro Yillik",
    price: "249,000",
    period: "so'm/yil",
    description: "30% chegirma bilan",
    features: [
      "Barcha Pro imkoniyatlar",
      "1 yil muddatga",
      "Prioritet qo'llab-quvvatlash",
      "Sertifikat",
      "Yangilanishlar",
    ],
    highlighted: false,
    buttonText: "Yillik olish",
    buttonVariant: "outline" as const,
  },
];

export default function Pro() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetPro = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Open Telegram for payment
    window.open('https://t.me/avtotestu_ad', '_blank');
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-primary-light" />
        <div className="absolute inset-0 hero-pattern" />
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-[hsl(var(--cta-orange))]" />
            <span className="text-primary-foreground font-medium">Premium imkoniyatlar</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Pro bilan <span className="text-[hsl(var(--cta-orange))]">muvaffaqiyatga</span> erishing!
          </h1>
          
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Barcha testlar, mavzular va qo'shimcha imkoniyatlardan foydalaning. 
            Haydovchilik guvohnomasini tezroq oling!
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4"
                >
                  <Icon className="w-6 h-6 text-[hsl(var(--cta-green))]" />
                  <span className="text-primary-foreground text-sm font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              O'zingizga mos rejani tanlang
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Har qanday darajadagi foydalanuvchilar uchun mos variantlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.highlighted 
                    ? "border-2 border-[hsl(var(--cta-green))] shadow-lg scale-105" 
                    : "border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-[hsl(var(--cta-green))] text-white text-center py-1 text-sm font-medium">
                    <Crown className="w-4 h-4 inline mr-1" />
                    Eng mashhur
                  </div>
                )}
                <CardHeader className={plan.highlighted ? "pt-10" : ""}>
                  <CardTitle className="text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <Check className={`w-5 h-5 ${plan.highlighted ? "text-[hsl(var(--cta-green))]" : "text-primary"}`} />
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.highlighted 
                        ? "bg-[hsl(var(--cta-green))] hover:bg-[hsl(var(--cta-green-hover))]" 
                        : ""
                    }`}
                    variant={plan.buttonVariant}
                    onClick={plan.highlighted ? handleGetPro : undefined}
                    disabled={!plan.highlighted && plan.price === "0"}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="border-none shadow-xl bg-card p-8 md:p-12">
            <Crown className="w-16 h-16 text-[hsl(var(--cta-orange))] mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Savol-javob
            </h2>
            <p className="text-muted-foreground mb-6">
              Pro obuna haqida savollaringiz bormi? Telegram orqali bog'laning!
            </p>
            <Button 
              size="lg"
              className="bg-[hsl(var(--cta-blue))] hover:bg-[hsl(var(--cta-blue-hover))]"
              onClick={() => window.open('https://t.me/avtotestu_ad', '_blank')}
            >
              Telegram orqali bog'lanish
            </Button>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
