// Cleanup script for Shettibalija Matrimony demo profiles
// Safely removes only demo data (is_demo: true & demo auth users) without affecting real members.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

// Load .env
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

async function cleanup() {
  console.log("🧹 Cleaning up demo profiles (is_demo: true & demo auth accounts)...");

  try {
    const { data, error } = await supabase.rpc("cleanup_all_demo_profiles");
    if (error) {
      console.warn("RPC note:", error.message, "- trying direct query cleanup...");
      const { count, error: delError } = await supabase
        .from("matrimonial_profiles")
        .delete({ count: "exact" })
        .eq("is_demo", true);

      if (delError) {
        console.error("Cleanup error:", delError.message);
      } else {
        console.log(`✅ Cleanup completed. Removed ${count ?? 0} demo profiles.`);
      }
    } else {
      console.log(`✅ Cleanup completed successfully via RPC. Cleaned demo records.`);
    }
  } catch (err) {
    console.error("Cleanup failed:", err.message);
    process.exit(1);
  }
}

cleanup();
