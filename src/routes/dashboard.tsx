import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/shared/require-auth";
import { MemberSidebar, MEMBER_NAV_ITEMS } from "@/components/layout/member-sidebar";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  head: () => ({
    meta: [
      { title: `Member Dashboard | ${SITE_NAME}` },
      { name: "description", content: "Manage your matrimony profile, interests, and matches" },
    ],
  }),
});

function DashboardLayout() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-b from-[#21083F]/[0.02] via-[#F8F7F4] to-[#F8F7F4] pb-16 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile Quick Subnav */}
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {MEMBER_NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#D9A514]/20 bg-white px-3.5 py-1.5 text-xs font-medium text-foreground/80 shadow-xs hover:border-[#D9A514] hover:text-[#21083F] transition-all"
                  activeProps={{
                    className:
                      "!border-[#21083F] !bg-gradient-to-r !from-[#21083F] !to-[#351064] !text-white !shadow-sm font-semibold",
                  }}
                >
                  <item.icon className="h-3.5 w-3.5 text-[#D9A514]" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-3xl border border-[#D9A514]/20 bg-white/95 p-5 shadow-sm backdrop-blur-md">
                <MemberSidebar />
              </div>
            </aside>
            <main className="min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
