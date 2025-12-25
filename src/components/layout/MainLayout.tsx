import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home, Phone, BookOpen, Car, FileText, MapPin, Info } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: "/", label: "Bosh sahifa", icon: Home },
  { path: "/belgilar", label: "Yo'l belgilari", icon: Car },
  { path: "/variant", label: "Variantlar", icon: FileText },
  { path: "/darslik", label: "Darslik", icon: BookOpen },
  { path: "/qoshimcha", label: "Qo'shimcha", icon: Info },
  { path: "/contact", label: "Aloqa", icon: Phone },
];

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary-hover shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground rounded-xl flex items-center justify-center shadow-md">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <span className="text-primary-foreground font-bold text-xl hidden sm:block">
                AvtoTest
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href="https://maps.app.goo.gl/3vy3i4WX77W7WvLj7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all duration-200 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Xarita
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary/95 backdrop-blur-lg border-t border-primary-foreground/10">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <a
                href="https://maps.app.goo.gl/3vy3i4WX77W7WvLj7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all duration-200"
              >
                <MapPin className="w-5 h-5" />
                Xarita
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-foreground to-foreground/90 text-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">AvtoTest</span>
              </div>
              <p className="text-background/70 text-sm leading-relaxed">
                Professional haydovchilik guvohnomasini olish uchun zamonaviy onlayn platforma. 
                Yo'l harakati qoidalari bo'yicha test savollari.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Tezkor havolalar</h3>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Bog'lanish</h3>
              <div className="space-y-2 text-sm text-background/70">
                <p>Telegram: @avtotestu_ad</p>
                <p>Bot: @Avtotesturganchbot</p>
                <p>Ish vaqti: Dush - Shan: 09:00 - 18:00</p>
              </div>
            </div>
          </div>

          <div className="border-t border-background/10 mt-8 pt-8 text-center text-background/50 text-sm">
            © 2025 AvtoTest. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
}
