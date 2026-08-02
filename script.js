/* ==========================================
   MSIM APP v2
   Script Part 1
========================================== */

const screens = document.querySelectorAll(".screen");
const pages = document.querySelectorAll(".page");

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

let currentUser = null;

/* =========================
SPLASH SCREEN
========================= */

window.addEventListener("load", () => {

setTimeout(() => {

document
.getElementById("splashScreen")
.classList.remove("active");

document
.getElementById("loginScreen")
.classList.add("active");

},2000);

});

/* =========================
SIDEBAR
========================= */

function toggleSidebar(){

sidebar.classList.toggle("active");

overlay.classList.toggle("active");

}

function closeSidebar(){

sidebar.classList.remove("active");

overlay.classList.remove("active");

}

/* =========================
PAGE NAVIGATION
========================= */

function showPage(pageId){

pages.forEach(page=>{

page.classList.remove("active");

});

document
.getElementById(pageId)
.classList.add("active");

closeSidebar();

}

/* =========================
LOGOUT
========================= */

function logout(){

document
.getElementById("logoutModal")
.classList.add("active");

}

function closeLogoutModal(){

document
.getElementById("logoutModal")
.classList.remove("active");

}

function confirmLogout(){

localStorage.removeItem("msimUser");

location.reload();

}

/* =========================
TOAST
========================= */

function showToast(message){

const toast =
document.getElementById("toast");

document
.getElementById("toastMessage")
.innerText = message;

toast.style.display = "block";

setTimeout(()=>{

toast.style.display="none";

},2500);

}
/* ==========================================
   LOGIN & SESSION
========================================== */

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

const msg =
document
.getElementById("loginMessage");

if(!mobile || !password){

msg.innerText =
"Please enter mobile number and password.";

return;

}

msg.innerText = "Signing in...";

try{

const { data,error } =
await supabase
.from("members")
.select("*")
.eq("mobile",mobile)
.eq("password",password)
.single();

if(error || !data){

msg.innerText =
"Invalid mobile number or password.";

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
.classList.remove("active");

document
.getElementById("dashboardScreen")
.classList.add("active");

showPage("homePage");

showToast("Welcome " + data.name);

}catch(err){

console.error(err);

msg.innerText =
"Login failed. Please try again.";

}

}

/* =========================
AUTO LOGIN
========================= */

window.addEventListener("DOMContentLoaded",()=>{

const savedUser =
localStorage.getItem("msimUser");

if(savedUser){

currentUser =
JSON.parse(savedUser);

document
.getElementById("splashScreen")
.classList.remove("active");

document
.getElementById("dashboardScreen")
.classList.add("active");

loadMemberData(currentUser);

showPage("homePage");

}

});

/* =========================
LOAD MEMBER DATA
========================= */

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

document.getElementById("cardMemberId").textContent =
user.member_id || "-";

document.getElementById("sidebarMemberId").textContent =
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

document.getElementById("idDepartment").textContent =
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
user.photo || "assets/default-avatar.png";

document.getElementById("profilePhoto").src = photo;
document.getElementById("headerAvatar").src = photo;
document.getElementById("sidebarAvatar").src = photo;
document.getElementById("idPhoto").src = photo;

}
/* ==========================================
   MSIM APP v2
   Script Part 3
========================================== */

/* =========================
LOAD ANNOUNCEMENTS
========================= */

async function loadAnnouncements(){

try{

const {data,error}=await supabase
.from("announcements")
.select("*")
.order("created_at",{ascending:false});

if(error) throw error;

const container=document.getElementById("announcementsContainer");
const preview=document.getElementById("latestAnnouncements");

container.innerHTML="";
preview.innerHTML="";

if(!data || data.length===0){

container.innerHTML="<p class='empty-text'>No announcements available.</p>";
preview.innerHTML="<p class='empty-text'>No announcements available.</p>";

return;

}

data.forEach(item=>{

const card=`
<div class="announcement-card">

<h3>${item.title}</h3>

<p>${item.description}</p>

<small>${new Date(item.created_at).toLocaleDateString()}</small>

</div>
`;

container.innerHTML+=card;

});

preview.innerHTML=container.innerHTML;

}catch(err){

console.error(err);

}

}

