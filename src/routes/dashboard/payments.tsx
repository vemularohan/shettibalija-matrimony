import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  Receipt,
  Crown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMembership, useOwnMatrimonialProfile } from "@/hooks/use-member-data";
import { supabase } from "@/integrations/supabase/client";
import { formatINRFromPaise } from "@/lib/format";
import { MemberPageHeader } from "@/components/dashboard/member-page-header";
import { useLanguage } from "@/lib/i18n";
import { ONE_TIME_REGISTRATION_FEE_INR } from "@/lib/site";
import { resolveMembershipState } from "@/lib/membership-status";

export const Route = createFileRoute("/dashboard/payments")({
  component: DashboardPaymentsPage,
});

export function DashboardPaymentsPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isTe = lang === "te";

  const ownProfileQuery = useOwnMatrimonialProfile();
  const profile = ownProfileQuery.data;
  const membershipQuery = useActiveMembership();
  const membership = membershipQuery.data;

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

  const latestPayment = paymentsQuery.data?.[0];
  const isPaid = membership?.status === "active";

  const statusInfo = resolveMembershipState({
    hasProfile: Boolean(profile?.id),
    declarationAccepted: Boolean(profile?.declaration_accepted),
    profileStatus: profile?.moderation_status,
    membershipStatus: membership?.status,
    paymentStatus: latestPayment?.status,
  });

  return (
    <div className="space-y-6">
      <MemberPageHeader
        kicker={isTe ? "రుసుము & సభ్యత్వం" : "Fee & Membership"}
        title={isTe ? "సభ్యత్వ రిజిస్ట్రేషన్ & చెల్లింపులు" : "Membership & Payment History"}
        description={
          isTe
            ? "సెట్టిబలిజ మ్యాట్రిమోనీ ఒకేసారి రిజిస్ట్రేషన్ రుసుము (₹999) మరియు మీ చెల్లింపు రశీదుల వివరాలు ఇక్కడ చూడవచ్చు."
            : "Review your one-time registration fee status, verified receipts, and lifetime membership activation."
        }
      />

      {/* 1. Main Membership Summary Card */}
      <div className="overflow-hidden border border-[#ded5c8] bg-white">
        <div className="border-b border-[#ded5c8] bg-[#FAF8F3] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-[#D1A329]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#24103F]">
              {isTe ? "సభ్యత్వ స్థితి సారాంశం" : "Membership Account Status"}
            </h2>
          </div>
          <Badge
            variant={isPaid ? "default" : "outline"}
            className={
              isPaid ? "bg-[#087333] text-white" : "border-[#D1A329] bg-amber-50 text-amber-900"
            }
          >
            {isTe ? statusInfo.labelTe : statusInfo.labelEn}
          </Badge>
        </div>

        <div className="p-6 sm:p-7">
          {isPaid ? (
            /* Paid Member State */
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-[#087333]">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#24103F]">
                    {isTe
                      ? "మీ సెట్టిబలిజ మ్యాట్రిమోనీ సభ్యత్వం యాక్టివ్‌గా ఉంది."
                      : "Your Settibalija Matrimony membership is active."}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#6B6570]">
                    {isTe
                      ? "ఒకేసారి రిజిస్ట్రేషన్ రుసుము విజయవంతంగా ధృవీకరించబడింది. జీవితకాల సభ్యత్వం కొనసాగుతుంది."
                      : "Your one-time registration fee has been verified. No renewals or recurring charges apply."}
                  </p>
                </div>
              </div>

              {/* Verified Details Grid */}
              <div className="grid gap-4 rounded border border-[#ded5c8] bg-[#FAF8F3] p-4 text-xs sm:grid-cols-3">
                <div>
                  <span className="text-[#6B6570] block">
                    {isTe ? "రిజిస్ట్రేషన్ రుసుము:" : "Registration Fee:"}
                  </span>
                  <span className="font-bold text-sm text-[#24103F]">
                    ₹{ONE_TIME_REGISTRATION_FEE_INR} (One-Time)
                  </span>
                </div>
                <div>
                  <span className="text-[#6B6570] block">
                    {isTe ? "యాక్టివేషన్ తేదీ:" : "Activated On:"}
                  </span>
                  <span className="font-medium text-[#24103F]">
                    {membership?.starts_at
                      ? new Date(membership.starts_at).toLocaleDateString()
                      : "Active"}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B6570] block">
                    {isTe ? "లావాదేవీ రెఫరెన్స్:" : "Transaction ID:"}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#24103F]">
                    {latestPayment?.order_id || latestPayment?.gateway_payment_id || "Verified"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Unpaid Member State */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#D1A329]" />
                  <h3 className="font-serif text-lg font-bold text-[#24103F]">
                    {isTe
                      ? "రిజిస్ట్రేషన్ ఫీజు పెండింగ్‌లో ఉంది: ₹999"
                      : "Registration Fee Pending: ₹999"}
                  </h3>
                </div>
                <p className="text-xs leading-6 text-[#6B6570] max-w-xl">
                  {isTe
                    ? "సెట్టిబలిజ మ్యాట్రిమోనీలో సభ్యత్వాన్ని సక్రియం చేయడానికి మరియు వధూవరుల కుటుంబాలను సంప్రదించడానికి ఒకేసారి రిజిస్ట్రేషన్ రుసుము ₹999 చెల్లించండి. వార్షిక పునరుద్ధరణ లేదు."
                    : "Pay the one-time registration fee of ₹999 to activate your lifetime community membership and unlock direct contact exchange with verified Settibalija families."}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6B6570]">
                  <span>• Pay once</span>
                  <span>• No annual renewal</span>
                  <span>• No recurring charges</span>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="bg-[#087333] hover:bg-[#034B21] text-white shrink-0 font-bold"
              >
                <Link to="/payment">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>
                    {isTe ? "₹999 చెల్లించి యాక్టివేట్ చేయండి" : "Pay ₹999 & Activate Membership"}
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Receipts & Transaction History */}
      <div className="border border-[#ded5c8] bg-white">
        <div className="border-b border-[#ded5c8] bg-[#FAF8F3] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[#24103F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#24103F]">
              {isTe ? "చెల్లింపు రశీదులు & లావాదేవీల రికార్డు" : "Transaction Records & Receipts"}
            </h3>
          </div>
          <span className="text-[11px] text-[#6B6570]">
            {paymentsQuery.data?.length ?? 0} {isTe ? "రికార్డులు" : "records"}
          </span>
        </div>

        <div className="p-6">
          {paymentsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : paymentsQuery.isError ? (
            <ErrorState
              title={isTe ? "చెల్లింపు రికార్డులు లోడ్ కాలేదు" : "Could not load payment records"}
              onRetry={() => void paymentsQuery.refetch()}
            />
          ) : !paymentsQuery.data?.length ? (
            <EmptyState
              title={isTe ? "ఇంకా చెల్లింపులు లేవు" : "No payment records found"}
              description={
                isTe
                  ? "మీ ఖాతాలో ఇంకా ఎలాంటి చెల్లింపు లావాదేవీలు నమోదు కాలేదు."
                  : "You have not completed any online registration payments yet."
              }
            >
              {!isPaid && (
                <div className="mt-4">
                  <Button asChild className="bg-[#087333] hover:bg-[#034B21] text-white text-xs">
                    <Link to="/payment">
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                      {isTe
                        ? "రిజిస్ట్రేషన్ ఫీజు చెల్లించండి (₹999)"
                        : "Pay Registration Fee (₹999)"}
                    </Link>
                  </Button>
                </div>
              )}
            </EmptyState>
          ) : (
            <div className="divide-y divide-[#ded5c8]">
              {paymentsQuery.data.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded border border-[#ded5c8] bg-[#FAF8F3] p-2 text-[#24103F]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#24103F]">
                          {formatINRFromPaise(item.amount_paise)}
                        </span>
                        <Badge
                          variant={item.status === "successful" ? "default" : "outline"}
                          className={
                            item.status === "successful"
                              ? "bg-[#087333] text-white text-[10px]"
                              : "text-[10px] capitalize"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-[#6B6570]">
                        Order ID: <span className="font-mono">{item.order_id || "—"}</span>
                        {item.gateway_payment_id && (
                          <>
                            {" • Payment ID: "}
                            <span className="font-mono">{item.gateway_payment_id}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-[#6B6570] sm:text-right">
                    <div className="flex items-center sm:justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[11px] text-[#087333] font-medium block mt-0.5">
                      {item.status === "successful" ? "One-Time Registration Fee" : "Attempted"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
