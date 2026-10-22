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
  Search,
  Sparkles,
  Eye,
  Bookmark,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShettibalijaLogo } from "@/components/brand/logo";

export const MEMBER_NAV_ITEMS = [
  { to: "/dashboard", label: "My Home", labelTe: "నా హోమ్", icon: LayoutDashboard },
  { to: "/search", label: "Search", labelTe: "శోధన", icon: Search },
  { to: "/dashboard/matches", label: "My Matches", labelTe: "నా మ్యాచ్‌లు", icon: Sparkles },
  { to: "/dashboard/interests", label: "Interests", labelTe: "ఆసక్తులు", icon: Mail },
  { to: "/dashboard/shortlist", label: "Shortlisted", labelTe: "షార్ట్‌లిస్ట్", icon: Heart },
  { to: "/dashboard/contacts", label: "Messages & Connections", labelTe: "సందేశాలు", icon: Users },
  {
    to: "/dashboard/profile-views",
    label: "Viewed Profiles",
    labelTe: "ప్రొఫైల్ వీక్షణలు",
    icon: Eye,
  },
  {
    to: "/dashboard/saved-searches",
    label: "Saved Searches",
    labelTe: "సేవ్ చేసిన శోధనలు",
    icon: Bookmark,
  },
  { to: "/dashboard/profile", label: "My Profile", labelTe: "నా ప్రొఫైల్", icon: UserRound },
  {
    to: "/dashboard/preferences",
    label: "Partner Preferences",
    labelTe: "భాగస్వామి అభిరుచులు",
    icon: HeartHandshake,
  },
  { to: "/dashboard/photos", label: "My Photos", labelTe: "నా ఫోటోలు", icon: Camera },
  { to: "/dashboard/notifications", label: "Notifications", labelTe: "నోటిఫికేషన్లు", icon: Bell },
  { to: "/dashboard/payments", label: "Payment History", labelTe: "చెల్లింపులు", icon: CreditCard },
  { to: "/dashboard/privacy", label: "Privacy Settings", labelTe: "గోప్యత", icon: Shield },
  { to: "/dashboard/settings", label: "Settings", labelTe: "సెట్టింగ్స్", icon: Settings },
] as const;

export function MemberSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3 border-b border-[#C9A227]/45 px-2 pb-4">
        <ShettibalijaLogo size="sm" theme="dark" linkToHome />
        <div className="min-w-0">
          <p className="truncate font-serif text-sm font-semibold leading-tight tracking-wide text-[#F7F3EA]">
            Shettibalija
          </p>
          <p lang="te" className="truncate text-[10px] font-medium text-[#D7CDB9]">
            సభ్యుల పోర్టల్
          </p>
        </div>
      </div>
      <nav className="grid gap-1 pt-2" aria-label="Member Navigation">
        {MEMBER_NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center gap-2.5 border-l-2 border-transparent px-3 py-2.5 text-xs font-medium text-[#D7CDB9] transition-colors hover:border-[#C9A227] hover:bg-white/5 hover:text-white sm:text-sm"
            activeProps={{
              className: "!border-[#C9A227] !bg-white/10 !text-white font-semibold",
            }}
          >
            <item.icon className="h-4 w-4 shrink-0 text-[#C9A227]" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
