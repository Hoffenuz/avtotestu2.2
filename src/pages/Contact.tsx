import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageCircle,
  ChevronDown,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  function formatPhone(v: string) {
    setPhone(v.replace(/\D/g, "").substring(0, 9));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name || !phone) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name,
          phone: phone ? `+998${phone}` : null,
          subject: "Aloqa formasi",
          message,
          user_id: user?.id || null
        });

      if (error) throw error;
      
      toast({
        title: "Yuborildi!",
        description: "Xabaringiz muvaffaqiyatli yuborildi. Tez orada javob beramiz.",
      });
      
      setName("");
      setPhone("");
      
      setMessage("");
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Xatolik",
        description: "Xabarni yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const contactInfo = [
    {
      icon: MessageCircle,
      label: "Telegram",
      value: "@avtotestu_ad",
      href: "https://t.me/avtotestu_ad",
    },
    {
      icon: MessageCircle,
      label: "Bot",
      value: "@Avtotesturganchbot",
      href: "https://t.me/Avtotesturganchbot",
    },
    {
      icon: MessageCircle,
      label: "Bot",
      value: "@maktabavtobot",
      href: "https://t.me/maktabavtobot",
    },
    {
      icon: Clock,
      label: "Ish vaqti",
      value: "Dush - Shan: 09:00 - 18:00",
    },
  ];

  return (
    <MainLayout>
      <SEOHead
        title="Aloqa"
        description="AvtoTest bilan bog'laning. Telegram orqali yoki veb-sayt orqali xabar yuboring. Haydovchilik imtihoni haqida savollar."
        keywords="aloqa, bog'lanish, telegram, avtotest kontakt, haydovchilik savol"
        canonicalUrl="/contact"
      />
      {/* Full Screen Contact Section */}
      <section className="bg-background">
        {/* Header with title */}
        <div className="w-full px-6 md:px-12 lg:px-16 pt-4 md:pt-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Aloqa
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Biz bilan bog'laning — savollaringizga javob beramiz
          </p>
        </div>

        {/* Main Content - Two columns spread across screen */}
        <div className="w-full px-6 md:px-12 lg:px-16 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Left Column: Contact Info */}
            <div className="flex flex-col">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Bizning Ma'lumotlar</h2>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          {item.href ? (
                            <a 
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="font-medium text-foreground">{item.value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Terms Section */}
              <div className="mt-4">
                <button
                  onClick={() => setShowTerms(!showTerms)}
                  className="w-full p-4 flex items-center justify-between text-left bg-card hover:bg-secondary/50 transition-colors rounded-lg border border-border"
                >
                  <span className="font-semibold text-foreground">
                    Platforma bilan bog'lanish shartlari
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                      showTerms ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ${
                    showTerms ? "max-h-[1000px] mt-4" : "max-h-0"
                  }`}
                >
                  <div className="p-4 space-y-3 text-muted-foreground text-sm leading-relaxed bg-card rounded-lg border border-border">
                    <p>
                      Aloqa bo'limi orqali yuboradigan barcha ma'lumotlar va xabarlaringiz platforma ma'murlari tomonidan maxfiy tarzda ko'rib chiqiladi.
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><strong>Xabar yuborish:</strong> Aloqa formasi orqali yuborilgan har bir xabar platforma ma'muriyatiga yetib boradi.</li>
                      <li><strong>Rasmiy va to'g'ri ma'lumot:</strong> Iltimos, ismingiz, telefon raqamingiz va xabar matnini aniq ko'rsating.</li>
                      <li><strong>Maxfiylik:</strong> Platformaga yuborilgan ma'lumotlaringiz uchinchi shaxslarga oshkor qilinmaydi.</li>
                      <li><strong>Bog'lanish muddati:</strong> Administratorlar so'rovingizni imkon qadar tezroq ko'rib chiqadi.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-foreground mb-4">Xabar Yozing</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ismingiz *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="To'liq ismingiz"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon raqam *</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-secondary text-muted-foreground border border-r-0 border-input rounded-l-md text-sm">
                      +998
                    </span>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => formatPhone(e.target.value)}
                      placeholder="90 123 45 67"
                      maxLength={9}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="message">Xabar</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Xabaringizni yozing..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Yuborish
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
