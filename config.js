/* ==========================================
   MSIM APP v2
   Supabase Configuration
========================================== */

const SUPABASE_URL =
"https://cmtttmuiwgwmdqgcztgc.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_LEJNJGx5T1BHk9JpnRD8Qg_0j1O_enx";

/* Supabase CDN */
const supabaseScript = document.createElement("script");
supabaseScript.src =
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = () => {

window.supabase =
supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

console.log("✅ Supabase Connected");

};

document.head.appendChild(supabaseScript);
