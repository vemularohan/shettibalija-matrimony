import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { AdminSection } from "./admin";

const SECTION_ALIASES: Record<string, AdminSection> = {
  dashboard: "dashboard",
  members: "members",
  profiles: "profiles",
  verification: "verifications",
  verifications: "verifications",
  interests: "interests",
  matches: "matches",
  memberships: "memberships",
  payments: "payments",
  reports: "reports",
  support: "support",
  "audit-log": "audit-log",
};

export const Route = createFileRoute("/admin/$section")({
  component: AdminSectionRedirect,
});

function AdminSectionRedirect() {
  const { section } = Route.useParams();
  const navigate = useNavigate();
  const preview =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("preview") === "1";

  useEffect(() => {
    void navigate({
      to: "/admin",
      search: {
        section: SECTION_ALIASES[section] ?? "dashboard",
        ...(preview ? { preview: true } : {}),
      },
      replace: true,
    });
  }, [navigate, preview, section]);

  return (
    <div className="sbm-page flex min-h-[60vh] items-center justify-center bg-[#FAF8F3]">
      <p className="text-sm text-[#6B6570]">Opening administration…</p>
    </div>
  );
}
