import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireAuth } from "@/components/shared/require-auth";
import { MemberSidebar } from "@/components/layout/member-sidebar";
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
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border bg-card p-4 shadow-sm">
              <MemberSidebar />
            </div>
          </aside>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
