import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  HeartHandshake,
  LayoutDashboard,
  Menu,
  MessageSquareWarning,
  RefreshCw,
  Search,
  Shield,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/shared/require-auth";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";

type AdminSection =
  | "dashboard"
  | "members"
  | "profiles"
  | "verifications"
  | "interests"
  | "matches"
  | "memberships"
  | "payments"
  | "reports"
  | "audit-log";

const NAV_ITEMS: { section: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { section: "dashboard", label: "Overview", icon: LayoutDashboard },
  { section: "members", label: "Members", icon: Users },
  { section: "profiles", label: "Profiles", icon: UserRound },
  { section: "verifications", label: "Verifications", icon: BadgeCheck },
  { section: "interests", label: "Interests", icon: HeartHandshake },
  { section: "matches", label: "Matches", icon: Activity },
  { section: "memberships", label: "Memberships", icon: Shield },
  { section: "payments", label: "Payments", icon: CircleDollarSign },
  { section: "reports", label: "Reports", icon: MessageSquareWarning },
  { section: "audit-log", label: "Audit log", icon: FileCheck2 },
];

export const Route = createFileRoute("/admin")({
  validateSearch: (search: Record<string, unknown>): { section?: AdminSection } => {
    const value = search["section"];
    if (typeof value === "string" && NAV_ITEMS.some((item) => item.section === value)) {
      return { section: value as AdminSection };
    }
    return {};
  },
  component: AdminPortal,
  head: () => ({
    meta: [{ title: `Administration | ${SITE_NAME}` }],
  }),
});

type ProfileRow = {
  id: string;
  profile_code: string;
  display_name: string;
  gender: string;
  age: number;
  city: string | null;
  state: string | null;
  education: string | null;
  occupation: string | null;
  moderation_status: string;
  visibility: string;
  verified_at: string | null;
  created_at: string;
  last_active_at: string | null;
};

function AdminPortal() {
  const { section = "dashboard" } = Route.useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <RequireAuth admin>
      <div className="admin-portal">
        <AdminSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="admin-portal__content">
          <header className="admin-portal__topbar">
            <button
              type="button"
              className="admin-portal__menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open administration navigation"
            >
              <Menu size={19} />
            </button>
            <div className="admin-portal__title">
              <span className="admin-portal__kicker">Operations console</span>
              <h1>{NAV_ITEMS.find((item) => item.section === section)?.label ?? "Overview"}</h1>
            </div>
            <div className="admin-portal__topbar-search">
              <Search size={16} aria-hidden />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search this view"
                aria-label="Search this view"
              />
            </div>
          </header>
          <main className="admin-portal__main">
            <AdminSection section={section} search={search} />
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { section = "dashboard" } = Route.useSearch();

  return (
    <>
      {open ? (
        <button className="admin-portal__scrim" onClick={onClose} aria-label="Close navigation" />
      ) : null}
      <aside className={`admin-portal__sidebar ${open ? "is-open" : ""}`}>
        <div className="admin-portal__brand">
          <ShettibalijaLogo size="sm" theme="dark" priority />
          <div>
            <strong>{SITE_NAME}</strong>
            <span>{SITE_NAME_TE}</span>
          </div>
          {open ? (
            <button type="button" onClick={onClose} aria-label="Close administration navigation">
              <X size={18} />
            </button>
          ) : null}
        </div>
        <div className="admin-portal__side-label">Manage platform</div>
        <nav aria-label="Administration navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.section}
                to="/admin"
                search={{ section: item.section }}
                onClick={onClose}
                className={section === item.section ? "is-active" : undefined}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-portal__side-footer">
          <span>Staff access</span>
          <Link to="/dashboard">Return to member site</Link>
        </div>
      </aside>
    </>
  );
}

