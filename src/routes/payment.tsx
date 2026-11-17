import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  UserCheck,
  HelpCircle,
  PhoneCall,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import {
  useActiveMembership,
  useOwnMatrimonialProfile,
  useOwnPrivateDetails,
  useOwnPreferences,
  useOwnPhotos,
} from "@/hooks/use-member-data";
import { createPaidOrder, verifyPaidOrder } from "@/functions/payments";
import { SettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import { profileCompletion } from "@/lib/profile-completion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_NAME, SITE_NAME_TE, ONE_TIME_REGISTRATION_FEE_INR } from "@/lib/site";
import { resolveMembershipState } from "@/lib/membership-status";

export const Route = createFileRoute("/payment")({
  component: RegistrationPaymentPage,
  head: () => ({
    meta: [
      { title: `Complete Your Registration | ${SITE_NAME}` },
      {
        name: "description",
        content: `Pay the one-time registration fee of ₹${ONE_TIME_REGISTRATION_FEE_INR} to activate your Settibalija Matrimony membership.`,
      },
    ],
  }),
});

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset["razorpay"] = "true";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function RegistrationPaymentPage() {
  const { user, account, loading: authLoading, isAdmin, isModerator } = useAuth();
  const { lang, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const isTe = lang === "te";

  const ownProfileQuery = useOwnMatrimonialProfile();
  const profile = ownProfileQuery.data;
  const privateDetailsQuery = useOwnPrivateDetails(profile?.id);
  const preferencesQuery = useOwnPreferences(profile?.id);
  const photosQuery = useOwnPhotos(profile?.id);
  const membershipQuery = useActiveMembership();

  const [processing, setProcessing] = useState(false);
  const [gatewayModalOpen, setGatewayModalOpen] = useState(false);

  const createOrder = useServerFn(createPaidOrder);
  const verifyOrder = useServerFn(verifyPaidOrder);

  const completion = profileCompletion(
    profile ?? null,
    privateDetailsQuery.data ?? null,
    preferencesQuery.data ?? null,
    photosQuery.data?.length ?? 0,
  );

  const membershipStatusInfo = resolveMembershipState({
    hasProfile: Boolean(profile?.id),
    declarationAccepted: Boolean(profile?.declaration_accepted),
    profileStatus: profile?.moderation_status,
    membershipStatus: membershipQuery.data?.status,
  });

  // 1. Loading state
  if (authLoading || ownProfileQuery.isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F3]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#D1A329]" />
          <p className="mt-3 text-sm text-[#6B6570]">
            {isTe ? "వివరాలను లోడ్ చేస్తున్నాము..." : "Loading registration details..."}
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate
  if (!user) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#FAF8F3] px-4 py-16">
        <div className="w-full max-w-md border border-[#ded5c8] bg-white p-7 text-center shadow-sm sm:p-9">
          <SettibalijaLogo size="md" linkToHome />
          <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F3] text-[#24103F]">
            <Lock className="h-6 w-6 text-[#D1A329]" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-[#24103F]">
            {isTe ? "లాగిన్ అవసరం" : "Sign In Required"}
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[#6B6570]">
            {isTe
              ? "మీ రిజిస్ట్రేషన్ ఫీజు చెల్లించడానికి దయచేసి మీ ఖాతాలోకి ప్రవేశించండి."
              : "Please sign in to your account to complete your one-time registration fee payment."}
          </p>
          <div className="mt-7 flex flex-col gap-2.5">
            <Link
              to="/login"
              search={{ returnTo: "/payment" }}
              className="sbm-button sbm-button--primary w-full"
            >
              <span>{isTe ? "లాగిన్ చేయండి" : "Sign in to Continue"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="sbm-button sbm-button--outline w-full">
              {isTe ? "కొత్త ఖాతా సృష్టించండి" : "Create Account"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Staff / Admin bypass notice
  if (isAdmin || isModerator) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F3] px-4 py-16">
        <div className="w-full max-w-md border border-[#087333]/30 bg-white p-8 text-center shadow-sm">
          <SettibalijaLogo size="md" linkToHome />
          <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#087333]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-[#24103F]">Staff Account</h1>
          <p className="mt-3 text-[13px] leading-6 text-[#6B6570]">
            You are signed in as an administrator/moderator. Staff accounts do not require
            matrimonial registration fees.
          </p>
          <div className="mt-7">
            <Link to="/admin" className="sbm-button sbm-button--primary w-full">
              Go to Admin Operations Console
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Already Paid / Active Member Notice
  if (membershipStatusInfo.isPaid && membershipStatusInfo.state === "Membership Active") {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#FAF8F3] px-4 py-16">
        <div className="w-full max-w-lg border border-[#087333]/40 bg-white p-8 text-center shadow-sm sm:p-10">
          <SettibalijaLogo size="md" linkToHome />
          <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#087333]/10 text-[#087333]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <Badge className="mt-5 bg-[#087333] text-white">
            {isTe ? "సభ్యత్వం యాక్టివ్" : "Membership Active"}
          </Badge>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#24103F]">
            {isTe ? "మీ సభ్యత్వం యాక్టివ్‌గా ఉంది" : "Your Membership is Active"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B6570]">
            {isTe
              ? "మీ సెట్టిబలిజ మ్యాట్రిమోనీ జీవితకాల సభ్యత్వ రిజిస్ట్రేషన్ రుసుము ఇప్పటికే విజయవంతంగా పూర్తయింది. మీరు ఎలాంటి అదనపు రుసుము చెల్లించాల్సిన అవసరం లేదు."
              : "Your Settibalija Matrimony membership is active. You have paid the one-time registration fee. No annual renewal or recurring charges apply."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard" className="sbm-button sbm-button--primary">
              <span>{isTe ? "డ్యాష్‌బోర్డ్‌కు వెళ్లండి" : "Go to Member Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/dashboard/payments" className="sbm-button sbm-button--outline">
              {isTe ? "రసీదు చూడండి" : "View Receipt"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Incomplete Profile Notice
  if (!profile || !profile.declaration_accepted) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#FAF8F3] px-4 py-16">
        <div className="w-full max-w-lg border border-[#D1A329] bg-white p-8 text-center shadow-sm sm:p-10">
          <SettibalijaLogo size="md" linkToHome />
          <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <AlertCircle className="h-8 w-8" />
          </div>
          <Badge variant="outline" className="mt-5 border-[#D1A329] text-[#24103F]">
            {isTe ? "ప్రొఫైల్ అసంపూర్ణం" : "Profile Incomplete"}
          </Badge>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#24103F]">
            {isTe ? "మొదట ప్రొఫైల్ పూర్తి చేయండి" : "Complete Your Profile First"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B6570]">
            {isTe
              ? "రిజిస్ట్రేషన్ రుసుము చెల్లించడానికి ముందు మీ మ్యాట్రిమోనీ ప్రొఫైల్ మరియు డిక్లరేషన్‌ను సమర్పించండి."
              : "Please complete and submit your matrimonial profile before proceeding to registration fee payment."}
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/onboarding" className="sbm-button sbm-button--primary">
              <span>{isTe ? "ఆన్‌బోర్డింగ్ కొనసాగించండి" : "Continue Profile Onboarding"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 6. Payment initiation handler
  async function handlePaymentInitiation() {
    setProcessing(true);
    try {
      const order = await createOrder();

      if (!order.ok) {
        if ("alreadyActive" in order && order.alreadyActive) {
          toast.info(order.message);
          void navigate({ to: "/dashboard" });
          return;
        }

        if ("mode" in order && order.mode === "gateway_pending") {
          // Prepared pre-gateway phase requirement:
          // Do not invent fake success, explain truthfully to the user
          setGatewayModalOpen(true);
          return;
        }

        toast.error(order.message || "Could not initiate payment. Please try again.");
        return;
      }

      // Razorpay gateway flow when credentials exist
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        toast.error("Payment window could not be loaded. Please check your internet connection.");
        return;
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: SITE_NAME,
        description: "One-Time Registration Fee",
        order_id: order.orderId,
        prefill: {
          name: profile?.display_name || user?.user_metadata?.["full_name"] || "",
          email: user?.email || "",
          contact: account?.phone || "",
        },
        theme: { color: "#24103F" },
        modal: {
          ondismiss: () => setProcessing(false),
        },
        handler: async (response: RazorpayResponse) => {
          try {
            const verification = await verifyOrder({
              data: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });

            if (!verification.ok) {
              toast.error(verification.message);
              return;
            }

            toast.success("Payment verified! Your Settibalija Matrimony membership is now active.");
            void navigate({ to: "/dashboard" });
          } catch (verErr) {
            console.error("Payment verification failure:", verErr);
            toast.error("Payment verification could not be completed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
      });

      checkout.open();
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Payment could not be started right now. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] pb-24 pt-8">
      {/* Top Header */}
      <header className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b border-[#ded5c8] pb-5">
          <div className="flex items-center gap-3">
            <SettibalijaLogo size="sm" linkToHome />
            <div>
              <p className="font-serif text-sm font-bold text-[#24103F]">
                {isTe ? SITE_NAME_TE : SITE_NAME}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#a37d1c]">
                {isTe ? "రిజిస్ట్రేషన్ ప్రక్రియ" : "Registration Completion"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6B6570]">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-1.5 py-0.5 ${lang === "en" ? "font-bold text-[#24103F]" : ""}`}
            >
              EN
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setLanguage("te")}
              className={`px-1.5 py-0.5 ${lang === "te" ? "font-bold text-[#24103F]" : ""}`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        {/* Registration Payment Card */}
        <div className="overflow-hidden border border-[#ded5c8] bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-[#ded5c8] bg-[#24103F] px-6 py-8 text-white sm:px-10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D1A329]">
                {SITE_NAME}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <Lock size={13} className="text-[#D1A329]" />
                <span>{isTe ? "సురక్షిత లావాదేవీ" : "Secure Payment"}</span>
              </div>
            </div>

            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {isTe ? "మీ రిజిస్ట్రేషన్ పూర్తి చేయండి" : "Complete Your Registration"}
            </h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="font-serif text-5xl font-bold text-[#D1A329]">
                ₹{ONE_TIME_REGISTRATION_FEE_INR}
              </span>
              <span className="text-sm font-medium text-white/80">
                {isTe
                  ? "ఒకేసారి రిజిస్ట్రేషన్ రుసుము (జీవితకాల సభ్యత్వం)"
                  : "One-Time Registration Fee (Lifetime Access)"}
              </span>
            </div>

            <p className="mt-2 text-[13px] font-medium text-[#FAF8F3]/90">
              {isTe
                ? "ఒక్కసారి మాత్రమే చెల్లించండి. వార్షిక పునరుద్ధరణ లేదు. పునరావృత ఛార్జీలు లేవు."
                : "Pay once. No annual renewal. No recurring charges."}
            </p>
          </div>

          {/* Member & Profile Summary Row */}
          <div className="grid border-b border-[#ded5c8] bg-[#FAF8F3] p-6 sm:grid-cols-3 sm:gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6570]">
                {isTe ? "ఖాతా ఇమెయిల్" : "Member Account"}
              </span>
              <p className="mt-1 font-mono text-xs font-semibold text-[#24103F] break-all">
                {user.email}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6570]">
                {isTe ? "ప్రొఫైల్ కోడ్" : "Profile ID"}
              </span>
              <p className="mt-1 font-mono text-xs font-semibold text-[#24103F]">
                {profile.profile_code || "SB-MEMBER"}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6570]">
                {isTe ? "ప్రొఫైల్ పూర్తితనం" : "Profile Status"}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-bold text-[#087333]">
                  {completion.percent}% {isTe ? "పూర్తయింది" : "Complete"}
                </span>
                <CheckCircle2 size={14} className="text-[#087333]" />
              </div>
            </div>
          </div>

          {/* Fee Inclusions & Community Benefits */}
          <div className="p-6 sm:p-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#24103F]">
              {isTe
                ? "ఈ రుసుముతో మీకు లభించే ప్రయోజనాలు:"
                : "What is included with your registration:"}
            </h2>

            <ul className="mt-5 space-y-3.5 text-xs text-[#3D354A]">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#087333]" />
                <span>
                  <strong>
                    {isTe ? "జీవితకాల ప్రొఫైల్ ప్రచురణ:" : "Lifetime Profile Publication:"}
                  </strong>{" "}
                  {isTe
                    ? "మీ ప్రొఫైల్ సమాజ అన్వేషణలో ప్రదర్శించబడుతుంది; ఎలాంటి పునరుద్ధరణ ఫీజులు ఉండవు."
                    : "Your matrimonial profile remains published in community discovery without recurring subscription renewals."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#087333]" />
                <span>
                  <strong>
                    {isTe ? "సంబంధాల అన్వేషణ & ఆసక్తులు:" : "Community Discovery & Interests:"}
                  </strong>{" "}
                  {isTe
                    ? "సెట్టిబలిజ వధూవరుల వివరాలను వెతకడం, ఆసక్తులను పంపడం మరియు స్వీకరించడం."
                    : "Unlimited discovery of Settibalija brides and grooms, sending and receiving expressions of interest."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#087333]" />
                <span>
                  <strong>
                    {isTe ? "ప్రత్యక్ష కుటుంబ పరిచయాలు:" : "Direct Contact Requests:"}
                  </strong>{" "}
                  {isTe
                    ? "పరస్పర ఆమోదం పొందిన తర్వాత కుటుంబాల ఫోన్ నంబర్లు మరియు వివరాలను పంచుకోవడం."
                    : "Mutual consent-based contact exchange directly between respectful families."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#087333]" />
                <span>
                  <strong>
                    {isTe
                      ? "గోప్యతా నియంత్రణ & ఫోటో యాక్సెస్:"
                      : "Verified Photo & Privacy Protection:"}
                  </strong>{" "}
                  {isTe
                    ? "ధృవీకరించబడిన సభ్యులకు మాత్రమే ఫోటోలు మరియు వ్యక్తిగత వివరాల నియంత్రణ."
                    : "Control over private photos and horoscope documents; visible only to verified community members."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#087333]" />
                <span>
                  <strong>{isTe ? "సమాజ కార్యాలయ మద్దతు:" : "Community Office Assistance:"}</strong>{" "}
                  {isTe
                    ? "మాన్యువల్ ప్రొఫైల్ సమీక్ష, ఫోన్ ద్వారా సహాయం మరియు విశ్వసనీయ పరిచయాలు."
                    : "Manual profile verification, administrative assistance, and trusted family mediation."}
                </span>
              </li>
            </ul>

            {/* Payment Summary Box */}
            <div className="mt-8 rounded border border-[#ded5c8] bg-[#FAF8F3] p-5">
              <div className="flex items-center justify-between text-xs text-[#6B6570]">
                <span>{isTe ? "రిజిస్ట్రేషన్ రుసుము" : "Registration Fee"}</span>
                <span>₹{ONE_TIME_REGISTRATION_FEE_INR}.00</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#6B6570]">
                <span>{isTe ? "చెల్లుబాటు కాలం" : "Validity"}</span>
                <span className="font-semibold text-[#087333]">
                  {isTe ? "జీవితకాలం (పునరుద్ధరణ లేదు)" : "Lifetime (No Renewal)"}
                </span>
              </div>
              <div className="mt-3 border-t border-[#ded5c8] pt-3 flex items-center justify-between text-sm font-bold text-[#24103F]">
                <span>{isTe ? "మొత్తం చెల్లించవలసినది" : "Total Amount Payable"}</span>
                <span className="text-lg text-[#24103F]">₹{ONE_TIME_REGISTRATION_FEE_INR}</span>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handlePaymentInitiation}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 rounded bg-[#087333] px-6 py-4 font-sans text-base font-bold text-white shadow-sm transition-all hover:bg-[#034B21] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{isTe ? "ప్రాసెస్ అవుతోంది..." : "Initiating Payment..."}</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>
                      {isTe
                        ? `₹${ONE_TIME_REGISTRATION_FEE_INR} చెల్లించి సభ్యత్వాన్ని సక్రియం చేయండి`
                        : `Pay ₹${ONE_TIME_REGISTRATION_FEE_INR} & Activate Membership`}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#6B6570]">
                <Lock size={12} className="text-[#087333]" />
                <span>
                  {isTe
                    ? "256-బిట్ ఎన్‌క్రిప్షన్ ద్వారా సురక్షితమైన చెల్లింపు"
                    : "Encrypted and secured. Membership activates immediately upon server verification."}
                </span>
              </div>
            </div>

            {/* Legal and Policy Links */}
            <div className="mt-10 border-t border-[#ded5c8] pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6570]">
                {isTe ? "చెల్లింపు నిబంధనలు & విధానాలు" : "Payment & Legal Policies"}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-[#6B6570]">
                {isTe
                  ? "రిజిస్ట్రేషన్ ఫీజు చెల్లించడం ద్వారా మీరు మా నిబంధనలను అంగీకరిస్తున్నారు. డిజిటల్ సభ్యత్వ సేవలు తక్షణమే ప్రారంభమవుతాయి."
                  : "By completing payment, you agree to our terms. As digital matrimonial services activate upon verification, fees are handled under our refund policy."}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <Link
                  to="/refund"
                  target="_blank"
                  className="font-medium text-[#24103F] hover:text-[#087333] hover:underline"
                >
                  {isTe ? "వాపసు & రద్దు విధానం" : "Refund & Cancellation Policy"}
                </Link>
                <span className="text-[#ded5c8]">•</span>
                <Link
                  to="/privacy"
                  target="_blank"
                  className="font-medium text-[#24103F] hover:text-[#087333] hover:underline"
                >
                  {isTe ? "గోప్యతా విధానం" : "Privacy Policy"}
                </Link>
                <span className="text-[#ded5c8]">•</span>
                <Link
                  to="/terms"
                  target="_blank"
                  className="font-medium text-[#24103F] hover:text-[#087333] hover:underline"
                >
                  {isTe ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Support Help Banner */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#ded5c8] bg-white p-5 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF8F3] text-[#24103F]">
              <PhoneCall size={16} className="text-[#D1A329]" />
            </div>
            <div>
              <p className="font-bold text-[#24103F]">
                {isTe ? "సహాయం కావాలా?" : "Need assistance with your registration fee?"}
              </p>
              <p className="text-[#6B6570]">
                {isTe
                  ? "మా సమాజ సహాయ బృందం మీకు తోడ్పడటానికి సిద్ధంగా ఉంది."
                  : "Contact our community office for guidance or offline verification support."}
              </p>
            </div>
          </div>
          <Link to="/contact" className="sbm-button sbm-button--outline shrink-0 text-xs">
            {isTe ? "మమ్మల్ని సంప్రదించండి" : "Contact Office"}
          </Link>
        </div>
      </main>

      {/* Gateway Preparation Informational Modal */}
      {gatewayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md border border-[#ded5c8] bg-white p-7 text-center shadow-lg">
            <SettibalijaLogo size="sm" linkToHome />
            <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-[#D1A329]">
              <Clock size={24} />
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-[#24103F]">
              {isTe ? "చెల్లింపు గేట్‌వే తయారీలో ఉంది" : "Payment Gateway in Preparation"}
            </h3>
            <p className="mt-3 text-xs leading-6 text-[#6B6570]">
              {isTe
                ? `సెట్టిబలిజ మ్యాట్రిమోనీలో Razorpay ఆన్‌లైన్ చెల్లింపుల ప్రక్రియను ఖరారు చేస్తున్నాము. మీ ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది. ఆన్‌లైన్ గేట్‌వే ప్రత్యక్షమైన వెంటనే మీరు ₹${ONE_TIME_REGISTRATION_FEE_INR} చెల్లించి సభ్యత్వాన్ని సక్రియం చేసుకోవచ్చు.`
                : `The Razorpay payment gateway integration is currently in final verification for production. Your matrimonial profile is safely stored. Online fee payment of ₹${ONE_TIME_REGISTRATION_FEE_INR} will open once gateway credentials are live. Verified payment is required for membership activation.`}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="button"
                className="w-full bg-[#24103F] text-white hover:bg-[#341753]"
                onClick={() => setGatewayModalOpen(false)}
              >
                {isTe ? "సరే, అర్థమైంది" : "Understood"}
              </Button>
              <Link to="/dashboard" className="text-xs text-[#087333] hover:underline pt-1">
                {isTe ? "డ్యాష్‌బోర్డ్‌కు వెళ్లండి" : "Return to Member Dashboard"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
