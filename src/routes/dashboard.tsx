import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/shared/require-auth";
import { MemberSidebar, MEMBER_NAV_ITEMS } from "@/components/layout/member-sidebar";
import { SITE_NAME } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";

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
  const { lang } = useLanguage();

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#FAF8F3] pb-16 pt-20 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 border-b border-[#ded5c8] lg:hidden">
            <div className="scrollbar-none flex items-center gap-5 overflow-x-auto">
              {MEMBER_NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: true }}
                  className="flex shrink-0 items-center gap-1.5 border-b-2 border-transparent py-3 text-[12px] font-medium text-[#6B6570] transition-colors hover:text-[#24103F]"
                  activeProps={{
                    className: "border-b-[#D1A329] font-semibold text-[#24103F]",
                  }}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{lang === "te" ? item.labelTe : item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-24 border-r border-[#ded5c8] pr-5">
                <MemberSidebar />
              </div>
            </aside>
            <main className="sbm-member-main min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
