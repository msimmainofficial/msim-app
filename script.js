/* ==========================================
   MSIM APP v2
   SCRIPT.JS
   PART 1
========================================== */

// ==========================
// GLOBAL VARIABLES
// ==========================

let currentScreen = "splash";

let sidebarOpened = false;

let loadingVisible = false;

// ==========================
// DOM READY
// ==========================

document.addEventListener(
"DOMContentLoaded",
async ()=>{

showLoading();

await testConnection();

setTimeout(()=>{

hideSplash();

},2500);

});

// ==========================
// SPLASH
// ==========================

function hideSplash(){

document
.getElementById("splashScreen")
.classList
.remove("active");

const session =
localStorage.getItem("msimUser");

if(session){

currentUser =
JSON.parse(session);

loadMemberData(currentUser);

document
.getElementById("dashboardScreen")
.classList
.add("active");

showPage("homePage");

initializeApp();

showToast(
"Welcome Back"
);

}else{

document
.getElementById("loginScreen")
.classList
.add("active");

}

hideLoading();

}

// ==========================
// SIDEBAR
// ==========================

function toggleSidebar(){

const sidebar =
document.getElementById("sidebar");

const overlay =
document.getElementById("overlay");

sidebar.classList.toggle("active");

overlay.classList.toggle("active");

sidebarOpened =
!sidebarOpened;

}

function closeSidebar(){

document
.getElementById("sidebar")
.classList
.remove("active");

document
.getElementById("overlay")
.classList
.remove("active");

sidebarOpened=false;

}

// ==========================
// PAGE NAVIGATION
// ==========================

function showPage(pageId){

document
.querySelectorAll(".page")
.forEach(page=>{

page.classList.remove("active");

});

const page =
document.getElementById(pageId);

if(page){

page.classList.add("active");

currentPage =
pageId;

}

closeSidebar();

}

// ==========================
// TOAST
// ==========================

function showToast(message){

const toast =
document.getElementById("toast");

const text =
document.getElementById("toastMessage");

text.innerText =
message;

toast.style.display =
"block";

setTimeout(()=>{

toast.style.display =
"none";

},3000);

}

// ==========================
// LOADING
// ==========================

function showLoading(){

loadingVisible=true;

document
.getElementById("loadingScreen")
.style.display="flex";

}

function hideLoading(){

loadingVisible=false;

document
.getElementById("loadingScreen")
.style.display="none";

}

// ==========================
// LOGOUT
// ==========================

function logout(){

document
.getElementById("logoutModal")
.classList
.add("active");

}

function closeLogoutModal(){

document
.getElementById("logoutModal")
.classList
.remove("active");

}

function confirmLogout(){

localStorage.removeItem(
"msimUser"
);

currentUser=null;

location.reload();

}
/* ==========================================
   LOGIN & SESSION
========================================== */

// ==========================
// LOGIN
// ==========================

async function login(){

const mobile =
document
.getElementById("mobile")
.value
.trim();

const password =
document
.getElementById("password")
.value
.trim();

const message =
document
.getElementById("loginMessage");

if(!mobile || !password){

message.innerText =
"Please enter mobile number and password.";

return;

}

showLoading();

message.innerText =
"Signing in...";

try{

const {data,error} =
await supabase
.from("members")
.select("*")
.eq("mobile",mobile)
.eq("password",password)
.single();

hideLoading();

if(error || !data){

message.innerText =
"Invalid Mobile Number or Password.";

return;

}

currentUser = data;

localStorage.setItem(
"msimUser",
JSON.stringify(data)
);

loadMemberData(data);

document
.getElementById("loginScreen")
.classList
.remove("active");

document
.getElementById("dashboardScreen")
.classList
.add("active");

showPage("homePage");

initializeApp();

showToast(
"Welcome " + data.name
);

}catch(err){

hideLoading();

console.error(err);

message.innerText =
"Unable to login.";

}

}

// ==========================
// LOAD MEMBER DATA
// ==========================

