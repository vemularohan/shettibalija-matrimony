import type { Tables } from "@/integrations/supabase/types";

export type MembershipState =
  | "Profile Incomplete"
  | "Payment Pending"
  | "Payment Processing"
  | "Payment Failed"
  | "Payment Successful"
  | "Membership Active"
  | "Refund Pending"
  | "Refunded"
  | "Suspended";

export const REGISTRATION_FEE_PAISE = 99900;
export const REGISTRATION_FEE_INR = 999;
export const REGISTRATION_PLAN_NAME = "One-Time Registration";

export type ResolvedMembership = {
  state: MembershipState;
  isPaid: boolean;
  canAccessMemberFeatures: boolean;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  labelEn: string;
  labelTe: string;
  descriptionEn: string;
  descriptionTe: string;
};

export function resolveMembershipState(params: {
  hasProfile: boolean;
  declarationAccepted?: boolean;
  profileStatus?: string | null | undefined;
  membershipStatus?: string | null | undefined;
  paymentStatus?: string | null | undefined;
}): ResolvedMembership {
  const {
    hasProfile,
    declarationAccepted = false,
    profileStatus,
    membershipStatus,
    paymentStatus,
  } = params;

  // 1. Profile incomplete
  if (!hasProfile || !declarationAccepted) {
    return {
      state: "Profile Incomplete",
      isPaid: false,
      canAccessMemberFeatures: false,
      badgeVariant: "outline",
      labelEn: "Profile Incomplete",
      labelTe: "ప్రొఫైల్ అసంపూర్ణం",
      descriptionEn: "Complete your matrimonial profile before fee payment and activation.",
      descriptionTe: "రుసుము చెల్లింపు మరియు యాక్టివేషన్‌కు ముందు మీ ప్రొఫైల్‌ను పూర్తి చేయండి.",
    };
  }

  // 2. Suspended
  if (profileStatus === "suspended" || membershipStatus === "suspended") {
    return {
      state: "Suspended",
      isPaid: paymentStatus === "successful",
      canAccessMemberFeatures: false,
      badgeVariant: "destructive",
      labelEn: "Suspended",
      labelTe: "నిలిపివేయబడింది",
      descriptionEn: "This account has been suspended by community administration.",
      descriptionTe: "ఈ ఖాతా సమాజ నిర్వాహకులచే నిలిపివేయబడింది.",
    };
  }

  // 3. Refunded
  if (paymentStatus === "refunded" || membershipStatus === "refunded") {
    return {
      state: "Refunded",
      isPaid: false,
      canAccessMemberFeatures: false,
      badgeVariant: "secondary",
      labelEn: "Refunded",
      labelTe: "వాపసు చేయబడింది",
      descriptionEn: "Registration fee has been refunded. Matrimonial access is closed.",
      descriptionTe: "రిజిస్ట్రేషన్ రుసుము వాపసు చేయబడింది.",
    };
  }

  // 4. Refund Pending
  if (paymentStatus === "refund_pending" || membershipStatus === "refund_pending") {
    return {
      state: "Refund Pending",
      isPaid: true,
      canAccessMemberFeatures: false,
      badgeVariant: "secondary",
      labelEn: "Refund Pending",
      labelTe: "వాపసు పెండింగ్‌లో ఉంది",
      descriptionEn: "A refund request is currently being processed.",
      descriptionTe: "వాపసు అభ్యర్థన ప్రస్తుతం ప్రాసెస్ చేయబడుతోంది.",
    };
  }

  // 5. Membership Active (Paid Lifetime Member)
  if (membershipStatus === "active") {
    return {
      state: "Membership Active",
      isPaid: true,
      canAccessMemberFeatures: true,
      badgeVariant: "default",
      labelEn: "Membership Active",
      labelTe: "సభ్యత్వం యాక్టివ్",
      descriptionEn: "Your Settibalija Matrimony membership is active. Pay once, no renewals.",
      descriptionTe:
        "మీ సెట్టిబలిజ మ్యాట్రిమోనీ సభ్యత్వం యాక్టివ్‌గా ఉంది. ఒకే చెల్లింపు, పునరుద్ధరణలు లేవు.",
    };
  }

  // 6. Payment Successful (awaiting final membership sync)
  if (paymentStatus === "successful") {
    return {
      state: "Payment Successful",
      isPaid: true,
      canAccessMemberFeatures: true,
      badgeVariant: "default",
      labelEn: "Payment Successful",
      labelTe: "చెల్లింపు విజయవంతమైంది",
      descriptionEn: "Payment verified. Activating lifetime membership.",
      descriptionTe: "చెల్లింపు ధృవీకరించబడింది. జీవితకాల సభ్యత్వం సక్రియం చేయబడుతోంది.",
    };
  }

  // 7. Payment Processing
  if (paymentStatus === "processing") {
    return {
      state: "Payment Processing",
      isPaid: false,
      canAccessMemberFeatures: false,
      badgeVariant: "secondary",
      labelEn: "Payment Processing",
      labelTe: "చెల్లింపు ప్రాసెసింగ్",
      descriptionEn: "Your payment verification is in progress. Please check back in a moment.",
      descriptionTe: "మీ చెల్లింపు ధృవీకరణ జరుగుతోంది. దయచేసి కొద్దిసేపటి తర్వాత పరిశీలించండి.",
    };
  }

  // 8. Payment Failed
  if (paymentStatus === "failed") {
    return {
      state: "Payment Failed",
      isPaid: false,
      canAccessMemberFeatures: false,
      badgeVariant: "destructive",
      labelEn: "Payment Failed",
      labelTe: "చెల్లింపు విఫలమైంది",
      descriptionEn: "Your previous payment attempt was not completed. Please try again.",
      descriptionTe: "మీ మునుపటి చెల్లింపు ప్రయత్నం పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
    };
  }

  // 9. Payment Pending (Default for profile complete, unpaid)
  return {
    state: "Payment Pending",
    isPaid: false,
    canAccessMemberFeatures: false,
    badgeVariant: "outline",
    labelEn: "Payment Pending",
    labelTe: "చెల్లింపు పెండింగ్‌లో ఉంది",
    descriptionEn: "One-time registration fee of ₹999 required to activate your membership.",
    descriptionTe: "మీ సభ్యత్వాన్ని సక్రియం చేయడానికి ₹999 ఒకేసారి రిజిస్ట్రేషన్ రుసుము అవసరం.",
  };
}
