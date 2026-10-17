import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
    { to: "/search", label: lang === "te" ? "ప్రొఫైల్స్ శోధన" : "Search Profiles" },
    { to: "/#how-it-works", label: lang === "te" ? "విధానం" : "How It Works" },
    { to: "/membership", label: lang === "te" ? "సభ్యత్వం" : "Membership" },
    { to: "/#success-stories", label: lang === "te" ? "విజయ గాథలు" : "Success Stories" },
    { to: "/about", label: lang === "te" ? "మా గురించి" : "About Us" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-[#FAF8F3]/95 backdrop-blur-sm border-b border-[#E4DDD3]",
        scrolled && "shadow-[0_2px_12px_rgba(36,16,63,0.06),0_1px_0_rgba(255,255,255,0.8)_inset]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Brand Name */}
        <Link to="/" className="flex items-center gap-2.5 focus:outline-none group">
          <ShettibalijaLogo
            size="sm"
            priority
            imgClassName="transition-opacity duration-200 group-hover:opacity-80"
          />
          <div className="flex flex-col leading-none">
            <span className="font-sans text-sm font-semibold text-[#242024] tracking-tight">
              {SITE_NAME}
            </span>
            <span className="text-[10px] font-medium text-[#D1A329] tracking-wide">
              {SITE_NAME_TE}
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-5 xl:gap-6 lg:flex" aria-label="Primary Navigation">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-[13px] font-medium text-[#6B6570] hover:text-[#24103F] transition-colors duration-150"
              activeProps={{ className: "text-[#24103F] font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher size="sm" />

          {!loading && user ? (
            <div className="flex items-center gap-1.5">
              {isAdmin || isModerator ? (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-[#6B6570] hover:text-[#242024]"
                >
                  <Link to="/admin">Admin</Link>
                </Button>
              ) : null}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-[#6B6570] hover:text-[#242024]"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 text-[#6B6570] hover:text-[#242024]"
                aria-label="Notifications"
              >
                <Link to="/dashboard/notifications">
                  <Bell className="h-4 w-4" />
                  {(unread ?? 0) > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#087333] px-1 text-[8px] text-white font-bold">
                      {unread}
                    </span>
                  ) : null}
                </Link>
              </Button>
              <button
                onClick={() => void handleLogout()}
                className="flex items-center gap-1 text-xs text-[#6B6570] hover:text-[#242024] transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-medium text-[#242024] hover:text-[#24103F]"
              >
                <Link to="/login">{lang === "te" ? "లాగిన్" : "Login"}</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-8 rounded-md bg-[#24103F] px-3.5 text-xs font-semibold text-white hover:bg-[#311552] transition-all shadow-xs active:translate-y-px"
              >
                <Link to="/register">
                  {lang === "te" ? "ఉచిత రిజిస్ట్రేషన్" : "Register Free"}
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher size="sm" />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#6B6570] hover:text-[#242024] hover:bg-[#F0EDE6] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100%,20rem)] bg-[#FAF8F3] border-l border-[#E4DDD3] p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{SITE_NAME}</SheetTitle>
              </SheetHeader>

              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4DDD3]">
                <div className="flex items-center gap-2.5">
                  <ShettibalijaLogo size="sm" priority />
                  <span className="font-sans text-sm font-semibold text-[#242024]">
                    {SITE_NAME}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-[#6B6570] hover:text-[#242024] hover:bg-[#F0EDE6] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col px-3 py-4 gap-0.5" aria-label="Mobile Navigation">
                {navLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[#6B6570] hover:text-[#242024] hover:bg-[#F0EDE6] transition-colors"
                    activeProps={{ className: "text-[#24103F] font-semibold bg-[#F0EDE6]" }}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="mt-3 mb-1 h-px bg-[#E4DDD3]" />

                {/* Language Switcher */}
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-[#6B6570]">
                    {lang === "te" ? "భాష" : "Language"}
                  </span>
                  <LanguageSwitcher size="sm" />
                </div>

                <div className="mt-2 h-px bg-[#E4DDD3]" />

                {/* Auth Actions */}
                {!loading && user ? (
                  <div className="flex flex-col gap-0.5 mt-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[#6B6570] hover:text-[#242024] hover:bg-[#F0EDE6] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[#6B6570] hover:text-[#242024] hover:bg-[#F0EDE6] transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard/notifications"
                      onClick={() => setOpen(false)}
                      className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[#6B6570] hover:text-[#242024] hover:bg-[#F0EDE6] transition-colors"
                    >
                      Notifications
                      {(unread ?? 0) > 0 && (
                        <span className="ml-auto text-xs font-bold text-[#087333]">{unread}</span>
                      )}
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      onClick={() => void handleLogout()}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-3 pt-3">
                    <Button
                      asChild
                      className="h-10 rounded-md bg-[#24103F] text-white text-sm font-semibold hover:bg-[#311552]"
                    >
                      <Link to="/register" onClick={() => setOpen(false)}>
                        {lang === "te" ? "ఉచిత రిజిస్ట్రేషన్" : "Register Free"}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 rounded-md border-[#E4DDD3] text-sm font-medium text-[#242024]"
                    >
                      <Link to="/login" onClick={() => setOpen(false)}>
                        {lang === "te" ? "లాగిన్" : "Login"}
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>

              <div className="absolute bottom-6 left-0 right-0 px-6 text-center text-[11px] text-[#B0A8B8]">
                Shettibalija Sangham Matrimony
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
