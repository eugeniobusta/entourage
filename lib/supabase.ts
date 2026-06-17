import { createClient } from "@supabase/supabase-js";

export type WaitlistEntry = {
  id: string;
  email: string;
  created_at: string;
  source: string;
};

export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
