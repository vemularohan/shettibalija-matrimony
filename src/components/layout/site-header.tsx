import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUnreadNotificationCount } from "@/hooks/use-member-data";
import { PUBLIC_NAV, SITE_NAME } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function SiteHeader() {
  const { user, loading, signOut, isAdmin, isModerator } = useAuth();
  const { data: unread } = useUnreadNotificationCount();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    setOpen(false);
    void navigate({ to: "/" });
  }

  const links = PUBLIC_NAV;

  return (
    <header className="sticky top-0 z-40 border-b border-[#D9A514]/30 bg-[#21083F] text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4">
        {/* Left: Brand Lockup with Logo & Site Name */}
        <div className="flex items-center min-w-0">
          {/* Desktop & Tablet: Medium Logo with Name & Telugu Subtitle */}
          <div className="hidden sm:block">
            <ShettibalijaLogo size="md" withText linkToHome priority theme="dark" />
          </div>
          {/* Mobile: Compact Logo with Name */}
          <div className="block sm:hidden">
            <ShettibalijaLogo size="sm" withText linkToHome priority theme="dark" />
          </div>
        </div>

        {/* Center / Navigation Links (Desktop) */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-white/85 transition-colors hover:text-[#F3D36A]"
              activeProps={{
                className: "text-[#F3D36A] font-semibold border-b-2 border-[#D9A514] pb-0.5",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Controls: Language Switcher + Auth Controls */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Telugu / English language switcher */}
          <LanguageSwitcher theme="dark" />

          {!loading && user ? (
            <div className="flex items-center gap-2">
              {isAdmin || isModerator ? (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/admin">Admin</Link>
                </Button>
              ) : null}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/dashboard/profile">Profile</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10 hover:text-white"
                aria-label="Notifications"
              >
                <Link to="/dashboard/notifications">
                  <Bell className="h-4 w-4" />
                  {(unread ?? 0) > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#087A32] px-1 text-[10px] text-white font-bold">
                      {unread}
                    </span>
                  ) : null}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleLogout()}
                className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-[#087A32] hover:bg-[#045522] text-white font-semibold shadow-xs"
              >
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Header Controls: Compact Language Switcher + Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          {/* Mobile Language Switcher */}
          <LanguageSwitcher size="sm" theme="dark" />

          {/* Mobile Menu Drawer Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100%,20rem)] p-5 bg-[#21083F] text-white border-l border-[#D9A514]/30"
            >
              <SheetHeader className="text-left pb-4 border-b border-white/15">
                <SheetTitle className="sr-only">{SITE_NAME}</SheetTitle>
                <ShettibalijaLogo size="sm" withText linkToHome theme="dark" />
              </SheetHeader>

              <div className="mt-4 flex items-center justify-between pb-3 border-b border-white/15">
                <span className="text-xs font-medium text-white/70">Language</span>
                <LanguageSwitcher size="sm" theme="dark" />
              </div>

              <nav className="mt-4 grid gap-2" aria-label="Mobile">
                {links.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 text-white/90 transition-colors"
                    activeProps={{ className: "bg-white/15 text-[#F3D36A] font-bold" }}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-white/15" />
                {!loading && user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 text-white/90"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 text-white/90"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard/notifications"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 text-white/90"
                    >
                      Notifications
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-300 hover:bg-red-950/40"
                      onClick={() => void handleLogout()}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-white/30 text-white bg-transparent hover:bg-white/10"
                    >
                      <Link to="/login" onClick={() => setOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-[#087A32] hover:bg-[#045522] text-white">
                      <Link to="/register" onClick={() => setOpen(false)}>
                        Register
                      </Link>
                    </Button>
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
