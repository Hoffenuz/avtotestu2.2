import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowLeft, Play, Clock } from "lucide-react";

export default function Darslik() {
  return (
    <MainLayout>
      <SEOHead
        title="Darsliklar"
        description="Yo'l harakati qoidalari bo'yicha video darsliklar va qo'llanmalar. Haydovchilik imtihoniga tayyorlanish uchun o'quv materiallari."
        keywords="YHQ darslik, haydovchilik darslari, yo'l harakati qoidalari o'rganish, avtomaktab darslari"
        canonicalUrl="/darslik"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-hover to-primary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Darslik
          </h1>
          <p className="text-lg text-primary-foreground/90 inline-block bg-primary-foreground/10 px-6 py-3 rounded-full backdrop-blur-sm">
            Yo'l harakati qoidalari bo'yicha darsliklar
          </p>
        </div>
      </section>

      {/* Maintenance Section */}
      <section className="py-20 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-none shadow-xl text-center overflow-hidden">
            <CardContent className="pt-12 pb-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-warning/10 rounded-full flex items-center justify-center">
                <Wrench className="w-12 h-12 text-warning animate-pulse" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Yangilash ishlari olib borilmoqda
              </h2>
              
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Tez orada sizga yangi darsliklar taqdim etamiz. Sabr qiling! 
                Hozircha test ishlash orqali o'z bilimlaringizni sinab ko'ring.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Bosh sahifaga qaytish
                  </Button>
                </Link>
                <Link to="/variant">
                  <Button className="gap-2">
                    <Play className="w-4 h-4" />
                    Test ishlash
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Video darsliklar</h3>
                <p className="text-sm text-muted-foreground">Tez orada</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Qo'llanmalar</h3>
                <p className="text-sm text-muted-foreground">Tez orada</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
