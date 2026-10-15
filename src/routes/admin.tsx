import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Check, X, AlertTriangle, Users, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { RequireAuth } from "@/components/shared/require-auth";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
  head: () => ({
    meta: [{ title: `Staff Administration | ${SITE_NAME}` }],
  }),
});

function AdminDashboardPage() {
  const queryClient = useQueryClient();

  // Pending matrimonial profiles
  const pendingProfilesQuery = useQuery({
    queryKey: ["admin-pending-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matrimonial_profiles")
        .select("*")
        .eq("moderation_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  // Open reports
  const reportsQuery = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_reports")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  const moderateProfile = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase
        .from("matrimonial_profiles")
        .update({ moderation_status: status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      toast.success(vars.status === "approved" ? "Profile approved." : "Profile rejected.");
      void queryClient.invalidateQueries({ queryKey: ["admin-pending-profiles"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update profile moderation.")),
  });

  const resolveReport = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from("profile_reports")
        .update({ status: "resolved" })
        .eq("id", reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Report resolved.");
      void queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to resolve report.")),
  });

  return (
    <RequireAuth admin={true}>
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary p-2.5 text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Staff Administration</h1>
            <p className="text-sm text-muted-foreground">
              Review and approve member profiles, verify community data, and resolve safety reports.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approvals
              </CardTitle>
              <FileCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingProfilesQuery.data?.length ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Reports
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {reportsQuery.data?.length ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Profiles Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Profiles Pending Review</CardTitle>
            <CardDescription>
              New member profiles require approval before becoming searchable to the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingProfilesQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : pendingProfilesQuery.isError ? (
              <ErrorState
                title="Could not load pending profiles"
                onRetry={() => void pendingProfilesQuery.refetch()}
              />
            ) : !pendingProfilesQuery.data?.length ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                All submitted profiles have been reviewed! No pending queue.
              </p>
            ) : (
              <div className="divide-y">
                {pendingProfilesQuery.data.map((p) => (
                  <div
                    key={p.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{p.display_name}</span>
                        <Badge variant="outline" className="text-xs uppercase">
                          {p.gender}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{p.age} yrs</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {[p.city, p.state, p.education, p.occupation].filter(Boolean).join(" • ")}
                      </p>
                      {p.family_summary ? (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          "{p.family_summary}"
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => moderateProfile.mutate({ id: p.id, status: "approved" })}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => moderateProfile.mutate({ id: p.id, status: "rejected" })}
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Member Reports</CardTitle>
            <CardDescription>User-submitted safety and fake profile flags</CardDescription>
          </CardHeader>
          <CardContent>
            {reportsQuery.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : reportsQuery.isError ? (
              <ErrorState
                title="Could not load reports"
                onRetry={() => void reportsQuery.refetch()}
              />
            ) : !reportsQuery.data?.length ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No active member reports.
              </p>
            ) : (
              <div className="divide-y">
                {reportsQuery.data.map((r) => (
                  <div key={r.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-destructive">{r.reason}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Reported on {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => resolveReport.mutate(r.id)}>
                      Resolve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}
