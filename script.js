/* ==========================================
   MSIM APP v2
   script.js
========================================== */

// DOM Elements
const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");

const mobileInput = document.getElementById("mobile");
const passwordInput = document.getElementById("password");

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sideDrawer = document.getElementById("sideDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");

const logoutBtn = document.getElementById("logoutBtn");

// Member Fields
const memberName = document.getElementById("memberName");
const welcomeName = document.getElementById("welcomeName");
const memberID = document.getElementById("memberID");
const memberBranch = document.getElementById("memberBranch");
const memberStatus = document.getElementById("memberStatus");
const joiningDate = document.getElementById("joiningDate");
const memberPhoto = document.getElementById("memberPhoto");

// Drawer Controls
if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        sideDrawer.classList.add("open");
        drawerOverlay.classList.add("show");
    });
}

if (closeMenu) {
    closeMenu.addEventListener("click", closeDrawer);
}

if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeDrawer);
}

function closeDrawer() {
    sideDrawer.classList.remove("open");
    drawerOverlay.classList.remove("show");
}
/* ==========================================
   LOGIN (SUPABASE)
========================================== */

async function login() {

    const mobile = mobileInput.value.trim();
    const password = passwordInput.value.trim();

    if (!mobile || !password) {
        alert("Please enter mobile number and password.");
        return;
    }

    try {

        const { data, error } = await supabase
            .from("members")
            .select("*")
            .eq("mobile", mobile)
            .eq("password", password)
            .single();

        if (error || !data) {
            alert("Invalid mobile number or password.");
            return;
        }

        // Save session
        localStorage.setItem("msim_member", JSON.stringify(data));

        loadMember(data);

        loginPage.style.display = "none";
        dashboard.style.display = "block";

    } catch (err) {

        console.error(err);
        alert("Login failed. Please try again.");

    }

}

/* ==========================================
   LOAD MEMBER
========================================== */

function loadMember(member) {

    memberName.textContent = member.name || "-";
    welcomeName.textContent = "Welcome, " + (member.name || "Member");

    memberID.textContent = member.member_id || "-";
    memberBranch.textContent = member.branch || "-";
    memberStatus.textContent = member.status || "-";
    joiningDate.textContent = member.joining_date || "-";

    if (member.photo_link) {
        memberPhoto.src = member.photo_link;
    }

}

/* ==========================================
   AUTO LOGIN
========================================== */

window.addEventListener("load", () => {

    const saved = localStorage.getItem("msim_member");

    if (!saved) return;

    const member = JSON.parse(saved);

    loadMember(member);

    loginPage.style.display = "none";
    dashboard.style.display = "block";

});
/* ==========================================
   LOGOUT
========================================== */

function logout() {

    localStorage.removeItem("msim_member");

    closeDrawer();

    dashboard.style.display = "none";
    loginPage.style.display = "flex";

    if (mobileInput) mobileInput.value = "";
    if (passwordInput) passwordInput.value = "";

}

/* ==========================================
   MENU NAVIGATION
========================================== */

const menuItems = {

    menuDashboard: "dashboard",

    menuProfile: "profilePage",

    menuID: "idCardPage",

    menuDuties: "dutiesPage",

    menuAnnouncements: "announcementsPage",

    menuContacts: "contactsPage"

};

Object.keys(menuItems).forEach(id => {

    const item = document.getElementById(id);

    if (!item) return;

    item.addEventListener("click", () => {

        closeDrawer();

        showPage(menuItems[id]);

    });

});

/* ==========================================
   PAGE SWITCHING
========================================== */

function showPage(page) {

    const pages = [

        "dashboard",

        "profilePage",

        "idCardPage",

        "dutiesPage",

        "announcementsPage",

        "contactsPage"

    ];

    pages.forEach(id => {

        const el = document.getElementById(id);

        if (el) {

            el.style.display = "none";

        }

    });

    const active = document.getElementById(page);

    if (active) {

        active.style.display = "block";

    }

}

/* ==========================================
   LOGOUT BUTTON
========================================== */

if (logoutBtn) {

    logoutBtn.addEventListener("click", logout);

}

/* Dashboard Buttons */

document.getElementById("btnProfile")?.addEventListener("click", () => showPage("profilePage"));

document.getElementById("btnID")?.addEventListener("click", () => showPage("idCardPage"));

document.getElementById("btnDuties")?.addEventListener("click", () => showPage("dutiesPage"));

document.getElementById("btnContacts")?.addEventListener("click", () => showPage("contactsPage"));
/* ==========================================
   LIVE DUTIES
========================================== */

async function loadDuties() {

    const dutiesBox = document.getElementById("dutiesList");

    if (!dutiesBox) return;

    dutiesBox.innerHTML = "<p>Loading duties...</p>";

    try {

        const { data, error } = await supabase
            .from("duties")
            .select("*")
            .order("id", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            dutiesBox.innerHTML =
                '<p class="empty-text">No duties available.</p>';
            return;
        }

        dutiesBox.innerHTML = data.map(item => `
            <div class="card mt-10">
                <h3>${item.title || "Duty"}</h3>
                <p>${item.description || ""}</p>
            </div>
        `).join("");

    } catch (err) {

        console.error("Duties Error:", err);

        dutiesBox.innerHTML =
            '<p class="empty-text">Unable to load duties.</p>';

    }

}

/* ==========================================
   LIVE ANNOUNCEMENTS
========================================== */

async function loadAnnouncements() {

    const announcementBox =
        document.getElementById("announcementList");

    if (!announcementBox) return;

    announcementBox.innerHTML =
        "<p>Loading announcements...</p>";

    try {

        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("id", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {

            announcementBox.innerHTML =
                '<p class="empty-text">No announcements available.</p>';

            return;

        }

        announcementBox.innerHTML = data.map(item => `
            <div class="card mt-10">
                <h3>${item.title || "Announcement"}</h3>
                <p>${item.message || ""}</p>
            </div>
        `).join("");

    } catch (err) {

        console.error("Announcement Error:", err);

        announcementBox.innerHTML =
            '<p class="empty-text">Unable to load announcements.</p>';

    }

}

/* ==========================================
   REFRESH DASHBOARD
========================================== */

async function refreshDashboard() {

    await Promise.all([
        loadDuties(),
        loadAnnouncements()
    ]);

}
/* ==========================================
   APP INITIALIZATION
========================================== */

window.addEventListener("load", async () => {

    try {

        if (localStorage.getItem("msim_member")) {

            await refreshDashboard();

        }

    } catch (e) {

        console.error(e);

    }

});

/* ==========================================
   PWA INSTALL
========================================== */

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    console.log("PWA install available.");

});

async function installApp() {

    if (!deferredPrompt) {

        alert("Install option is not available yet.");

        return;

    }

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

}

/* ==========================================
   SERVICE WORKER
========================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {

                console.log("Service Worker Registered");

            })
            .catch(err => {

                console.error(err);

            });

    });

}

console.log("MSIM APP v2 Loaded");
