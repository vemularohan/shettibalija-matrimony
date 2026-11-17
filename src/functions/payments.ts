import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { ONE_TIME_REGISTRATION_FEE_PAISE } from "@/lib/site";

type AuthContext = { supabase: SupabaseClient<Database>; userId: string };

/**
 * Initiates Razorpay Order for the ₹999 One-Time Registration Fee.
 * Idempotent: rejects duplicate orders if membership is already active.
 * Safe fallback: returns graceful gateway_pending mode if keys are not yet configured.
 */
export const createPaidOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z
      .object({
        planId: z.string().uuid().optional(),
      })
      .optional(),
  )
  .handler(async ({ context }) => {
    const { supabase, userId } = context as AuthContext;

    // 1. Guard against duplicate membership activation
    const { data: existingActive } = await supabase
      .from("memberships")
      .select("id, status")
      .eq("owner_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (existingActive) {
      return {
        ok: false as const,
        alreadyActive: true as const,
        message: "Your Settibalija Matrimony membership is already active.",
      };
    }

    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];

    if (!keyId || !keySecret) {
      return {
        ok: false as const,
        mode: "gateway_pending" as const,
        amount: ONE_TIME_REGISTRATION_FEE_PAISE,
        amountInr: 999,
        currency: "INR" as const,
        message:
          "Payment gateway integration is currently in preparation. Online registration fee collection will be enabled shortly.",
      };
    }

    const receipt = `sbm_reg_${userId.slice(0, 8)}_${Date.now()}`;
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: ONE_TIME_REGISTRATION_FEE_PAISE,
        currency: "INR",
        receipt,
        notes: {
          user_id: userId,
          purpose: "registration_fee",
          tier: "lifetime",
        },
      }),
    });

    if (!orderRes.ok) {
      return {
        ok: false as const,
        mode: "error" as const,
        message: "Could not create payment order with the payment provider. Please try again.",
      };
    }

    const order = (await orderRes.json()) as { id: string; amount: number };

    // Record pending transaction in database audit trail via service client
    const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    const supabaseUrl =
      process.env["SUPABASE_URL"] ||
      process.env["VITE_SUPABASE_URL"] ||
      "https://taczcgaxegbmqasfmsiz.supabase.co";

    if (serviceKey && supabaseUrl) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const adminClient = createClient<Database>(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        await adminClient.from("payments").insert({
          owner_id: userId,
          order_id: order.id,
          amount_paise: ONE_TIME_REGISTRATION_FEE_PAISE,
          currency: "INR",
          status: "pending",
        });
      } catch (logErr) {
        console.error("Failed to log pending payment initiation:", logErr);
      }
    }

    return {
      ok: true as const,
      mode: "ready" as const,
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: "INR",
      planName: "One-Time Registration",
    };
  });

/**
 * Server-side payment signature verification and atomic membership activation.
 * Never trusts client assertions; validates HMAC-SHA256 signature against Razorpay secret.
 */
export const verifyPaidOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      orderId: z.string().min(3),
      paymentId: z.string().min(3),
      signature: z.string().min(3),
      planId: z.string().uuid().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    const supabaseUrl =
      process.env["SUPABASE_URL"] ||
      process.env["VITE_SUPABASE_URL"] ||
      "https://taczcgaxegbmqasfmsiz.supabase.co";

    if (!keySecret || !serviceKey || !supabaseUrl) {
      return {
        ok: false as const,
        message: "Payment verification service is not configured on the server.",
      };
    }

    const crypto = await import("node:crypto");
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expected, "utf-8");
    const actualBuf = Buffer.from(data.signature, "utf-8");

    if (
      expectedBuf.length !== actualBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, actualBuf)
    ) {
      return {
        ok: false as const,
        message: "Payment signature could not be verified by the server. Verification failed.",
      };
    }

    const { userId } = context as AuthContext;
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient<Database>(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Invoke atomic activation procedure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: membershipId, error: rpcError } = await (admin.rpc as any)(
      "activate_registration_membership",
      {
        p_user_id: userId,
        p_order_id: data.orderId,
        p_payment_id: data.paymentId,
        p_amount_paise: ONE_TIME_REGISTRATION_FEE_PAISE,
        p_signature: data.signature,
      },
    );

    if (rpcError) {
      console.error("Membership activation procedure failed:", rpcError);
      return {
        ok: false as const,
        message: "Payment verified, but membership activation encountered a system error.",
      };
    }

    return {
      ok: true as const,
      membershipId: membershipId as string,
      message:
        "Payment successfully verified. Your Settibalija Matrimony membership is now active.",
    };
  });
