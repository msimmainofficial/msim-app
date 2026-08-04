/* ==========================================
   MSIM APP v2
   CONFIG.JS
========================================== */

// ==========================
// SUPABASE CONFIGURATION
// ==========================

const SUPABASE_URL =
"https://cmtttmuiwgwmdqgcztgc.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_LEJNJGx5T1BHk9JpnRD8Qg_0j1O_enx";

// ==========================
// CREATE CLIENT
// ==========================

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

// ==========================
// GLOBAL VARIABLES
// ==========================

let currentUser = null;

let currentPage = "homePage";

let isAdmin = false;

// ==========================
// APP SETTINGS
// ==========================

const APP_CONFIG = {

appName:
"MSIM APP",

organization:
"Mission Syedi Ikram E Millat",

version:
"2.0.0",

themeColor:
"#091B3D",

goldColor:
"#FFD54A",

defaultAvatar:
"assets/default-avatar.png",

logo:
"assets/logo.png"

};

// ==========================
// CONNECTION TEST
// ==========================

async function testConnection(){

try{

const { error } =
await supabase
.from("members")
.select("id")
.limit(1);

if(error){

console.error(
"Supabase Connection Failed",
error.message
);

return false;

}

console.log(
"Supabase Connected Successfully"
);

return true;

}catch(err){

console.error(err);

return false;

}

}

// ==========================
// STARTUP
// ==========================

document.addEventListener(
"DOMContentLoaded",
()=>{

testConnection();

}
);
