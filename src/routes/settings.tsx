import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/shared/require-auth";
import { DashboardSettingsPage } from "./dashboard/settings";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/settings")({
  component: SettingsPageRoute,
  head: () => ({
    meta: [
      { title: `Settings | ${SITE_NAME}` },
      { name: "description", content: "Account settings" },
    ],
  }),
});

function SettingsPageRoute() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <DashboardSettingsPage />
      </div>
    </RequireAuth>
  );
}
