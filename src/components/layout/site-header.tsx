import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUnreadNotificationCount } from "@/hooks/use-member-data";
import { PUBLIC_NAV, SITE_NAME, SITE_NAME_TE } from "@/lib/site";

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
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="min-w-0">
          <span className="block truncate font-serif text-lg font-semibold leading-tight text-primary md:text-xl">
            {SITE_NAME}
          </span>
          <span className="block text-xs text-gold-foreground">{SITE_NAME_TE}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-foreground/80 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {!loading && user ? (
            <>
              {isAdmin || isModerator ? (
                <Button asChild variant="ghost">
                  <Link to="/admin">Admin</Link>
                </Button>
              ) : null}
              <Button asChild variant="ghost">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/dashboard/profile">Profile</Link>
              </Button>
              <Button asChild variant="ghost" className="relative" aria-label="Notifications">
                <Link to="/dashboard/notifications">
                  <Bell className="h-4 w-4" />
                  {(unread ?? 0) > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                      {unread}
                    </span>
                  ) : null}
                </Link>
              </Button>
              <Button variant="outline" onClick={() => void handleLogout()}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,20rem)]">
            <SheetHeader>
              <SheetTitle className="font-serif text-primary">{SITE_NAME}</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 grid gap-3" aria-label="Mobile">
              {links.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-2 py-2 text-sm hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              {!loading && user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="px-2 py-2 text-sm"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setOpen(false)}
                    className="px-2 py-2 text-sm"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setOpen(false)}
                    className="px-2 py-2 text-sm"
                  >
                    Notifications
                  </Link>
                  <button
                    type="button"
                    className="px-2 py-2 text-left text-sm"
                    onClick={() => void handleLogout()}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="px-2 py-2 text-sm">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="px-2 py-2 text-sm">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
