import { Link } from "@tanstack/react-router";
import { Heart, Home, Search, UserRound, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function MobileBottomNav() {
  const { user } = useAuth();
  if (!user) return null;
  const items = [
    { to: "/dashboard", label: "Home", icon: Home },
    { to: "/search", label: "Search", icon: Search },
    { to: "/dashboard/shortlist", label: "Shortlist", icon: Heart },
    { to: "/dashboard/notifications", label: "Alerts", icon: Bell },
    { to: "/dashboard/profile", label: "Profile", icon: UserRound },
  ] as const;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Member shortcuts"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="flex flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
