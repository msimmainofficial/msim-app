/* ==========================================
   MSIM APP v2
   Supabase Configuration
========================================== */

const SUPABASE_URL = "https://cmtttmuiwgwmdqgcztgc.supabase.co";

const SUPABASE_KEY = "sb_publishable_LEJNJGx5T1BHk9JpnRD8Qg_0j1O_enx";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase Connected");
