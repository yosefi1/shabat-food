import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables. " +
    "Add them to .env.local for local development."
  );
}

/**
 * Server-only Supabase client using the service role key.
 * Never expose this client or key to the browser.
 */
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