function AdminSection({ section, search }: { section: AdminSection; search: string }) {
  switch (section) {
    case "members":
      return (
        <ProfilesTable
          title="Members"
          description="Member profiles and account activity."
          search={search}
        />
      );
    case "profiles":
      return (
        <ProfilesTable
          title="Profile moderation"
          description="Review profile visibility and community publication status."
          search={search}
          moderation
        />
      );
    case "verifications":
      return <VerificationSection search={search} />;
    case "interests":
      return <InteractionsSection kind="interests" search={search} />;
    case "matches":
      return <InteractionsSection kind="matches" search={search} />;
    case "memberships":
      return <MembershipSection search={search} />;
    case "payments":
      return <PaymentsSection search={search} />;
    case "reports":
      return <ReportsSection search={search} />;
    case "audit-log":
      return <AuditLogSection search={search} />;
    default:
      return <AdminOverview />;
  }
}

function useAdminProfiles(search: string) {
  return useQuery({
    queryKey: ["admin-profiles", search],
    queryFn: async () => {
      let query = supabase
        .from("matrimonial_profiles")
        .select(
          "id, profile_code, display_name, gender, age, city, state, education, occupation, moderation_status, visibility, verified_at, created_at, last_active_at",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      const term = search.trim().replace(/[%_]/g, "");
      if (term) {
        query = query.or(
          `display_name.ilike.%${term}%,profile_code.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%`,
        );
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as ProfileRow[];
    },
  });
}

function ProfilesTable({
  title,
  description,
  search,
  moderation = false,
}: {
  title: string;
  description: string;
  search: string;
  moderation?: boolean;
}) {
  const queryClient = useQueryClient();
  const profilesQuery = useAdminProfiles(search);
  const moderationMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected" | "suspended";
    }) => {
      const { error } = await supabase
        .from("matrimonial_profiles")
        .update({
          moderation_status: status,
          visibility: status === "approved" ? "visible" : "hidden",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast.success(`Profile ${variables.status}.`);
      void queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "The profile could not be updated.")),
  });

  const rows = moderation
    ? (profilesQuery.data?.filter((profile) => profile.moderation_status !== "approved") ?? [])
    : (profilesQuery.data ?? []);

  return (
    <AdminPanel title={title} description={description} count={rows.length}>
      {profilesQuery.isLoading ? <TableSkeleton /> : null}
      {profilesQuery.isError ? <QueryError onRetry={() => void profilesQuery.refetch()} /> : null}
      {!profilesQuery.isLoading && !profilesQuery.isError && rows.length === 0 ? (
        <EmptyAdminState
          message={
            moderation ? "No profiles are waiting for moderation." : "No members match this search."
          }
        />
      ) : null}
      {rows.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Details</th>
                <th>Status</th>
                <th>Verification</th>
                <th>Joined</th>
                {moderation ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((profile) => (
                <tr key={profile.id}>
                  <td>
                    <strong>{profile.display_name}</strong>
                    <span>{profile.profile_code}</span>
                  </td>
                  <td>
                    <span>
                      {profile.age} · {profile.gender}
                    </span>
                    <span>
                      {[profile.city, profile.state].filter(Boolean).join(", ") ||
                        "Location not added"}
                    </span>
                  </td>
                  <td>
                    <StatusBadge value={profile.moderation_status} />
                  </td>
                  <td>
                    <StatusBadge value={profile.verified_at ? "verified" : "pending"} />
                  </td>
                  <td>{formatDate(profile.created_at)}</td>
                  {moderation ? (
                    <td>
                      <div className="admin-table__actions">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Approve ${profile.display_name}'s profile?`)) {
                              moderationMutation.mutate({ id: profile.id, status: "approved" });
                            }
                          }}
                        >
                          <Check size={14} /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (window.confirm(`Reject ${profile.display_name}'s profile?`)) {
                              moderationMutation.mutate({ id: profile.id, status: "rejected" });
                            }
                          }}
                        >
                          <X size={14} /> Reject
                        </Button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AdminPanel>
  );
}

