import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, X, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUnreadNotificationCount } from "@/hooks/use-member-data";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { user, loading, signOut, isAdmin, isModerator } = useAuth();
  const { data: unread } = useUnreadNotificationCount();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLanguage();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    await signOut();
    setOpen(false);
    void navigate({ to: "/" });
  }

  const navLinks = [
    { to: "/", label: lang === "te" ? "హోమ్" : "Home" },
    { to: "/search", label: lang === "te" ? "అన్వేషణ" : "Discover" },
    { to: "/#how-it-works", label: lang === "te" ? "ఎలా పనిచేస్తుంది" : "How it works" },
    { to: "/membership", label: lang === "te" ? "సభ్యత్వం" : "Membership" },
    { to: "/success-stories", label: lang === "te" ? "కథలు" : "Stories" },
    { to: "/about", label: lang === "te" ? "మా గురించి" : "About" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-[#ded5c8] bg-[#FAF8F3]/97 shadow-[0_10px_30px_rgba(36,16,63,0.06)] backdrop-blur-md"
          : "border-[#e9e2d7] bg-[#FAF8F3]/95 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1A329] focus-visible:ring-offset-2"
        >
          <ShettibalijaLogo size="sm" priority />
          <span className="flex flex-col leading-none">
            <span className="font-sans text-[13px] font-bold tracking-[-0.015em] text-[#242024]">
              {SITE_NAME}
            </span>
            <span className="sbm-telugu mt-1 text-[9px] font-medium tracking-wide text-[#a37d1c]">
              {SITE_NAME_TE}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex xl:gap-7"
          aria-label="Primary navigation"
        >
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative py-2 text-[12px] font-semibold text-[#5e5663] transition-colors hover:text-[#24103F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1A329] focus-visible:ring-offset-2"
              activeProps={{ className: "text-[#24103F]" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher size="sm" />
          {!loading && user ? (
            <div className="flex items-center gap-1">
              {isAdmin || isModerator ? (
                <Link
                  to="/admin"
                  className="px-2.5 py-2 text-[12px] font-semibold text-[#6b6570] hover:text-[#24103F]"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                to="/dashboard"
                className="px-2.5 py-2 text-[12px] font-semibold text-[#6b6570] hover:text-[#24103F]"
              >
                {lang === "te" ? "డ్యాష్‌బోర్డ్" : "Dashboard"}
              </Link>
              <Link
                to="/dashboard/notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#6b6570] transition-colors hover:bg-[#f0ebe3] hover:text-[#24103F]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {(unread ?? 0) > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#087333] px-1 text-[8px] font-bold text-white">
                    {unread}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="flex items-center gap-1 px-1.5 py-2 text-[12px] font-medium text-[#6b6570] hover:text-[#24103F]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">
                  {lang === "te" ? "లాగ్ అవుట్" : "Log out"}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                search={{}}
                className="px-2.5 py-2 text-[12px] font-semibold text-[#4f4755] hover:text-[#24103F]"
              >
                {lang === "te" ? "లాగిన్" : "Login"}
              </Link>
              <Link
                to="/register"
                className="sbm-button sbm-button--primary min-h-0 px-4 py-2.5 text-[12px]"
              >
                {lang === "te" ? "ప్రొఫైల్ ప్రారంభించండి" : "Begin your profile"}
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
          <LanguageSwitcher size="sm" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#4f4755] transition-colors hover:bg-[#f0ebe3] hover:text-[#24103F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1A329]"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100%,21rem)] border-l border-[#ded5c8] bg-[#FAF8F3] p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{SITE_NAME}</SheetTitle>
              </SheetHeader>

              <div className="flex items-center justify-between border-b border-[#ded5c8] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <ShettibalijaLogo size="sm" priority />
                  <div>
                    <p className="text-sm font-bold text-[#242024]">{SITE_NAME}</p>
                    <p className="sbm-telugu text-[9px] text-[#a37d1c]">{SITE_NAME_TE}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b6570] hover:bg-[#f0ebe3] hover:text-[#24103F]"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex flex-col px-3 py-5" aria-label="Mobile navigation">
                {navLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center border-b border-[#e8e0d4]/70 px-3 py-3 text-sm font-semibold text-[#4f4755] transition-colors hover:text-[#24103F]"
                    activeProps={{ className: "text-[#24103F]" }}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="mt-5 flex items-center justify-between px-3 py-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B6570]">
                    {lang === "te" ? "భాష" : "Language"}
                  </span>
                  <LanguageSwitcher size="sm" />
                </div>

                {!loading && user ? (
                  <div className="mt-4 flex flex-col gap-2 px-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="sbm-button sbm-button--primary w-full"
                    >
                      {lang === "te" ? "నా డ్యాష్‌బోర్డ్" : "My dashboard"}
                    </Link>
                    <button
                      type="button"
                      className="sbm-button sbm-button--outline w-full text-rose-700"
                      onClick={() => void handleLogout()}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      {lang === "te" ? "లాగ్ అవుట్" : "Log out"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 px-3">
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="sbm-button sbm-button--primary w-full"
                    >
                      {lang === "te" ? "ప్రొఫైల్ ప్రారంభించండి" : "Begin your profile"}
                    </Link>
                    <Link
                      to="/login"
                      search={{}}
                      onClick={() => setOpen(false)}
                      className="sbm-button sbm-button--outline w-full"
                    >
                      {lang === "te" ? "లాగిన్" : "Login"}
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