function loadMemberData(user){

document.getElementById("memberName").textContent =
user.name || "-";

document.getElementById("profileName").textContent =
user.name || "-";

document.getElementById("sidebarName").textContent =
user.name || "-";

document.getElementById("idName").textContent =
user.name || "-";

document.getElementById("profileMemberId").textContent =
user.member_id || "-";

document.getElementById("sidebarMemberId").textContent =
user.member_id || "-";

document.getElementById("cardMemberId").textContent =
user.member_id || "-";

document.getElementById("idMemberId").textContent =
user.member_id || "-";

document.getElementById("profileMobile").textContent =
user.mobile || "-";

document.getElementById("profileBranch").textContent =
user.branch || "-";

document.getElementById("cardBranch").textContent =
user.branch || "-";

document.getElementById("idBranch").textContent =
user.branch || "-";

document.getElementById("profileDepartment").textContent =
user.department || "-";

document.getElementById("cardDepartment").textContent =
user.department || "-";

document.getElementById("profileStatus").textContent =
user.status || "-";

document.getElementById("cardStatus").textContent =
user.status || "-";

document.getElementById("idStatus").textContent =
user.status || "-";

document.getElementById("profileJoiningDate").textContent =
user.joining_date || "-";

document.getElementById("idJoiningDate").textContent =
user.joining_date || "-";

const photo =
user.photo ||
APP_CONFIG.defaultAvatar;

document.getElementById("profilePhoto").src =
photo;

document.getElementById("headerAvatar").src =
photo;

document.getElementById("sidebarAvatar").src =
photo;

document.getElementById("idPhoto").src =
photo;

if(user.role==="admin" || user.role==="super_admin"){

isAdmin=true;

document
.getElementById("adminMenu")
.style.display="block";

}else{

isAdmin=false;

document
.getElementById("adminMenu")
.style.display="none";

}

}
/* ==========================================
   INITIALIZE APP
========================================== */

async function initializeApp(){

showLoading();

await loadAnnouncements();

await loadDuties();

await loadContacts();

await loadDownloads();

hideLoading();

}

/* ==========================
LOAD ANNOUNCEMENTS
========================== */

async function loadAnnouncements(){

try{

const {data,error}=await supabase
.from("announcements")
.select("*")
.order("created_at",{ascending:false});

if(error) throw error;

const home=
document.getElementById("latestAnnouncements");

const page=
document.getElementById("announcementsContainer");

home.innerHTML="";
page.innerHTML="";

if(!data || data.length===0){

const html=
"<p class='empty-text'>No announcements available.</p>";

home.innerHTML=html;
page.innerHTML=html;

return;

}

data.forEach(item=>{

const card=`

<div class="announcement-card">

<h3>${item.title}</h3>

<p>${item.description}</p>

<small>

${new Date(item.created_at).toLocaleDateString()}

</small>

</div>

`;

home.innerHTML+=card;

page.innerHTML+=card;

});

}catch(err){

console.error(err);

}

}

/* ==========================
LOAD DUTIES
========================== */

async function loadDuties(){

if(!currentUser) return;

try{

const {data,error}=await supabase
.from("duties")
.select("*")
.eq("member_id",currentUser.member_id)
.order("created_at",{ascending:false});

if(error) throw error;

const home=
document.getElementById("todayDuties");

const page=
document.getElementById("dutiesContainer");

home.innerHTML="";
page.innerHTML="";

if(!data || data.length===0){

const html=
"<p class='empty-text'>No duties assigned.</p>";

home.innerHTML=html;
page.innerHTML=html;

return;

}

data.forEach(item=>{

const card=`

<div class="duty-card">

<h3>${item.title}</h3>

<p>${item.description}</p>

<small>

Status : ${item.status}

</small>

</div>

`;

home.innerHTML+=card;

page.innerHTML+=card;

});

}catch(err){

console.error(err);

}

}

/* ==========================
LOAD CONTACTS
========================== */

async function loadContacts(){

try{

const {data,error}=await supabase
.from("contacts")
.select("*")
.order("name");

if(error) throw error;

const container=
document.getElementById("contactsContainer");

container.innerHTML="";

if(!data || data.length===0){

container.innerHTML=
"<p class='empty-text'>No contacts available.</p>";

return;

}

data.forEach(contact=>{

container.innerHTML+=`

<div class="contact-card">

<h3>${contact.name}</h3>

<p>${contact.designation}</p>

<a href="tel:${contact.mobile}">

${contact.mobile}

</a>

</div>

`;

});

}catch(err){

console.error(err);

}

}

/* ==========================
LOAD DOWNLOADS
========================== */

async function loadDownloads(){

const container=
document.getElementById("downloadsContainer");

container.innerHTML=

"<p class='empty-text'>Downloads feature coming soon.</p>";

}
/* ==========================================
   ADMIN PANEL
========================================== */

/* ==========================
SHOW ADMIN PAGE
========================== */

async function showAdminPage(section){

if(!isAdmin){

showToast("Access Denied");

return;

}

const container =
document.getElementById("adminContent");

container.innerHTML =
"<p class='empty-text'>Loading...</p>";

switch(section){

case "members":

await loadMembers();

break;

case "branches":

await loadBranches();

break;

case "departments":

await loadDepartments();

break;

case "duties":

await loadAdminDuties();

break;

case "announcements":

await loadAdminAnnouncements();

break;

case "contacts":

await loadAdminContacts();

break;

}

}

