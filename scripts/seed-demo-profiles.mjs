// Idempotent seed script for Shettibalija Matrimony demo profiles
// Seeds exactly 50 culturally plausible fictional demo profiles (25 brides, 25 grooms)
// Running this script multiple times is 100% idempotent and safe.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { DEMO_PROFILES_DATA } from "./demo-profiles-data.mjs";

// 1. Load .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or key. Check .env configuration.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Starting idempotent seed of 50 Shettibalija Matrimony demo profiles...");
  console.log(`📦 Loaded ${DEMO_PROFILES_DATA.length} fictional profiles.`);

  const BATCH_SIZE = 10;
  let totalProcessed = 0;

  for (let i = 0; i < DEMO_PROFILES_DATA.length; i += BATCH_SIZE) {
    const batch = DEMO_PROFILES_DATA.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(DEMO_PROFILES_DATA.length / BATCH_SIZE);

    try {
      const { data, error } = await supabase.rpc("seed_demo_profile_batch", {
        p_batch: batch,
      });

      if (error) {
        console.error(`❌ Batch ${batchNum}/${totalBatches} error:`, error.message);
        throw error;
      } else {
        totalProcessed += Number(data || batch.length);
        console.log(
          `  ✓ Batch ${batchNum}/${totalBatches}: Processed ${batch.length} profiles (${totalProcessed}/${DEMO_PROFILES_DATA.length})`,
        );
      }
    } catch (err) {
      console.error(`Failed processing batch ${batchNum}:`, err.message);
      process.exit(1);
    }
  }

  // Verification counts via approved view
  const { count: approvedCount } = await supabase
    .from("approved_matrimonial_profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_demo", true);

  console.log("\n==========================================");
  console.log("🎉 SEED VERIFICATION COMPLETED");
  console.log(`Total demo profiles processed:   ${totalProcessed}`);
  console.log(`Approved & visible in discovery: ${approvedCount}`);
  console.log("==========================================\n");
}

seed();
