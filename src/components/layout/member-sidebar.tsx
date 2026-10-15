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
    <nav className={cn("grid gap-1", className)} aria-label="Member">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
          activeProps={{ className: "bg-muted text-primary font-medium" }}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
