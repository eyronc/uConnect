import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://msddzxzwxnykpkdwyxle.supabase.co";
const supabaseAnonKey = "sb_publishable_P3egFJPX-GPmJGZiJ-_uAA_9lt-3gtZ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
