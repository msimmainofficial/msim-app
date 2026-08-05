/* =========================================================
   MSIM APP v2
   SCRIPT.JS
   PART 1
   ================================================
   Splash
   Initialization
   Supabase
   Global Variables
   Helper Functions
========================================================= */

/* ===========================
   SUPABASE CLIENT
=========================== */

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

/* ===========================
   GLOBAL VARIABLES
=========================== */

let currentMember = null;
let isLoggedIn = false;

/* ===========================
   DOM ELEMENTS
=========================== */

const splashScreen =
document.getElementById("splash-screen");

const loadingText =
document.getElementById("loading-text");

const loginScreen =
document.getElementById("login-screen");

const dashboardScreen =
document.getElementById("dashboard-screen");

const loginForm =
document.getElementById("login-form");

const mobileInput =
document.getElementById("mobile");

const passwordInput =
document.getElementById("password");

const loginBtn =
document.getElementById("login-btn");

const logoutBtn =
document.getElementById("logout-btn");

/* ===========================
   MEMBER INFO
=========================== */

const memberName =
document.getElementById("member-name");

const memberId =
document.getElementById("member-id");

const memberBranch =
document.getElementById("member-branch");

const memberDepartment =
document.getElementById("member-department");

const memberDesignation =
document.getElementById("member-designation");

const memberStatus =
document.getElementById("member-status");

const memberJoining =
document.getElementById("member-joining");

const memberPhoto =
document.getElementById("member-photo");

/* ===========================
   LIST CONTAINERS
=========================== */

const announcementList =
document.getElementById("announcement-list");

const dutyList =
document.getElementById("duty-list");

const contactList =
document.getElementById("contact-list");

/* ===========================
   APP START
=========================== */

document.addEventListener("DOMContentLoaded", () => {

    startApp();

});

/* ===========================
   START APPLICATION
=========================== */

async function startApp(){

    updateLoading("Starting App...");

    await delay(600);

    checkInternet();

    updateLoading("Connecting Server...");

    await delay(700);

    updateLoading("Checking Session...");

    await delay(700);

    hideSplash();

}

/* ===========================
   SPLASH
=========================== */

function hideSplash(){

    if(splashScreen){

        splashScreen.classList.add("hide");

    }

}

/* ===========================
   LOADING TEXT
=========================== */

function updateLoading(text){

    if(loadingText){

        loadingText.innerText = text;

    }

}

/* ===========================
   INTERNET
=========================== */

function checkInternet(){

    if(!navigator.onLine){

        alert(
            "No Internet Connection"
        );

    }

}

window.addEventListener("online",()=>{

    console.log("Internet Connected");

});

window.addEventListener("offline",()=>{

    alert("Internet Disconnected");

});

/* ===========================
   DELAY
=========================== */

function delay(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}

/* ===========================
   TOAST
=========================== */

function showToast(message){

    alert(message);

}

/* ===========================
   BUTTON LOADING
=========================== */

function buttonLoading(state){

    if(!loginBtn) return;

    if(state){

        loginBtn.disabled=true;

        loginBtn.innerText="Please Wait...";

    }else{

        loginBtn.disabled=false;

        loginBtn.innerText="Login";

    }

}

/* ===========================
   DATE FORMAT
=========================== */

function formatDate(date){

    if(!date) return "-";

    return new Date(date)
    .toLocaleDateString(
        "en-IN"
    );

}

/* ===========================
   SAVE SESSION
=========================== */

function saveSession(data){

    localStorage.setItem(
        "msim_member",
        JSON.stringify(data)
    );

}

/* ===========================
   GET SESSION
=========================== */

function getSession(){

    return JSON.parse(

        localStorage.getItem(
            "msim_member"
        )

    );

}

/* ===========================
   CLEAR SESSION
=========================== */

function clearSession(){

    localStorage.removeItem(
        "msim_member"
    );

}
/* =========================================================
   PART 2
   LOGIN SYSTEM
========================================================= */

/* ===========================
   LOGIN BUTTON
=========================== */

if (loginBtn) {

    loginBtn.addEventListener("click", loginMember);

}

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        loginMember();

    });

}

/* ===========================
   LOGIN MEMBER
=========================== */

