import type { Database } from "@/integrations/supabase/types";
import { ONE_TIME_REGISTRATION_FEE_PAISE } from "@/lib/site";

export type WebhookResult =
  | { ok: true; action: "activated" | "ignored"; membershipId?: string }
  | { ok: false; status: number; message: string };

/**
 * Handles incoming Razorpay webhook events (e.g., payment.captured, order.paid).
 * Verifies authenticity using RAZORPAY_WEBHOOK_SECRET.
 * Idempotently activates registration membership upon verified payment capture.
 */
export async function processRazorpayWebhook(
  rawBody: string,
  signature: string | null,
): Promise<WebhookResult> {
  const webhookSecret = process.env["RAZORPAY_WEBHOOK_SECRET"];
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const supabaseUrl =
    process.env["SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"] ||
    "https://taczcgaxegbmqasfmsiz.supabase.co";

  if (!webhookSecret) {
    return { ok: false, status: 500, message: "Webhook secret is not configured on the server." };
  }

  if (!signature) {
    return { ok: false, status: 400, message: "Missing Razorpay signature header." };
  }

  const crypto = await import("node:crypto");
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const expectedBuf = Buffer.from(expectedSignature, "utf-8");
  const actualBuf = Buffer.from(signature, "utf-8");

  if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
    return { ok: false, status: 401, message: "Invalid webhook signature." };
  }

  let payload: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          status?: string;
          notes?: { user_id?: string };
        };
      };
      order?: {
        entity?: {
          id?: string;
          amount_paid?: number;
          status?: string;
          notes?: { user_id?: string };
        };
      };
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, message: "Malformed webhook JSON payload." };
  }

  const eventName = payload.event;
  if (eventName !== "payment.captured" && eventName !== "order.paid") {
    return { ok: true, action: "ignored" };
  }

  const paymentEntity = payload.payload?.payment?.entity;
  const orderEntity = payload.payload?.order?.entity;

  const userId = paymentEntity?.notes?.user_id || orderEntity?.notes?.user_id;
  const orderId = paymentEntity?.order_id || orderEntity?.id;
  const paymentId = paymentEntity?.id || "webhook_captured";
  const amountPaise =
    paymentEntity?.amount || orderEntity?.amount_paid || ONE_TIME_REGISTRATION_FEE_PAISE;

  if (!userId) {
    return { ok: false, status: 422, message: "Webhook payload missing user_id note." };
  }

  if (!serviceKey || !supabaseUrl) {
    return { ok: false, status: 500, message: "Supabase service configuration missing." };
  }

  const { createClient } = await import("@supabase/supabase-js");
  const adminClient = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: membershipId, error: rpcError } = await (adminClient.rpc as any)(
    "activate_registration_membership",
    {
      p_user_id: userId,
      p_order_id: orderId ?? null,
      p_payment_id: paymentId,
      p_amount_paise: amountPaise,
      p_signature: signature,
    },
  );

  if (rpcError) {
    console.error("Webhook membership activation error:", rpcError);
    return { ok: false, status: 500, message: "Failed to activate membership via webhook." };
  }

  return { ok: true, action: "activated", membershipId: membershipId as string };
}