/* =========================
LOAD DUTIES
========================= */

async function loadDuties(){

if(!currentUser) return;

try{

const {data,error}=await supabase
.from("duties")
.select("*")
.eq("member_id",currentUser.member_id);

if(error) throw error;

const box=document.getElementById("dutiesContainer");
const home=document.getElementById("todayDuties");

box.innerHTML="";
home.innerHTML="";

if(!data || data.length===0){

box.innerHTML="<p class='empty-text'>No duties assigned.</p>";
home.innerHTML="<p class='empty-text'>No duties assigned.</p>";

return;

}

data.forEach(duty=>{

const card=`
<div class="duty-card">

<h3>${duty.title}</h3>

<p>${duty.description}</p>

<small>Status : ${duty.status}</small>

</div>
`;

box.innerHTML+=card;

});

home.innerHTML=box.innerHTML;

}catch(err){

console.error(err);

}

}

/* =========================
LOAD CONTACTS
========================= */

async function loadContacts(){

try{

const {data,error}=await supabase
.from("contacts")
.select("*");

if(error) throw error;

const container=document.getElementById("contactsContainer");

container.innerHTML="";

if(!data || data.length===0){

container.innerHTML="<p class='empty-text'>No contacts available.</p>";

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

/* =========================
INITIAL DATA
========================= */

async function initializeApp(){

await loadAnnouncements();

await loadDuties();

await loadContacts();

}

document.addEventListener("DOMContentLoaded",()=>{

setTimeout(()=>{

if(currentUser){

initializeApp();

}

},800);

});
/* ==========================================
   ADMIN PANEL & UTILITIES
========================================== */

/* =========================
SHOW ADMIN PAGE
========================= */

function showAdminPage(section){

const container =
document.getElementById("adminContent");

container.innerHTML =
"<h3 style='margin:20px 0'>Loading...</h3>";

switch(section){

case "members":

loadMembers();

break;

case "branches":

loadBranches();

break;

case "departments":

loadDepartments();

break;

case "duties":

loadAdminDuties();

break;

case "announcements":

loadAdminAnnouncements();

break;

case "contacts":

loadAdminContacts();

break;

default:

container.innerHTML="";

}

}

/* =========================
LOAD MEMBERS
========================= */

async function loadMembers(){

const container =
document.getElementById("adminContent");

try{

const {data,error}=await supabase
.from("members")
.select("*")
.order("name");

if(error) throw error;

container.innerHTML="";

if(!data || data.length===0){

container.innerHTML=
"<p class='empty-text'>No members found.</p>";

return;

}

data.forEach(member=>{

container.innerHTML += `

<div class="member-card">

<h3>${member.name}</h3>

<p>ID : ${member.member_id}</p>

<p>Branch : ${member.branch}</p>

<p>Department : ${member.department}</p>

<p>Status : ${member.status}</p>

</div>

`;

});

}catch(err){

console.error(err);

container.innerHTML=
"<p class='empty-text'>Unable to load members.</p>";

}

}

/* =========================
PLACEHOLDER FUNCTIONS
========================= */

async function loadBranches(){}
async function loadDepartments(){}
async function loadAdminDuties(){}
async function loadAdminAnnouncements(){}
async function loadAdminContacts(){}

/* =========================
PROFILE
========================= */

function editProfile(){

showToast("Profile update feature coming soon.");

}

/* =========================
MEMBER MODAL
========================= */

function closeMemberModal(){

document
.getElementById("memberModal")
.classList.remove("active");

}

function saveMember(){

showToast("Member saved.");

closeMemberModal();

}

/* =========================
SEARCH
========================= */

function closeSearch(){

document
.getElementById("searchModal")
.classList.remove("active");

}

/* =========================
ABOUT
========================= */

function showAbout(){

alert(
"Mission Syedi Ikram E Millat\nOfficial Mobile Application"
);

}

/* =========================
CONTACT ADMIN
========================= */

function contactAdmin(){

window.location.href =
"tel:+910000000000";

}