/* ==========================
LOAD MEMBERS
========================== */

async function loadMembers(){

const container =
document.getElementById("adminContent");

try{

const {data,error} =
await supabase
.from("members")
.select("*")
.order("name");

if(error) throw error;

container.innerHTML="";

if(data.length===0){

container.innerHTML=
"<p class='empty-text'>No Members Found.</p>";

return;

}

data.forEach(member=>{

container.innerHTML+=`

<div class="member-card">

<h3>${member.name}</h3>

<p>Member ID : ${member.member_id}</p>

<p>Branch : ${member.branch}</p>

<p>Department : ${member.department}</p>

<p>Status : ${member.status}</p>

<button
onclick="editMember('${member.id}')">

Edit

</button>

<button
onclick="deleteMember('${member.id}')">

Delete

</button>

</div>

`;

});

}catch(err){

console.error(err);

container.innerHTML=
"<p class='empty-text'>Unable to load members.</p>";

}

}

/* ==========================
EDIT MEMBER
========================== */

async function editMember(id){

showToast(
"Edit Member feature coming soon."
);

}

/* ==========================
DELETE MEMBER
========================== */

async function deleteMember(id){

if(!confirm("Delete this member?")){

return;

}

const {error} =
await supabase
.from("members")
.delete()
.eq("id",id);

if(error){

showToast("Delete Failed");

return;

}

showToast("Member Deleted");

loadMembers();

}

/* ==========================
LOAD BRANCHES
========================== */

async function loadBranches(){

const container =
document.getElementById("adminContent");

container.innerHTML=
"<p class='empty-text'>Branches Module Coming Soon.</p>";

}

/* ==========================
LOAD DEPARTMENTS
========================== */

async function loadDepartments(){

const container =
document.getElementById("adminContent");

container.innerHTML=
"<p class='empty-text'>Departments Module Coming Soon.</p>";

}

/* ==========================
ADMIN DUTIES
========================== */

async function loadAdminDuties(){

const container =
document.getElementById("adminContent");

container.innerHTML=
"<p class='empty-text'>Duty Management Coming Soon.</p>";

}

/* ==========================
ADMIN ANNOUNCEMENTS
========================== */

async function loadAdminAnnouncements(){

const container =
document.getElementById("adminContent");

container.innerHTML=
"<p class='empty-text'>Announcement Management Coming Soon.</p>";

}

/* ==========================
ADMIN CONTACTS
========================== */

async function loadAdminContacts(){

const container =
document.getElementById("adminContent");

container.innerHTML=
"<p class='empty-text'>Contact Management Coming Soon.</p>";

}
/* ==========================================
   PROFILE
========================================== */

function editProfile(){

showToast(
"Profile update feature will be available soon."
);

}

/* ==========================================
   MEMBER MODAL
========================================== */

function closeMemberModal(){

document
.getElementById("memberModal")
.classList
.remove("active");

}

function saveMember(){

showToast(
"Member Saved Successfully."
);

closeMemberModal();

}

/* ==========================================
   SEARCH MEMBER
========================================== */

function searchMembers(){

const keyword =
prompt("Enter Member Name");

if(!keyword){

return;

}

showToast(
"Searching : " + keyword
);

}

/* ==========================================
   ABOUT
========================================== */

function showAbout(){

alert(

"Mission Syedi Ikram E Millat\n\nOfficial Mobile Application\nVersion : " +

APP_CONFIG.version

);

}

/* ==========================================
   CONTACT ADMIN
========================================== */

function contactAdmin(){

window.location.href =
"tel:+910000000000";

}

/* ==========================================
   TOAST AUTO CLOSE
========================================== */

function hideToast(){

const toast =
document.getElementById("toast");

toast.style.display =
"none";

}

/* ==========================================
   LOADING
========================================== */

function startLoading(){

showLoading();

}

function stopLoading(){

hideLoading();

}

/* ==========================================
   SERVICE WORKER
========================================== */

if("serviceWorker" in navigator){

window.addEventListener(

"load",

()=>{

navigator.serviceWorker
.register("sw.js")
.then(()=>{

console.log(
"Service Worker Registered"
);

})
.catch(error=>{

console.error(error);

});

}

);

}

/* ==========================================
   APP READY
========================================== */

console.log(

APP_CONFIG.appName +

" v" +

APP_CONFIG.version +

" Ready"

);
