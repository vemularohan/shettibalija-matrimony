// Cleanup script for Shettibalija Matrimony demo profiles
// Removes all profiles marked with is_demo: true without affecting real members.

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
  console.log("🧹 Cleaning up demo profiles (is_demo: true)...");

  const { error, count } = await supabase
    .from("matrimonial_profiles")
    .delete({ count: "exact" })
    .eq("is_demo", true);

  if (error) {
    console.error("Cleanup error:", error.message);
  } else {
    console.log(`✅ Cleanup completed. Removed ${count ?? 0} demo profiles.`);
  }
}

cleanup();
