import { Link } from "@tanstack/react-router";
import { Heart, ShieldCheck } from "lucide-react";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useLanguage();

  const matrimonyLinks = [
    { to: "/search", label: lang === "te" ? "ప్రొఫైల్స్ శోధన" : "Search Profiles" },
    { to: "/register", label: lang === "te" ? "ఉచిత రిజిస్ట్రేషన్" : "Register Free" },
    { to: "/dashboard", label: lang === "te" ? "నా మ్యాచ్‌లు" : "My Matches" },
    { to: "/membership", label: lang === "te" ? "సభ్యత్వ ప్రణాళికలు" : "Membership" },
    { to: "/#success-stories", label: lang === "te" ? "విజయ గాథలు" : "Success Stories" },
  ];

  const communityLinks = [
    { to: "/about", label: lang === "te" ? "శెట్టిబలిజ సంఘం" : "Shettibalija Sangham" },
    { to: "/about", label: lang === "te" ? "సమాజం గురించి" : "About the Community" },
    { to: "/about", label: lang === "te" ? "సాంస్కృతిక సమాచారం" : "Community Information" },
  ];

  const helpLinks = [
    { to: "/#faq", label: lang === "te" ? "తరచూ అడిగే ప్రశ్నలు (FAQ)" : "FAQs" },
    { to: "/contact", label: lang === "te" ? "సంప్రదించండి" : "Contact" },
    { to: "/contact", label: lang === "te" ? "సహాయం & మద్దతు" : "Support" },
    { to: "/contact", label: lang === "te" ? "ప్రొఫైల్ రిపోర్ట్" : "Report Profile" },
  ];

  const legalLinks = [
    { to: "/privacy", label: lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy" },
    { to: "/terms", label: lang === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions" },
    { to: "/refund", label: lang === "te" ? "రీఫండ్ విధానం" : "Refund Policy" },
  ];

  return (
    <footer className="bg-[#1C0A30] text-white border-t border-white/10">
      {/* Top muted gold decorative bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D1A329]/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Column 1: Brand & Language */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <ShettibalijaLogo size="sm" linkToHome theme="dark" />
              <div>
                <h3 className="font-sans text-sm font-semibold text-white tracking-tight">{SITE_NAME}</h3>
                <p className="text-[10px] text-[#D1A329] font-medium">{SITE_NAME_TE}</p>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              {lang === "te"
                ? "శెట్టిబలిజ కుటుంబాల కోసం ప్రత్యేకంగా రూపొందించబడిన విశ్వసనీయ వివాహ వేదిక."
                : "A trusted matrimonial platform created for the Shettibalija community. Rooted in shared values and family trust."}
            </p>

            <div className="pt-2">
              <p className="text-[10px] uppercase font-semibold text-white/40 mb-1 tracking-wider">
                {lang === "te" ? "భాష" : "Language"}
              </p>
              <LanguageSwitcher theme="dark" size="sm" />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#087333] pt-1">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#087333]" />
              <span className="font-medium text-white/80">
                {lang === "te" ? "ధృవీకరించబడిన కమ్యూనిటీ పోర్టల్" : "Verified Community Platform"}
              </span>
            </div>
          </div>

          {/* Column 2: Matrimony */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D1A329]">
              {lang === "te" ? "మ్యాట్రిమోనీ" : "Matrimony"}
            </p>
            <ul className="space-y-2 text-xs">
              {matrimonyLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white/65 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D1A329]">
              {lang === "te" ? "కమ్యూనిటీ" : "Community"}
            </p>
            <ul className="space-y-2 text-xs">
              {communityLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white/65 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Help */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D1A329]">
              {lang === "te" ? "సహాయం" : "Help"}
            </p>
            <ul className="space-y-2 text-xs">
              {helpLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white/65 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-[11px] text-white/50">
              <p>support@shettibalijamatrimony.com</p>
              <p>Andhra Pradesh &amp; Telangana</p>
            </div>
          </div>

          {/* Column 5: Legal */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D1A329]">
              {lang === "te" ? "చట్టపరమైన" : "Legal"}
            </p>
            <ul className="space-y-2 text-xs">
              {legalLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white/65 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
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
