import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PhoneCall, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { useOwnMatrimonialProfile } from "@/hooks/use-member-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/contacts")({
  component: DashboardContactsPage,
});

function DashboardContactsPage() {
  const { user } = useAuth();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const ownProfile = ownProfileQuery.data;

  const contactsQuery = useQuery({
    queryKey: ["contact-requests-list", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("contact_requests")
        .select(
          "id, status, created_at, to_profile_id, matrimonial_profiles:to_profile_id(display_name, profile_code)",
        )
        .eq("from_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Contact Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Requests for candidate and guardian contact phone numbers.
        </p>
      </div>

      {contactsQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : contactsQuery.isError ? (
        <ErrorState
          title="Could not load contact requests"
          onRetry={() => void contactsQuery.refetch()}
        />
      ) : !contactsQuery.data?.length ? (
        <EmptyState
          title="No contact requests sent yet"
          description="When you view an authorized profile, you can request direct family contact numbers."
        />
      ) : (
        <div className="space-y-3">
          {contactsQuery.data.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">
                    Request for {item.matrimonial_profiles?.display_name || "Member Profile"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Requested on {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={item.status === "approved" ? "default" : "secondary"}>
                  {item.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