async function loginMember() {

    const mobile = mobileInput.value.trim();
    const password = passwordInput.value.trim();

    if (mobile === "") {

        showToast("Enter Mobile Number");

        mobileInput.focus();

        return;

    }

    if (password === "") {

        showToast("Enter Password");

        passwordInput.focus();

        return;

    }

    buttonLoading(true);

    try {

        const { data, error } = await supabase

            .from("members")

            .select("*")

            .eq("mobile", mobile)

            .single();

        if (error || !data) {

            buttonLoading(false);

            showToast("Member Not Found");

            return;

        }

        if (data.password !== password) {

            buttonLoading(false);

            showToast("Wrong Password");

            return;

        }

        currentMember = data;

        isLoggedIn = true;

        saveSession(data);

        showToast("Login Successful");

        openDashboard(data);

    }

    catch (err) {

        console.error(err);

        showToast("Server Error");

    }

    finally {

        buttonLoading(false);

    }

}

/* ===========================
   OPEN DASHBOARD
=========================== */

function openDashboard(member) {

    if (loginScreen) {

        loginScreen.style.display = "none";

    }

    if (dashboardScreen) {

        dashboardScreen.style.display = "block";

    }

    loadMemberProfile(member);

    loadAnnouncements();

    loadDuties();

    loadContacts();

}

/* ===========================
   MEMBER PROFILE
=========================== */

function loadMemberProfile(member) {

    if (!member) return;

    if (memberName)
        memberName.innerText = member.name || "-";

    if (memberId)
        memberId.innerText = member.member_id || "-";

    if (memberBranch)
        memberBranch.innerText = member.branch || "-";

    if (memberDepartment)
        memberDepartment.innerText = member.department || "-";

    if (memberDesignation)
        memberDesignation.innerText = member.designation || "-";

    if (memberStatus)
        memberStatus.innerText = member.status || "-";

    if (memberJoining)
        memberJoining.innerText =
            formatDate(member.joining_date);

    if (memberPhoto) {

        if (member.photo_url &&
            member.photo_url !== "") {

            memberPhoto.src = member.photo_url;

        } else {

            memberPhoto.src =
                "./assets/default-user.png";

        }

    }

}
/* =========================================================
   PART 3
   SESSION RESTORE + LOGOUT
========================================================= */

/* ===========================
   RESTORE SESSION
=========================== */

async function restoreSession() {

    const session = getSession();

    if (!session) {

        showLogin();

        return;

    }

    buttonLoading(true);

    try {

        const { data, error } = await supabase
            .from("members")
            .select("*")
            .eq("mobile", session.mobile)
            .single();

        if (error || !data) {

            clearSession();

            showLogin();

            return;

        }

        currentMember = data;

        isLoggedIn = true;

        openDashboard(data);

    } catch (err) {

        console.error(err);

        clearSession();

        showLogin();

    } finally {

        buttonLoading(false);

    }

}

/* ===========================
   SHOW LOGIN
=========================== */

function showLogin() {

    if (dashboardScreen) {

        dashboardScreen.style.display = "none";

    }

    if (loginScreen) {

        loginScreen.style.display = "flex";

    }

}

/* ===========================
   LOGOUT
=========================== */

async function logoutMember() {

    const ok = confirm("Logout from MSIM App?");

    if (!ok) return;

    clearSession();

    currentMember = null;

    isLoggedIn = false;

    if (mobileInput) mobileInput.value = "";

    if (passwordInput) passwordInput.value = "";

    showLogin();

    showToast("Logged Out Successfully");

}

/* ===========================
   LOGOUT BUTTON
=========================== */

if (logoutBtn) {

    logoutBtn.addEventListener("click", logoutMember);

}

/* ===========================
   START APP UPDATE
=========================== */

async function startApp() {

    updateLoading("Starting App...");

    await delay(500);

    checkInternet();

    updateLoading("Connecting Server...");

    await delay(600);

    updateLoading("Checking Session...");

    await delay(700);

    hideSplash();

    await restoreSession();

}

/* ===========================
   WINDOW FOCUS
=========================== */

window.addEventListener("focus", async () => {

    if (!isLoggedIn) return;

    const session = getSession();

    if (!session) return;

    try {

        const { data } = await supabase
            .from("members")
            .select("*")
            .eq("mobile", session.mobile)
            .single();

        if (data) {

            currentMember = data;

            loadMemberProfile(data);

        }

    } catch (e) {

        console.log(e);

    }

});

/* ===========================
   SESSION STATUS
=========================== */

function isMemberLoggedIn() {

    return isLoggedIn;

}
/* =========================================================
   PART 4
   DASHBOARD DATA
=========================================================*/

/* ===========================
   LOAD ANNOUNCEMENTS
=========================== */

