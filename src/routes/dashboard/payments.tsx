import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Receipt, Crown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatINRFromPaise } from "@/lib/format";
import { MemberPageHeader } from "@/components/dashboard/member-page-header";

export const Route = createFileRoute("/dashboard/payments")({
  component: DashboardPaymentsPage,
});

function DashboardPaymentsPage() {
  const { user } = useAuth();

  const paymentsQuery = useQuery({
    queryKey: ["payments-history", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <MemberPageHeader
        kicker="Payments"
        title="Payment history"
        description="Receipts and membership records for your account. Keep an order ID ready if you need help with a payment."
        actions={
          <Button asChild className="rounded-none bg-[#24103F] text-white hover:bg-[#341753]">
            <Link to="/membership">
              <Crown className="mr-1.5 h-4 w-4 text-[#D1A329]" />
              View membership
            </Link>
          </Button>
        }
      />

      {paymentsQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : paymentsQuery.isError ? (
        <ErrorState
          title="Could not load payment records"
          onRetry={() => void paymentsQuery.refetch()}
        />
      ) : !paymentsQuery.data?.length ? (
        <EmptyState
          title="No payment history"
          description="You do not have any paid invoices or online transactions yet."
        >
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/membership">Browse Membership Plans</Link>
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {paymentsQuery.data.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border p-2 bg-muted text-muted-foreground">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {formatINRFromPaise(item.amount_paise)}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleDateString()} • Order:{" "}
                      {item.order_id || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
