import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, X, LogOut, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUnreadNotificationCount, useOwnMatrimonialProfile } from "@/hooks/use-member-data";
import { productSupabase } from "@/integrations/supabase/product-client";
import { SITE_NAME } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLanguage } from "@/lib/i18n";

type NavItem = { to: string; label: string };

export function SiteHeader() {
  const { user, loading, signOut, isAdmin, isModerator } = useAuth();
  const { data: unread } = useUnreadNotificationCount();
  const ownProfile = useOwnMatrimonialProfile().data;
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user?.id || !ownProfile?.id) return;
    const updateActivity = () => {
      if (document.visibilityState !== "visible") return;
      if (
        ownProfile.last_active_at &&
        Date.now() - Date.parse(ownProfile.last_active_at) < 5 * 60 * 1000
      )
        return;
      void productSupabase
        .from("matrimonial_profiles")
        .update({ last_active_at: new Date().toISOString() })
        .eq("id", ownProfile.id);
    };
    updateActivity();
    const timer = window.setInterval(updateActivity, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", updateActivity);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, [user?.id, ownProfile?.id, ownProfile?.last_active_at]);

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

  const publicLinks: NavItem[] = [
    { to: "/#how-it-works", label: lang === "te" ? "విధానం" : "How it works" },
    { to: "/membership", label: lang === "te" ? "సభ్యత్వం" : "Membership" },
    { to: "/success-stories", label: lang === "te" ? "కుటుంబ కథలు" : "Family stories" },
    { to: "/help", label: lang === "te" ? "సహాయం" : "Help" },
  ];
  const memberLinks: NavItem[] = [
    { to: "/dashboard", label: lang === "te" ? "నా హోమ్" : "My space" },
    { to: "/search", label: lang === "te" ? "శోధన" : "Discover" },
    { to: "/dashboard/matches", label: lang === "te" ? "నా మ్యాచ్‌లు" : "Matches" },
    { to: "/membership", label: lang === "te" ? "సభ్యత్వం" : "Membership" },
  ];
  const navLinks = user ? memberLinks : publicLinks;

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header-note">
        <div className="public-shell">
          <p>
            {lang === "te"
              ? "శెట్టిబలిజ కుటుంబాల కోసం సురక్షితమైన వివాహ పరిచయ వేదిక"
              : "A considered matrimonial space for Shettibalija individuals and families"}
          </p>
          <LanguageSwitcher size="sm" variant="text" />
        </div>
      </div>

      <div className="public-shell site-header-main">
        <Link to="/" className="site-brand" aria-label={`${SITE_NAME} home`}>
          <span className="site-brand-mark">
            <ShettibalijaLogo size="sm" priority />
          </span>
          <span className="site-brand-copy">
            <strong>{SITE_NAME}</strong>
            <small lang="te">శెట్టిబలిజ సంఘం</small>
          </span>
        </Link>

        <nav className="site-header-nav" aria-label="Primary navigation">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="site-header-link"
              activeProps={{ className: "site-header-link is-active" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          {!loading && user ? (
            <>
              {isAdmin || isModerator ? (
                <Link to="/admin" className="site-header-text-action">
                  Admin
                </Link>
              ) : null}
              <Link
                to="/dashboard/notifications"
                className="site-header-bell"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {(unread ?? 0) > 0 ? <span>{unread}</span> : null}
              </Link>
              <Link to="/dashboard/profile" className="site-header-text-action">
                {lang === "te" ? "ప్రొఫైల్" : "Profile"}
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="site-header-text-action"
              >
                <LogOut className="h-3.5 w-3.5" />
                {lang === "te" ? "నిష్క్రమించు" : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="site-header-text-action">
                {lang === "te" ? "లాగిన్" : "Sign in"}
              </Link>
              <Button asChild className="site-header-join">
                <Link to="/register">
                  {lang === "te" ? "ప్రొఫైల్ ప్రారంభించండి" : "Start a profile"}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="site-header-mobile-actions">
          {!user && !loading ? (
            <Link to="/login" className="site-mobile-sign-in">
              {lang === "te" ? "లాగిన్" : "Sign in"}
            </Link>
          ) : null}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="site-menu-trigger" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="site-mobile-drawer">
              <SheetHeader className="sr-only">
                <SheetTitle>{SITE_NAME}</SheetTitle>
              </SheetHeader>
              <div className="site-mobile-drawer-top">
                <Link to="/" className="site-brand" onClick={() => setOpen(false)}>
                  <span className="site-brand-mark">
                    <ShettibalijaLogo size="sm" priority />
                  </span>
                  <span className="site-brand-copy">
                    <strong>{SITE_NAME}</strong>
                    <small lang="te">శెట్టిబలిజ సంఘం</small>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="site-menu-trigger"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="site-mobile-nav" aria-label="Mobile navigation">
                {navLinks.map((item, index) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="site-mobile-nav-link"
                    activeProps={{ className: "site-mobile-nav-link is-active" }}
                  >
                    <span>0{index + 1}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="site-mobile-drawer-foot">
                <div className="site-mobile-language">
                  <span>{lang === "te" ? "భాష" : "Language"}</span>
                  <LanguageSwitcher size="sm" variant="text" />
                </div>
                {!loading && user ? (
                  <div className="site-mobile-member-actions">
                    <Link to="/dashboard/profile" onClick={() => setOpen(false)}>
                      {lang === "te" ? "నా ప్రొఫైల్" : "My profile"}
                    </Link>
                    <Link to="/dashboard/notifications" onClick={() => setOpen(false)}>
                      Notifications{(unread ?? 0) > 0 ? ` (${unread})` : ""}
                    </Link>
                    <button type="button" onClick={() => void handleLogout()}>
                      <LogOut className="h-4 w-4" />
                      {lang === "te" ? "నిష్క్రమించు" : "Sign out"}
                    </button>
                  </div>
                ) : (
                  <div className="site-mobile-guest-actions">
                    <Button asChild className="site-header-join">
                      <Link to="/register" onClick={() => setOpen(false)}>
                        {lang === "te" ? "ఉచితంగా ప్రారంభించండి" : "Start your profile"}
                      </Link>
                    </Button>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      {lang === "te" ? "లాగిన్" : "Sign in"}
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
