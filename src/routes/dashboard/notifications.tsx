import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/dashboard/notifications")({
  component: DashboardNotificationsPage,
});

function DashboardNotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["notifications-list", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("owner_id", user.id)
        .is("read_at", null);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      void queryClient.invalidateQueries({ queryKey: ["notifications-list"] });
      void queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update notifications.")),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity updates, match interests, and status alerts for your profile.
          </p>
        </div>

        {notificationsQuery.data?.some((n) => !n.read_at) ? (
          <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
            <CheckCheck className="mr-1.5 h-4 w-4" />
            Mark all read
          </Button>
        ) : null}
      </div>

      {notificationsQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : notificationsQuery.isError ? (
        <ErrorState
          title="Could not load notifications"
          onRetry={() => void notificationsQuery.refetch()}
        />
      ) : !notificationsQuery.data?.length ? (
        <EmptyState
          title="No notifications yet"
          description="When members express interest or admin approves your profile, you will receive updates here."
        />
      ) : (
        <div className="space-y-3">
          {notificationsQuery.data.map((item) => (
            <Card
              key={item.id}
              className={!item.read_at ? "border-primary/40 bg-primary/[0.02]" : ""}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-2 ${!item.read_at ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
