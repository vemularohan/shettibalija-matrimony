import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useLanguage();

  const matrimonyLinks = [
    { to: "/search", label: lang === "te" ? "ప్రొఫైల్స్ అన్వేషణ" : "Discover profiles" },
    { to: "/register", label: lang === "te" ? "ప్రొఫైల్ సృష్టించండి" : "Create a profile" },
    { to: "/dashboard", label: lang === "te" ? "నా డ్యాష్‌బోర్డ్" : "My dashboard" },
    { to: "/membership", label: lang === "te" ? "సభ్యత్వం" : "Membership" },
  ];

  const communityLinks = [
    { to: "/about", label: lang === "te" ? "శెట్టిబలిజ సంఘం" : "Shettibalija Sangham" },
    { to: "/success-stories", label: lang === "te" ? "కుటుంబ కథలు" : "Family stories" },
    { to: "/help", label: lang === "te" ? "సహాయ కేంద్రం" : "Help centre" },
  ];

  const legalLinks = [
    { to: "/privacy", label: lang === "te" ? "గోప్యతా విధానం" : "Privacy" },
    { to: "/terms", label: lang === "te" ? "నిబంధనలు" : "Terms" },
    { to: "/refund", label: lang === "te" ? "రీఫండ్ విధానం" : "Refunds" },
    { to: "/contact", label: lang === "te" ? "సంప్రదించండి" : "Contact" },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#1b0a30] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-[#D1A329]/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <ShettibalijaLogo size="sm" linkToHome theme="dark" />
              <div>
                <p className="text-sm font-bold tracking-tight">{SITE_NAME}</p>
                <p className="sbm-telugu mt-0.5 text-[10px] text-[#D1A329]">{SITE_NAME_TE}</p>
              </div>
            </div>
            <p className="mt-5 text-[13px] leading-7 text-white/65">
              {lang === "te"
                ? "శెట్టిబలిజ కుటుంబాల కోసం ఒక ప్రశాంతమైన, గోప్యతా కేంద్రిత వివాహ వేదిక. మన విలువలు, మన బంధాలు."
                : "A calm, privacy-first matrimonial space for Shettibalija families. Built around shared roots, family involvement and considered introductions."}
            </p>
            <div className="mt-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                {lang === "te" ? "భాష" : "Language"}
              </p>
              <LanguageSwitcher theme="dark" size="sm" />
            </div>
          </div>

          <FooterColumn title={lang === "te" ? "మ్యాట్రిమోనీ" : "Matrimony"} links={matrimonyLinks} />
          <FooterColumn title={lang === "te" ? "సమాజం" : "Community"} links={communityLinks} />
          <FooterColumn title={lang === "te" ? "చట్టపరమైనవి" : "Legal"} links={legalLinks} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/45 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. {lang === "te" ? "అన్ని హక్కులు రక్షించబడ్డాయి." : "All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="mailto:support@shettibalijamatrimony.org"
              className="transition-colors hover:text-white"
            >
              support@shettibalijamatrimony.org
            </a>
            <a
              href="https://commons.wikimedia.org/wiki/File:Rituals_Hindu_wedding_Telangana_south_India_culture.jpg"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              {lang === "te" ? "ఫోటో: Dinesh Cyanam / CC BY-SA 2.0" : "Photography: Dinesh Cyanam / CC BY-SA 2.0"}
            </a>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="flex items-center gap-1.5">
              {lang === "te" ? "శెట్టిబలిజ సమాజం కోసం" : "For the Shettibalija community"}
              <Heart className="h-3 w-3 fill-[#D1A329] text-[#D1A329]" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D1A329]">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map(({ to, label }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-[13px] text-white/70 transition-colors hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