async function loadAnnouncements() {

    if (!announcementList) return;

    announcementList.innerHTML = "Loading...";

    try {

        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_date", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {

            announcementList.innerHTML =
                "<p>No Announcements Available</p>";

            return;

        }

        announcementList.innerHTML = "";

        data.forEach(item => {

            announcementList.innerHTML += `
                <div class="announcement-card">
                    <h3>${item.title}</h3>
                    <p>${item.message}</p>
                    <small>${item.created_date}</small>
                </div>
            `;

        });

    } catch (err) {

        console.error(err);

        announcementList.innerHTML =
            "<p>Unable to load announcements.</p>";

    }

}

/* ===========================
   LOAD DUTIES
=========================== */

async function loadDuties() {

    if (!dutyList || !currentMember) return;

    dutyList.innerHTML = "Loading...";

    try {

        const { data, error } = await supabase
            .from("duties")
            .select("*")
            .eq("member_mobile", currentMember.mobile)
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {

            dutyList.innerHTML =
                "<p>No Duties Assigned</p>";

            return;

        }

        dutyList.innerHTML = "";

        data.forEach(item => {

            dutyList.innerHTML += `
                <div class="duty-card">
                    <h3>${item.duty_title}</h3>
                    <p>${item.duty_description}</p>

                    <p>
                        <b>Status :</b>
                        ${item.status}
                    </p>

                    <p>
                        <b>Priority :</b>
                        ${item.priority}
                    </p>

                    <small>
                        ${item.assigned_date}
                    </small>
                </div>
            `;

        });

    } catch (err) {

        console.error(err);

        dutyList.innerHTML =
            "<p>Unable to load duties.</p>";

    }

}

/* ===========================
   LOAD CONTACTS
=========================== */

async function loadContacts() {

    if (!contactList) return;

    contactList.innerHTML = "Loading...";

    try {

        const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .order("name");

        if (error) throw error;

        if (!data || data.length === 0) {

            contactList.innerHTML =
                "<p>No Contacts Found</p>";

            return;

        }

        contactList.innerHTML = "";

        data.forEach(item => {

            contactList.innerHTML += `
                <div class="contact-card">

                    <h3>${item.name}</h3>

                    <p>
                        📞 ${item.phone}
                    </p>

                    <p>
                        WhatsApp :
                        ${item.whatsapp}
                    </p>

                    <p>
                        ${item.email}
                    </p>

                </div>
            `;

        });

    } catch (err) {

        console.error(err);

        contactList.innerHTML =
            "<p>Unable to load contacts.</p>";

    }

}
/* =========================================================
   PART 5
   NAVIGATION + ADMIN + UTILITIES
========================================================= */

/* ===========================
   SIDEBAR
=========================== */

function openSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("overlay");

    if (sidebar)
        sidebar.classList.add("active");

    if (overlay)
        overlay.classList.add("active");

}

function closeSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("overlay");

    if (sidebar)
        sidebar.classList.remove("active");

    if (overlay)
        overlay.classList.remove("active");

}

/* ===========================
   PAGE NAVIGATION
=========================== */

function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.style.display = "none";

        });

    const target =
        document.getElementById(pageId);

    if (target) {

        target.style.display = "block";

    }

    closeSidebar();

}

/* ===========================
   ADMIN CHECK
=========================== */

async function checkAdminAccess() {

    if (!currentMember) return false;

    try {

        const { data } = await supabase
            .from("admins")
            .select("*")
            .eq("mobile", currentMember.mobile)
            .eq("status", "Active")
            .maybeSingle();

        return !!data;

    } catch (e) {

        console.error(e);

        return false;

    }

}

/* ===========================
   REFRESH DATA
=========================== */

async function refreshDashboard() {

    if (!currentMember) return;

    await restoreSession();

    await loadAnnouncements();

    await loadDuties();

    await loadContacts();

}

/* ===========================
   AUTO REFRESH
=========================== */

setInterval(() => {

    if (isLoggedIn) {

        refreshDashboard();

    }

}, 60000);

/* ===========================
   ERROR HANDLER
=========================== */

window.addEventListener("error", (event) => {

    console.error("MSIM Error:", event.error);

});

/* ===========================
   APP VERSION
=========================== */

const APP_VERSION = "2.0.0";

/* ===========================
   READY
=========================== */

console.log("================================");
console.log("MSIM APP V2");
console.log("Version :", APP_VERSION);
console.log("Production Script Loaded");
console.log("================================");
