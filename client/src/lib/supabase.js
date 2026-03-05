import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://msddzxzwxnykpkdwyxle.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_P3egFJPX-GPmJGZiJ-_uAA_9lt-3gtZ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
