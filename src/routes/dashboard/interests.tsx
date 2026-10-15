import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Inbox, Check, X, Search, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { useOwnMatrimonialProfile } from "@/hooks/use-member-data";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/dashboard/interests")({
  component: DashboardInterestsPage,
});

function DashboardInterestsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const ownProfile = ownProfileQuery.data;
  const [tab, setTab] = useState<"received" | "sent">("received");

  // Sent interests
  const sentQuery = useQuery({
    queryKey: ["sent-interests-list", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("interests")
        .select(
          "id, status, created_at, to_profile_id, matrimonial_profiles:to_profile_id(id, display_name, age, city, state, occupation, education, profile_code)",
        )
        .eq("from_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  // Received interests
  const receivedQuery = useQuery({
    queryKey: ["received-interests-list", ownProfile?.id],
    enabled: Boolean(ownProfile?.id),
    queryFn: async () => {
      if (!ownProfile?.id) return [];
      const { data, error } = await supabase
        .from("interests")
        .select("id, status, created_at, from_user_id, profiles:from_user_id(id, full_name)")
        .eq("to_profile_id", ownProfile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "declined" }) => {
      const { error } = await supabase.from("interests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      toast.success(vars.status === "accepted" ? "Interest accepted!" : "Interest declined.");
      void queryClient.invalidateQueries({ queryKey: ["received-interests-list"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update interest status.")),
  });

  const currentQuery = tab === "received" ? receivedQuery : sentQuery;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Interests & Responses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track alliance expressions of interest you have received and sent.
          </p>
        </div>

        <div className="flex rounded-xl border bg-muted p-1">
          <Button
            variant={tab === "received" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTab("received")}
            className="rounded-lg"
          >
            <Inbox className="mr-1.5 h-4 w-4" />
            Received ({receivedQuery.data?.length ?? 0})
          </Button>
          <Button
            variant={tab === "sent" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTab("sent")}
            className="rounded-lg"
          >
            <Send className="mr-1.5 h-4 w-4" />
            Sent ({sentQuery.data?.length ?? 0})
          </Button>
        </div>
      </div>

      {currentQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : currentQuery.isError ? (
        <ErrorState title="Could not load interests" onRetry={() => void currentQuery.refetch()} />
      ) : !currentQuery.data?.length ? (
        <EmptyState
          title={
            tab === "received"
              ? "No received interests yet"
              : "You have not expressed interest in any profiles yet"
          }
          description={
            tab === "received"
              ? "When other members express interest in your profile, they will appear here for your review."
              : "Search profiles and click 'Express Interest' to connect with prospective alliances."
          }
        >
          {tab === "sent" ? (
            <div className="mt-4">
              <Button asChild>
                <Link to="/search">
                  <Search className="mr-1.5 h-4 w-4" />
                  Search Profiles
                </Link>
              </Button>
            </div>
          ) : null}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {tab === "received"
            ? (receivedQuery.data ?? []).map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {item.profiles?.full_name || "A Community Member"}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Received on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {item.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateStatus.mutate({ id: item.id, status: "accepted" })}
                        >
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: item.id, status: "declined" })}
                        >
                          <X className="mr-1 h-3.5 w-3.5" />
                          Decline
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))
            : (sentQuery.data ?? []).map((item) => {
                const target = item.matrimonial_profiles;
                return (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {target?.display_name || "Member Profile"}
                          </span>
                          {target?.profile_code ? (
                            <span className="text-xs text-primary font-medium">
                              ({target.profile_code})
                            </span>
                          ) : null}
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {target?.city ? `${target.city}, ` : ""}
                          {target?.state || ""} • Sent on{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {target?.id ? (
                        <Button asChild size="sm" variant="outline">
                          <Link to="/profile/$id" params={{ id: target.id }}>
                            View Profile
                          </Link>
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "accepted") {
    return <Badge className="bg-emerald-600 text-xs">Accepted</Badge>;
  }
  if (status === "declined") {
    return (
      <Badge variant="destructive" className="text-xs">
        Declined
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs">
      Pending
    </Badge>
  );
}
