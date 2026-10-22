import { Link } from "@tanstack/react-router";
import { ArrowUpRight, HeartHandshake, ShieldCheck } from "lucide-react";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { SITE_NAME } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";

const FOOTER_GROUPS = [
  {
    title: "Discover",
    links: [
      ["How it works", "/#how-it-works"],
      ["Membership", "/membership"],
      ["Family stories", "/success-stories"],
      ["About us", "/about"],
    ],
  },
  {
    title: "Member space",
    links: [
      ["Search profiles", "/search"],
      ["My matches", "/dashboard/matches"],
      ["Interests", "/dashboard/interests"],
      ["Account settings", "/dashboard/settings"],
    ],
  },
  {
    title: "Information",
    links: [
      ["Help centre", "/help"],
      ["Contact support", "/contact"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function SiteFooter() {
  const { lang } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="public-shell">
        <section className="site-footer-invitation">
          <div>
            <p className="site-kicker">{lang === "te" ? "మీ ప్రయాణాన్ని ప్రారంభించండి" : "Begin with intention"}</p>
            <h2>{lang === "te" ? "మీ కుటుంబానికి సరైన పరిచయం ఇక్కడి నుంచే ప్రారంభమవుతుంది." : "A respectful introduction can begin here."}</h2>
          </div>
          <Link to="/register" className="site-footer-cta">{lang === "te" ? "ప్రొఫైల్ సృష్టించండి" : "Create a profile"}<ArrowUpRight className="h-4 w-4" /></Link>
        </section>

        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link to="/" className="site-brand">
              <span className="site-brand-mark"><ShettibalijaLogo size="sm" /></span>
              <span className="site-brand-copy"><strong>{SITE_NAME}</strong><small lang="te">శెట్టిబలిజ సంఘం</small></span>
            </Link>
            <p>{lang === "te" ? "కుటుంబాల గౌరవం, గోప్యత మరియు సమ్మతితో నిర్మించిన వివాహ పరిచయ వేదిక." : "A matrimonial space built around family context, privacy and mutual consent."}</p>
            <div className="site-footer-principles">
              <span><ShieldCheck className="h-4 w-4" />Profile review before discovery</span>
              <span><HeartHandshake className="h-4 w-4" />Contact details by consent</span>
            </div>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title} className="site-footer-links">
              <h3>{group.title}</h3>
              <ul>{group.links.map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul>
            </div>
          ))}
        </div>

        <div className="site-footer-base">
          <p>© {new Date().getFullYear()} {SITE_NAME}</p>
          <p>{lang === "te" ? "కుటుంబాలకు గౌరవప్రదమైన స్థలం" : "A considered space for families"}</p>
        </div>
      </div>
    </footer>
  );
}