function AdminOverview() {
  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [members, pending, approved, reports, interests, memberships, payments] =
        await Promise.all([
          supabase.from("matrimonial_profiles").select("id", { count: "exact", head: true }),
          supabase
            .from("matrimonial_profiles")
            .select("id", { count: "exact", head: true })
            .eq("moderation_status", "pending"),
          supabase
            .from("matrimonial_profiles")
            .select("id", { count: "exact", head: true })
            .eq("moderation_status", "approved"),
          supabase
            .from("profile_reports")
            .select("id", { count: "exact", head: true })
            .eq("status", "open"),
          supabase.from("interests").select("id", { count: "exact", head: true }),
          supabase
            .from("memberships")
            .select("id", { count: "exact", head: true })
            .eq("status", "active"),
          supabase.from("payments").select("amount_paise").eq("status", "successful"),
        ]);
      const failed = [members, pending, approved, reports, interests, memberships, payments].find(
        (result) => result.error,
      );
      if (failed?.error) throw failed.error;
      return {
        total: members.count ?? 0,
        pending: pending.count ?? 0,
        approved: approved.count ?? 0,
        reports: reports.count ?? 0,
        interests: interests.count ?? 0,
        memberships: memberships.count ?? 0,
        revenue: (payments.data ?? []).reduce((sum, payment) => sum + payment.amount_paise, 0),
      };
    },
  });
  const pendingQuery = useAdminProfiles("");
  const pending =
    pendingQuery.data?.filter((profile) => profile.moderation_status === "pending").slice(0, 5) ??
    [];

  return (
    <div className="admin-overview">
      <div className="admin-page-intro">
        <div>
          <span className="admin-portal__kicker">Today at a glance</span>
          <h2>Keep the community moving.</h2>
          <p>
            Review new profiles, resolve safety issues, and monitor the member journey from one
            place.
          </p>
        </div>
        <Link to="/admin" search={{ section: "profiles" }} className="admin-quick-link">
          Review profile queue <ChevronRight size={15} />
        </Link>
      </div>
      {overviewQuery.isLoading ? <MetricSkeleton /> : null}
      {overviewQuery.isError ? <QueryError onRetry={() => void overviewQuery.refetch()} /> : null}
      {overviewQuery.data ? (
        <div className="admin-metrics">
          <Metric label="Total profiles" value={overviewQuery.data.total} icon={Users} />
          <Metric
            label="Pending review"
            value={overviewQuery.data.pending}
            icon={FileCheck2}
            accent
          />
          <Metric label="Approved profiles" value={overviewQuery.data.approved} icon={BadgeCheck} />
          <Metric
            label="Open reports"
            value={overviewQuery.data.reports}
            icon={AlertTriangle}
            danger
          />
          <Metric label="Active memberships" value={overviewQuery.data.memberships} icon={Shield} />
          <Metric
            label="Successful revenue"
            value={formatCurrency(overviewQuery.data.revenue)}
            icon={CircleDollarSign}
          />
        </div>
      ) : null}
      <div className="admin-overview__grid">
        <AdminPanel
          title="Profiles needing attention"
          description="The most recent profiles in the moderation queue."
          count={pending.length}
        >
          {pending.length ? (
            <div className="admin-activity-list">
              {pending.map((profile) => (
                <div key={profile.id} className="admin-activity">
                  <div>
                    <strong>{profile.display_name}</strong>
                    <span>
                      {profile.profile_code} · {formatDate(profile.created_at)}
                    </span>
                  </div>
                  <StatusBadge value={profile.moderation_status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyAdminState message="No profiles awaiting review." />
          )}
        </AdminPanel>
        <AdminPanel
          title="Operational notes"
          description="Use the focused sections for actions that change member data."
          count={3}
        >
          <div className="admin-note-list">
            <p>
              <BarChart3 size={16} /> Metrics reflect records visible through staff RLS policies.
            </p>
            <p>
              <Shield size={16} /> Destructive actions require confirmation and moderation changes
              are audited.
            </p>
            <p>
              <RefreshCw size={16} /> Payments and memberships shown here are read-only operational
              records.
            </p>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}

function VerificationSection({ search }: { search: string }) {
  const query = useAdminProfiles(search);
  const rows =
    query.data?.filter(
      (profile) => !profile.verified_at && profile.moderation_status === "approved",
    ) ?? [];
  return (
    <AdminPanel
      title="Verification queue"
      description="Approved profiles that do not have a recorded verification timestamp."
      count={rows.length}
    >
      {query.isLoading ? <TableSkeleton /> : null}
      {query.isError ? <QueryError onRetry={() => void query.refetch()} /> : null}
      {!query.isLoading && !query.isError && rows.length === 0 ? (
        <EmptyAdminState message="No approved profiles are waiting for verification." />
      ) : null}
      {rows.length ? <SimpleProfileRows rows={rows} /> : null}
    </AdminPanel>
  );
}

function InteractionsSection({ kind, search }: { kind: "interests" | "matches"; search: string }) {
  const query = useQuery({
    queryKey: ["admin-interactions", kind],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interests")
        .select("id, from_user_id, to_profile_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
  const rows =
    query.data
      ?.filter((row) => (kind === "matches" ? row.status === "accepted" : true))
      .filter((row) => !search || row.status.includes(search.toLowerCase())) ?? [];
  return (
    <AdminPanel
      title={kind === "matches" ? "Accepted matches" : "Interests"}
      description={
        kind === "matches"
          ? "Accepted interest records; there is no separate match table in the current schema."
          : "Monitor member-to-profile introductions and their current state."
      }
      count={rows.length}
    >
      {query.isLoading ? <TableSkeleton /> : null}
      {query.isError ? <QueryError onRetry={() => void query.refetch()} /> : null}
      {!query.isLoading && !query.isError && rows.length === 0 ? (
        <EmptyAdminState
          message={kind === "matches" ? "No accepted matches found." : "No interest records found."}
        />
      ) : null}
      {rows.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Profile</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="admin-mono">{row.from_user_id.slice(0, 8)}…</span>
                  </td>
                  <td>
                    <span className="admin-mono">{row.to_profile_id.slice(0, 8)}…</span>
                  </td>
                  <td>
                    <StatusBadge value={row.status} />
                  </td>
                  <td>{formatDate(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AdminPanel>
  );
}

function MembershipSection({ search }: { search: string }) {
  const query = useQuery({
    queryKey: ["admin-memberships", search],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select("id, owner_id, plan_id, status, starts_at, expires_at, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []).filter((row) => !search || row.status.includes(search.toLowerCase()));
    },
  });
  return (
    <RecordTable
      title="Memberships"
      description="Active and historical membership records."
      query={query}
      columns={["Member", "Plan", "Status", "Starts", "Expires"]}
      renderRow={(row) => [
        <span className="admin-mono">{row.owner_id.slice(0, 8)}…</span>,
        <span className="admin-mono">{row.plan_id?.slice(0, 8) ?? "—"}</span>,
        <StatusBadge value={row.status} />,
        formatDate(row.starts_at),
        formatDate(row.expires_at),
      ]}
    />
  );
}

function PaymentsSection({ search }: { search: string }) {
  const query = useQuery({
    queryKey: ["admin-payments", search],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(
          "id, owner_id, amount_paise, currency, status, order_id, gateway_payment_id, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []).filter(
        (row) =>
          !search || row.status.includes(search.toLowerCase()) || row.order_id?.includes(search),
      );
    },
  });
  return (
    <RecordTable
      title="Payments"
      description="Provider-backed payment records. Card information is never stored here."
      query={query}
      columns={["Member", "Amount", "Status", "Reference", "Created"]}
      renderRow={(row) => [
        <span className="admin-mono">{row.owner_id.slice(0, 8)}…</span>,
        formatCurrency(row.amount_paise),
        <StatusBadge value={row.status} />,
        <span className="admin-mono">{row.order_id ?? row.gateway_payment_id ?? "—"}</span>,
        formatDate(row.created_at),
      ]}
    />
  );
}

function ReportsSection({ search }: { search: string }) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["admin-reports", search],
    queryFn: async () => {
      let request = supabase
        .from("profile_reports")
        .select("id, profile_id, reporter_id, reason, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (search) request = request.ilike("status", `%${search.replace(/[%_]/g, "")}%`);
      const { data, error } = await request;
      if (error) throw error;
      return data ?? [];
    },
  });
  const resolve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("profile_reports")
        .update({ status: "resolved" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Report resolved.");
      void queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "The report could not be updated.")),
  });
  return (
    <AdminPanel
      title="Safety reports"
      description="Review reports submitted by members. Resolve only after the underlying concern has been handled."
      count={query.data?.length ?? 0}
    >
      {query.isLoading ? <TableSkeleton /> : null}
      {query.isError ? <QueryError onRetry={() => void query.refetch()} /> : null}
      {!query.isLoading && !query.isError && !query.data?.length ? (
        <EmptyAdminState message="No member reports found." />
      ) : null}
      {query.data?.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Reported profile</th>
                <th>Reporter</th>
                <th>Status</th>
                <th>Created</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {query.data.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.reason}</strong>
                  </td>
                  <td>
                    <span className="admin-mono">{row.profile_id.slice(0, 8)}…</span>
                  </td>
                  <td>
                    <span className="admin-mono">{row.reporter_id.slice(0, 8)}…</span>
                  </td>
                  <td>
                    <StatusBadge value={row.status} />
                  </td>
                  <td>{formatDate(row.created_at)}</td>
                  <td>
                    {row.status !== "resolved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (window.confirm("Resolve this report?")) resolve.mutate(row.id);
                        }}
                      >
                        Resolve
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AdminPanel>
  );
}

function AuditLogSection({ search }: { search: string }) {
  const query = useQuery({
    queryKey: ["admin-audit-log", search],
    queryFn: async () => {
      let request = supabase
        .from("audit_logs")
        .select("id, actor_id, action, entity_type, entity_id, metadata, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (search) request = request.ilike("action", `%${search.replace(/[%_]/g, "")}%`);
      const { data, error } = await request;
      if (error) throw error;
      return data ?? [];
    },
  });
  return (
    <RecordTable
      title="Audit log"
      description="Append-oriented history of sensitive staff moderation actions."
      query={query}
      columns={["Action", "Entity", "Actor", "Created"]}
      renderRow={(row) => [
        <strong>{row.action}</strong>,
        <span className="admin-mono">
          {row.entity_type} · {row.entity_id?.slice(0, 8) ?? "—"}
        </span>,
        <span className="admin-mono">{row.actor_id.slice(0, 8)}…</span>,
        formatDate(row.created_at),
      ]}
    />
  );
}

function SimpleProfileRows({ rows }: { rows: ProfileRow[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Location</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <strong>{row.display_name}</strong>
                <span>{row.profile_code}</span>
              </td>
              <td>{[row.city, row.state].filter(Boolean).join(", ") || "—"}</td>
              <td>{formatDate(row.created_at)}</td>
              <td>
                <StatusBadge value={row.moderation_status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordTable<T extends { id: string }>({
  title,
  description,
  query,
  columns,
  renderRow,
}: {
  title: string;
  description: string;
  query: {
    data: T[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => Promise<unknown>;
  };
  columns: string[];
  renderRow: (row: T) => ReactNode[];
}) {
  return (
    <AdminPanel title={title} description={description} count={query.data?.length ?? 0}>
      {query.isLoading ? <TableSkeleton /> : null}
      {query.isError ? <QueryError onRetry={() => void query.refetch()} /> : null}
      {!query.isLoading && !query.isError && !query.data?.length ? (
        <EmptyAdminState message={`No ${title.toLowerCase()} found.`} />
      ) : null}
      {query.data?.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {query.data.map((row) => (
                <tr key={row.id}>
                  {renderRow(row).map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AdminPanel>
  );
}

function AdminPanel({
  title,
  description,
  count,
  children,
}: {
  title: string;
  description: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel__header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="admin-panel__count">{count}</span>
      </div>
      {children}
    </section>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  accent,
  danger,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div className={`admin-metric ${accent ? "is-accent" : ""} ${danger ? "is-danger" : ""}`}>
      <Icon size={17} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const label = value.replace(/_/g, " ");
  return (
    <Badge
      variant="outline"
      className={`admin-status admin-status--${value.replace(/[^a-z]/g, "-")}`}
    >
      {label}
    </Badge>
  );
}

function TableSkeleton() {
  return (
    <div className="admin-loading">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className="admin-metrics">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-28 w-full" />
      ))}
    </div>
  );
}

function QueryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="admin-feedback admin-feedback--error">
      <AlertTriangle size={17} />
      <span>We could not load this operational data.</span>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function EmptyAdminState({ message }: { message: string }) {
  return (
    <div className="admin-feedback">
      <Search size={18} />
      <span>{message}</span>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

function formatCurrency(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}
