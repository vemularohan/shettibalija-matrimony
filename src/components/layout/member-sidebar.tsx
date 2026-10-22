import { Link } from "@tanstack/react-router";
import {
  Bell,
  Camera,
  CreditCard,
  Heart,
  HeartHandshake,
  LayoutDashboard,
  Mail,
  Settings,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";

export const MEMBER_NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", labelTe: "డ్యాష్‌బోర్డ్", icon: LayoutDashboard },
  { to: "/dashboard/matches", label: "Matches", labelTe: "మ్యాచ్‌లు", icon: HeartHandshake },
  { to: "/dashboard/profile", label: "My Profile", labelTe: "నా ప్రొఫైల్", icon: UserRound },
  { to: "/dashboard/photos", label: "My Photos", labelTe: "నా ఫోటోలు", icon: Camera },
  { to: "/dashboard/interests", label: "Interests", labelTe: "ఆసక్తులు", icon: Mail },
  { to: "/dashboard/shortlist", label: "Shortlisted", labelTe: "షార్ట్‌లిస్ట్", icon: Heart },
  { to: "/dashboard/contacts", label: "Contact Requests", labelTe: "సంప్రదింపులు", icon: Users },
  { to: "/dashboard/notifications", label: "Notifications", labelTe: "నోటిఫికేషన్లు", icon: Bell },
  { to: "/dashboard/payments", label: "Payment History", labelTe: "చెల్లింపులు", icon: CreditCard },
  { to: "/dashboard/privacy", label: "Privacy Settings", labelTe: "గోప్యత", icon: Shield },
  { to: "/dashboard/settings", label: "Settings", labelTe: "సెట్టింగ్స్", icon: Settings },
] as const;

export function MemberSidebar({ className }: { className?: string }) {
  const { lang } = useLanguage();

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3 border-b border-[#ded5c8] px-2 pb-4">
        <ShettibalijaLogo size="sm" linkToHome />
        <div className="min-w-0">
          <p className="truncate font-serif text-sm font-semibold leading-tight text-[#24103F]">
            Shettibalija
          </p>
          <p className="sbm-telugu truncate text-[10px] text-[#087333]">సభ్యుల పోర్టల్</p>
        </div>
      </div>
      <nav className="grid gap-0.5" aria-label="Member navigation">
        {MEMBER_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="group flex items-center gap-2.5 border-l-2 border-transparent px-3 py-2.5 text-[12px] font-medium text-[#5f5765] transition-colors hover:bg-[#f1ece4] hover:text-[#24103F]"
              activeProps={{
                className:
                  "border-l-[#D1A329] bg-[#f1ece4] font-semibold text-[#24103F] hover:bg-[#f1ece4]",
              }}
            >
              <Icon className="h-4 w-4 shrink-0 text-[#a98a37] group-hover:text-[#D1A329]" />
              <span className="truncate">{lang === "te" ? item.labelTe : item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
