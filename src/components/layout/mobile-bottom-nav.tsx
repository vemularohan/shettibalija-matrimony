import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, Search, UserRound, Sparkles, UserCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const actions = useProfileActions();

  // For logged-in users, provide the dedicated 5-tab member dock
  if (user) {
    const memberItems = [
      {
        to: "/dashboard",
        label: lang === "te" ? "హోమ్" : "Home",
        icon: Home,
        isActive: currentPath === "/dashboard",
      },
      {
        to: "/search",
        label: lang === "te" ? "శోధన" : "Search",
        icon: Search,
        isActive: currentPath === "/search",
      },
      {
        to: "/dashboard/shortlist",
        label: lang === "te" ? "షార్ట్‌లిస్ట్" : "Shortlist",
        icon: Heart,
        isActive: currentPath === "/dashboard/shortlist",
        badge: actions.shortlistedIds.size > 0 ? actions.shortlistedIds.size : null,
      },
      {
        to: "/dashboard/interests",
        label: lang === "te" ? "ఆసక్తులు" : "Interests",
        icon: UserCheck,
        isActive: currentPath === "/dashboard/interests",
        badge: actions.sentInterests.size > 0 ? actions.sentInterests.size : null,
      },
      {
        to: "/dashboard/profile",
        label: lang === "te" ? "ప్రొఫైల్" : "Profile",
        icon: UserRound,
        isActive: currentPath === "/dashboard/profile",
      },
    ] as const;

    return (
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D9A514]/25 bg-white/95 backdrop-blur-xl shadow-[0_-8px_25px_rgba(33,8,63,0.08)] pb-[env(safe-area-inset-bottom,8px)] pt-1.5 lg:hidden select-none"
        aria-label="Member Navigation"
      >
        <ul className="grid grid-cols-5 items-center">
          {memberItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            return (
              <li key={item.to} className="relative">
                <Link
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-1 px-1 text-center touch-press transition-colors",
                    active ? "text-[#21083F]" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={cn(
                        "flex h-8 w-11 items-center justify-center rounded-full transition-all duration-200",
                        active ? "bg-[#21083F] text-[#F4D477] shadow-xs" : "text-muted-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active && "stroke-[2.5]")} />
                    </div>
                    {item.badge ? (
                      <span className="absolute -top-1 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#087A32] px-1 text-[9px] font-bold text-white shadow-xs">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] tracking-tight leading-none",
                      active ? "font-bold text-[#21083F]" : "font-medium text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  // For guest users, provide a clean bottom bar for easy mobile exploration
  const guestItems = [
    {
      to: "/",
      label: lang === "te" ? "హోమ్" : "Home",
      icon: Home,
      isActive: currentPath === "/",
    },
    {
      to: "/search",
      label: lang === "te" ? "శోధన" : "Search",
      icon: Search,
      isActive: currentPath === "/search",
    },
    {
      to: "/membership",
      label: lang === "te" ? "సభ్యత్వం" : "Plans",
      icon: Sparkles,
      isActive: currentPath === "/membership",
    },
    {
      to: "/register",
      label: lang === "te" ? "రిజిస్టర్" : "Join",
      icon: UserRound,
      isActive: currentPath === "/register",
    },
  ] as const;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D9A514]/25 bg-white/95 backdrop-blur-xl shadow-[0_-8px_25px_rgba(33,8,63,0.08)] pb-[env(safe-area-inset-bottom,8px)] pt-1.5 lg:hidden select-none"
      aria-label="Public Mobile Navigation"
    >
      <ul className="grid grid-cols-4 items-center">
        {guestItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <li key={item.to} className="relative">
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1 px-1 text-center touch-press transition-colors",
                  active ? "text-[#21083F]" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-11 items-center justify-center rounded-full transition-all duration-200",
                    active ? "bg-[#21083F] text-[#F4D477] shadow-xs" : "text-muted-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && "stroke-[2.5]")} />
                </div>
                <span
                  className={cn(
                    "text-[10px] tracking-tight leading-none",
                    active ? "font-bold text-[#21083F]" : "font-medium text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
