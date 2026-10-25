import { Link } from "@tanstack/react-router";
import { Compass, Heart, LayoutDashboard, Search, UserRound, Crown, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";

export function MobileBottomNav() {
  const { user, loading } = useAuth();
  const { lang } = useLanguage();
  if (loading) return null;

  const links = user
    ? [
        { to: "/dashboard", label: lang === "te" ? "నా స్థలం" : "My space", icon: LayoutDashboard },
        { to: "/search", label: lang === "te" ? "కనుగొనండి" : "Discover", icon: Search },
        { to: "/dashboard/matches", label: lang === "te" ? "మ్యాచ్‌లు" : "Matches", icon: Compass },
        { to: "/dashboard/interests", label: lang === "te" ? "ఆసక్తులు" : "Interests", icon: Mail },
        {
          to: "/dashboard/profile",
          label: lang === "te" ? "ప్రొఫైల్" : "Profile",
          icon: UserRound,
        },
      ]
    : [
        { to: "/", label: lang === "te" ? "హోమ్" : "Home", icon: LayoutDashboard },
        { to: "/membership", label: lang === "te" ? "ప్రణాళికలు" : "Plans", icon: Crown },
        {
          to: "/register",
          label: lang === "te" ? "ప్రారంభించండి" : "Start",
          icon: Heart,
          featured: true,
        },
        { to: "/success-stories", label: lang === "te" ? "కథలు" : "Stories", icon: Compass },
        { to: "/login", label: lang === "te" ? "లాగిన్" : "Sign in", icon: UserRound },
      ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {links.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`mobile-bottom-nav-link ${item.featured ? "is-featured" : ""}`}
          activeProps={{
            className: `mobile-bottom-nav-link is-active ${item.featured ? "is-featured" : ""}`,
          }}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
