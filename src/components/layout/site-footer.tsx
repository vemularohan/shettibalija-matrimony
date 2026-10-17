import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useLanguage();

  const exploreLinks = [
    { to: "/search", label: lang === "te" ? "మ్యాచ్‌ల శోధన" : "Find Matches" },
    { to: "/#how-it-works", label: lang === "te" ? "ఎలా పనిచేస్తుంది" : "How It Works" },
    { to: "/membership", label: lang === "te" ? "సభ్యత్వ ప్రణాళికలు" : "Membership Plans" },
    { to: "/about", label: lang === "te" ? "మా గురించి" : "About Sangham" },
    { to: "/contact", label: lang === "te" ? "సంప్రదించండి" : "Contact & Support" },
  ];

  const policyLinks = [
    { to: "/terms", label: lang === "te" ? "నిబంధనలు" : "Terms & Conditions" },
    { to: "/privacy", label: lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy" },
    { to: "/refund", label: lang === "te" ? "రీఫండ్ విధానం" : "Refund Policy" },
  ];

  return (
    <footer className="bg-[#1C0A30] text-white border-t border-white/10">
      {/* Single thin gold line at top */}
      <div className="h-px bg-[#D1A329]/60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand column */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <ShettibalijaLogo size="md" linkToHome theme="dark" />
              <div>
                <h3 className="font-sans text-sm font-semibold text-white">{SITE_NAME}</h3>
                <p className="text-[11px] text-[#D1A329] font-medium">{SITE_NAME_TE}</p>
              </div>
            </div>

            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              {lang === "te"
                ? "ఆంధ్రప్రదేశ్, తెలంగాణ మరియు ప్రపంచవ్యాప్తంగా ఉన్న శెట్టిబలిజ కుటుంబాల కోసం విశ్వసనీయ వివాహ వేదిక."
                : "A bespoke matrimonial platform for Shettibalija families across Andhra Pradesh, Telangana and worldwide."}
            </p>

            <div className="pt-1">
              <LanguageSwitcher theme="dark" size="sm" />
            </div>
          </div>

          {/* Explore links */}
          <div className="md:col-span-3 space-y-4">
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/40">
              {lang === "te" ? "అన్వేషించు" : "Explore"}
            </p>
            <ul className="space-y-2.5">
              {exploreLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy links */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/40">
              {lang === "te" ? "విధానాలు" : "Legal"}
            </p>
            <ul className="space-y-2.5">
              {policyLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 space-y-4">
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/40">
              {lang === "te" ? "సంప్రదింపు" : "Contact"}
            </p>
            <div className="space-y-2 text-sm text-white/55">
              <p>Telangana &amp; Andhra Pradesh, India</p>
              <p>support@shettibalijamatrimony.com</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/35">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 fill-[#087333] text-[#087333]" />
            <span>for the Shettibalija Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
