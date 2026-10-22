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
        badge: null,
      },
      {
        to: "/search",
        label: lang === "te" ? "శోధన" : "Search",
        icon: Search,
        isActive: currentPath === "/search",
        badge: null,
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
        badge: null,
      },
    ] as const;

    return (
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ded5c8] bg-[#FAF8F3] pb-[env(safe-area-inset-bottom,6px)] lg:hidden select-none"
        aria-label="Member navigation"
      >
        <ul className="grid grid-cols-5 items-stretch">
          {memberItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            return (
              <li key={item.to} className="relative">
                <Link
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 border-t-2 px-1 pb-1.5 pt-2 text-center transition-colors",
                    active
                      ? "border-[#D1A329] text-[#24103F]"
                      : "border-transparent text-[#6B6570] hover:text-[#24103F]",
                  )}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className={cn("h-4 w-4", active && "stroke-[2.4]")} />
                    {item.badge ? (
                      <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center bg-[#087333] px-1 text-[8px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span className={cn("text-[9px] leading-none", active && "font-bold")}>
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ded5c8] bg-[#FAF8F3] pb-[env(safe-area-inset-bottom,6px)] lg:hidden select-none"
      aria-label="Public mobile navigation"
    >
      <ul className="grid grid-cols-4 items-stretch">
        {guestItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <li key={item.to} className="relative">
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 border-t-2 px-1 pb-1.5 pt-2 text-center transition-colors",
                  active
                    ? "border-[#D1A329] text-[#24103F]"
                    : "border-transparent text-[#6B6570] hover:text-[#24103F]",
                )}
              >
                <Icon className={cn("h-4 w-4", active && "stroke-[2.4]")} />
                <span className={cn("text-[9px] leading-none", active && "font-bold")}>
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
