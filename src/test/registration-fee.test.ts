import { describe, it, expect } from "vitest";
import {
  resolveMembershipState,
  REGISTRATION_FEE_INR,
  REGISTRATION_FEE_PAISE,
  REGISTRATION_PLAN_NAME,
} from "@/lib/membership-status";
import { ONE_TIME_REGISTRATION_FEE_INR, ONE_TIME_REGISTRATION_FEE_PAISE } from "@/lib/site";

describe("Registration Fee Constants", () => {
  it("enforces ₹999 one-time registration fee and 99900 paise value", () => {
    expect(REGISTRATION_FEE_INR).toBe(999);
    expect(REGISTRATION_FEE_PAISE).toBe(99900);
    expect(ONE_TIME_REGISTRATION_FEE_INR).toBe(999);
    expect(ONE_TIME_REGISTRATION_FEE_PAISE).toBe(99900);
    expect(REGISTRATION_PLAN_NAME).toBe("One-Time Registration");
  });
});

describe("Membership State Machine", () => {
  it("resolves Profile Incomplete when profile is missing or declaration is false", () => {
    const noProfile = resolveMembershipState({
      hasProfile: false,
      declarationAccepted: false,
    });
    expect(noProfile.state).toBe("Profile Incomplete");
    expect(noProfile.isPaid).toBe(false);
    expect(noProfile.canAccessMemberFeatures).toBe(false);

    const undeclared = resolveMembershipState({
      hasProfile: true,
      declarationAccepted: false,
    });
    expect(undeclared.state).toBe("Profile Incomplete");
  });

  it("resolves Payment Pending when profile is complete but registration fee is unpaid", () => {
    const pending = resolveMembershipState({
      hasProfile: true,
      declarationAccepted: true,
      membershipStatus: "pending",
      paymentStatus: "pending",
    });
    expect(pending.state).toBe("Payment Pending");
    expect(pending.isPaid).toBe(false);
    expect(pending.canAccessMemberFeatures).toBe(false);
  });

  it("resolves Payment Processing during active gateway confirmation", () => {
    const processing = resolveMembershipState({
      hasProfile: true,
      declarationAccepted: true,
      paymentStatus: "processing",
    });
    expect(processing.state).toBe("Payment Processing");
    expect(processing.isPaid).toBe(false);
  });

  it("resolves Payment Failed when gateway transaction failed", () => {
    const failed = resolveMembershipState({
      hasProfile: true,
      declarationAccepted: true,
      paymentStatus: "failed",
    });
    expect(failed.state).toBe("Payment Failed");
    expect(failed.isPaid).toBe(false);
    expect(failed.canAccessMemberFeatures).toBe(false);
  });

  it("resolves Membership Active for paid lifetime member", () => {
    const active = resolveMembershipState({
      hasProfile: true,
      declarationAccepted: true,
      membershipStatus: "active",
      paymentStatus: "successful",
    });
    expect(active.state).toBe("Membership Active");
    expect(active.isPaid).toBe(true);
    expect(active.canAccessMemberFeatures).toBe(true);
  });

  it("resolves Refund Pending and Refunded states", () => {
    const refundPending = resolveMembershipState({
      hasProfile: true,
      declarationAccepted: true,
      paymentStatus: "refund_pending",
    });
    expect(refundPending.state).toBe("Refund Pending");
    expect(refundPending.canAccessMemberFeatures).toBe(false);

    const refunded = resolveMembershipState({
      hasProfile: true,
      declarationAccepted: true,
      paymentStatus: "refunded",
    });
    expect(refunded.state).toBe("Refunded");
    expect(refunded.isPaid).toBe(false);
  });

  it("resolves Suspended when account or membership is suspended", () => {
    const suspended = resolveMembershipState({
      hasProfile: true,
      declarationAccepted: true,
      membershipStatus: "suspended",
      paymentStatus: "successful",
    });
    expect(suspended.state).toBe("Suspended");
    expect(suspended.canAccessMemberFeatures).toBe(false);
  });
});
