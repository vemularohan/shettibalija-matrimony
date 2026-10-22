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
      <div className="min-h-screen bg-[#F7F3EA] pb-16 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile Quick Subnav */}
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {MEMBER_NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex shrink-0 items-center gap-1.5 border-b border-transparent bg-transparent px-3.5 py-2 text-xs font-medium text-[#756A61] transition-colors hover:border-[#C9A227] hover:text-[#24103F]"
                  activeProps={{
                    className: "!border-[#C9A227] !text-[#24103F] font-semibold",
                  }}
                >
                  <item.icon className="h-3.5 w-3.5 text-[#087333]" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 bg-[#24103F] px-4 py-5">
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
