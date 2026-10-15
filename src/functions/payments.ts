import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

type AuthContext = { supabase: SupabaseClient<Database>; userId: string };

export const createPaidOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ planId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keyId || !keySecret) {
      return {
        ok: false as const,
        message: "Online payments are not configured yet. Please contact the community office.",
      };
    }

    const { supabase, userId } = context as AuthContext;
    const { data: plan, error: planError } = await supabase
      .from("membership_plans")
      .select("*")
      .eq("id", data.planId)
      .eq("active", true)
      .maybeSingle();
    if (planError || !plan) {
      return { ok: false as const, message: "That membership plan is not available." };
    }
    if (plan.price_paise == null || plan.price_paise <= 0) {
      return { ok: false as const, message: "Use the free plan activation instead." };
    }

    const receipt = `sbm_${userId.slice(0, 8)}_${Date.now()}`;
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: plan.price_paise,
        currency: "INR",
        receipt,
        notes: { plan_id: plan.id, user_id: userId },
      }),
    });
    if (!orderRes.ok) {
      return { ok: false as const, message: "Could not create a payment order." };
    }
    const order = (await orderRes.json()) as { id: string; amount: number };

    return {
      ok: true as const,
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: "INR",
      planName: plan.name,
      planId: plan.id,
    };
  });

export const verifyPaidOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      planId: z.string().uuid(),
      orderId: z.string().min(3),
      paymentId: z.string().min(3),
      signature: z.string().min(3),
    }),
  )
  .handler(async ({ data, context }) => {
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    const supabaseUrl = process.env["SUPABASE_URL"];
    if (!keySecret || !serviceKey || !supabaseUrl) {
      return {
        ok: false as const,
        message: "Payment verification is not configured on the server.",
      };
    }

    const crypto = await import("node:crypto");
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");
    if (expected !== data.signature) {
      return { ok: false as const, message: "Payment signature could not be verified." };
    }

    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient<Database>(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { userId } = context as AuthContext;

    const { data: plan } = await admin
      .from("membership_plans")
      .select("*")
      .eq("id", data.planId)
      .maybeSingle();
    if (!plan) return { ok: false as const, message: "Plan not found." };

    const startsAt = new Date();
    const expiresAt =
      plan.duration_days != null
        ? new Date(startsAt.getTime() + plan.duration_days * 86400000).toISOString()
        : null;

    const { data: membership, error: membershipError } = await admin
      .from("memberships")
      .insert({
        owner_id: userId,
        plan_id: plan.id,
        status: "active",
        starts_at: startsAt.toISOString(),
        expires_at: expiresAt,
      })
      .select("id")
      .single();
    if (membershipError || !membership) {
      return {
        ok: false as const,
        message: "Payment succeeded but membership could not be saved.",
      };
    }

    await admin.from("payments").insert({
      owner_id: userId,
      membership_id: membership.id,
      order_id: data.orderId,
      gateway_payment_id: data.paymentId,
      amount_paise: plan.price_paise ?? 0,
      currency: "INR",
      status: "successful",
    });
    await admin.from("notifications").insert({
      owner_id: userId,
      title: "Payment Successful",
      message: `Your ${plan.name} membership is now active.`,
    });

    return { ok: true as const };
  });
