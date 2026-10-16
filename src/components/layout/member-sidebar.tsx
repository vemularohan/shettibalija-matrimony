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

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/profile", label: "My Profile", icon: UserRound },
  { to: "/dashboard/photos", label: "My Photos", icon: Camera },
  { to: "/dashboard/interests", label: "Interests", icon: Mail },
  { to: "/dashboard/shortlist", label: "Shortlisted", icon: Heart },
  { to: "/dashboard/contacts", label: "Contact Requests", icon: Users },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/payments", label: "Payment History", icon: CreditCard },
  { to: "/dashboard/privacy", label: "Privacy Settings", icon: Shield },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function MemberSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2.5 px-2 pb-3 border-b">
        <ShettibalijaLogo size="sm" linkToHome />
        <div className="min-w-0">
          <p className="font-serif text-sm font-bold text-[#32105F] truncate leading-tight">
            Shettibalija
          </p>
          <p className="text-[10px] text-[#D9A514] font-semibold truncate">
            శెట్టిబలిజ మ్యాట్రిమోనీ
          </p>
        </div>
      </div>
      <nav className="grid gap-1" aria-label="Member">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-[#32105F] transition-colors"
            activeProps={{ className: "bg-[#32105F]/10 text-[#32105F] font-semibold" }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
