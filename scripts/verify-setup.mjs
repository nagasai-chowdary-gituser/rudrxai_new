/**
 * Checks that Supabase is wired up correctly.
 *
 *   npm run verify:setup
 *
 * Verifies the environment variables, the connection, every table, the storage
 * bucket, and reports whether the admin credentials have been seeded yet.
 */

import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const PASS = "\x1b[32m✓\x1b[0m"
const FAIL = "\x1b[31m✗\x1b[0m"
const WARN = "\x1b[33m!\x1b[0m"

let failures = 0

function report(ok, label, detail) {
  if (ok === "warn") {
    console.log(`${WARN} ${label}${detail ? ` — ${detail}` : ""}`)
    return
  }
  if (!ok) failures++
  console.log(`${ok ? PASS : FAIL} ${label}${detail ? ` — ${detail}` : ""}`)
}

console.log("\nRudrova Labs — setup check\n" + "─".repeat(40))

// ------------------------------------------------------------ environment
const required = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "AUTH_SECRET",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
]

for (const key of required) {
  const value = process.env[key]
  report(Boolean(value && value.trim()), `env ${key}`, value ? "set" : "missing")
}

if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length < 16) {
  report(false, "AUTH_SECRET length", "must be at least 16 characters")
}

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  report("warn", "env NEXT_PUBLIC_SITE_URL", "unset — canonical URLs will use localhost")
}

if (failures > 0) {
  console.log(`\n${FAIL} Fix the environment variables above, then run this again.\n`)
  process.exit(1)
}

// ------------------------------------------------------------- connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

console.log("─".repeat(40))

const tables = [
  "clients",
  "projects",
  "reviews",
  "admin_settings",
  "gate_attempts",
  "admin_audit",
]

for (const table of tables) {
  // A real SELECT, not a HEAD request: head:true swallows the "table does not
  // exist" error and reports a missing table as healthy.
  const { error } = await supabase.from(table).select("*").limit(1)
  report(!error, `table ${table}`, error ? error.message : "ready")
}

// ---------------------------------------------------------------- storage
const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

if (bucketError) {
  report(false, "storage", bucketError.message)
} else {
  const bucket = buckets.find((entry) => entry.id === "project-files")
  report(Boolean(bucket), "bucket project-files", bucket ? (bucket.public ? "PUBLIC — should be private!" : "private") : "missing")
  if (bucket?.public) failures++
}

// ------------------------------------------------------------------ admin
const { data: settings } = await supabase
  .from("admin_settings")
  .select("username, gate_color, pattern, updated_at")
  .eq("id", 1)
  .maybeSingle()

if (settings) {
  report(true, "admin credentials", `seeded for "${settings.username}"`)
  console.log(`    gate colour: ${settings.gate_color}   pattern: ${settings.pattern}`)
} else {
  report("warn", "admin credentials", "not seeded yet — seeded automatically on your first visit to /den")
}

// ----------------------------------------------------------------- summary
console.log("─".repeat(40))

if (failures > 0) {
  console.log(`\n${FAIL} ${failures} problem(s). Run supabase/schema.sql in the Supabase SQL editor if tables are missing.\n`)
  process.exit(1)
}

console.log(`\n${PASS} Everything is ready. Start the site and open /pricing → last FAQ → Sign in as Admin.\n`)
