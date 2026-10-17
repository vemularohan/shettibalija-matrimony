import { Link } from "@tanstack/react-router";
import {
  Bell,
  Camera,
  CreditCard,
  Heart,
  LayoutDashboard,
  Mail,
  Settings,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShettibalijaLogo } from "@/components/brand/logo";

export const MEMBER_NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", labelTe: "డ్యాష్‌బోర్డ్", icon: LayoutDashboard },
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
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3 px-2 pb-3.5 border-b border-[#D9A514]/20">
        <ShettibalijaLogo size="sm" linkToHome />
        <div className="min-w-0">
          <p className="font-serif text-sm font-bold text-[#21083F] dark:text-[#F4D477] truncate leading-tight tracking-wide">
            Shettibalija
          </p>
          <p className="text-[10px] text-[#087A32] font-semibold truncate">సభ్యుల పోర్టల్</p>
        </div>
      </div>
      <nav className="grid gap-1" aria-label="Member Navigation">
        {MEMBER_NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-foreground/80 hover:bg-[#351064]/5 hover:text-[#21083F] transition-all duration-200"
            activeProps={{
              className:
                "bg-gradient-to-r from-[#21083F] to-[#351064] text-white shadow-sm font-semibold !text-white",
            }}
          >
            <item.icon className="h-4 w-4 shrink-0 text-[#D9A514] group-hover:scale-110 transition-transform" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
