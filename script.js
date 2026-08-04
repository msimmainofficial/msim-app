// ===============================
// MSIM APP V2 - SCRIPT.JS
// PART 1 - CONFIG & STARTUP
// ===============================

// Supabase Client
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Global Variables
let currentMember = null;
let currentAdmin = null;

// App Start
document.addEventListener("DOMContentLoaded", async () => {

    console.log("MSIM APP Started");

    // Internet Check
    checkInternet();

    // Splash Screen
    showSplash();

    // Register Service Worker
    registerSW();

    // Auto Login
    await checkSavedLogin();

});

// ===============================
// INTERNET STATUS
// ===============================

function checkInternet() {

    if (!navigator.onLine) {
        alert("No Internet Connection");
    }

    window.addEventListener("offline", () => {
        alert("Internet Disconnected");
    });

    window.addEventListener("online", () => {
        alert("Internet Connected");
    });
}

// ===============================
// SPLASH SCREEN
// ===============================

function showSplash() {

    const splash = document.getElementById("splashScreen");

    if (!splash) return;

    setTimeout(() => {

        splash.style.opacity = "0";

        setTimeout(() => {

            splash.style.display = "none";

        }, 500);

    }, 2500);
}

// ===============================
// SERVICE WORKER
// ===============================

function registerSW() {

    if ("serviceWorker" in navigator) {

        navigator.serviceWorker.register("./sw.js")
            .then(() => {
                console.log("Service Worker Registered");
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

// ===============================
// PAGE CHANGE
// ===============================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.style.display = "block";
    }
}

// ===============================
// LOADING
// ===============================

function showLoading() {

    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.display = "flex";
    }
}

function hideLoading() {

    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.display = "none";
    }
}
        if (error || !data) {

            showLoading(false);
            alert("Invalid Mobile Number or Password");
            return;

        }

        if (data.status !== "Active") {

            showLoading(false);
            alert("Your Account is Inactive");
            return;

        }

        currentUser = data;

        // Save Session
        localStorage.setItem(
            "msimUser",
            JSON.stringify(data)
        );

        // Load Dashboard
        loadDashboard(data);

        // Hide Login Page
        const loginPage = document.getElementById("loginPage");

        if (loginPage) {
            loginPage.style.display = "none";
        }

        // Show Dashboard
        const dashboard = document.getElementById("dashboard");

        if (dashboard) {
            dashboard.style.display = "block";
        }

        showLoading(false);

    } catch (err) {

        console.log(err);

        showLoading(false);

        alert("Login Failed");

    }

}

// --------------------------------
// Auto Login
// --------------------------------

function autoLogin() {

    const session =
        localStorage.getItem("msimUser");

    if (!session) return;

    currentUser = JSON.parse(session);

    loadDashboard(currentUser);

    const loginPage =
        document.getElementById("loginPage");

    if (loginPage) {
        loginPage.style.display = "none";
    }

    const dashboard =
        document.getElementById("dashboard");

    if (dashboard) {
        dashboard.style.display = "block";
    }

}

// --------------------------------
// Logout
// --------------------------------

function logout() {

    localStorage.removeItem("msimUser");

    location.reload();

}
// --------------------------------
// Load Dashboard
// --------------------------------

function loadDashboard(user) {

    if (!user) return;

    // Member Name
    const memberName = document.getElementById("memberName");
    if (memberName) {
        memberName.textContent = user.name || "";
    }

    // Member ID
    const memberId = document.getElementById("memberId");
    if (memberId) {
        memberId.textContent = user.member_id || "";
    }

    // Branch
    const memberBranch = document.getElementById("memberBranch");
    if (memberBranch) {
        memberBranch.textContent = user.branch || "";
    }

    // Designation
    const memberDesignation = document.getElementById("memberDesignation");
    if (memberDesignation) {
        memberDesignation.textContent = user.designation || "";
    }

    // Joining Date
    const joiningDate = document.getElementById("joiningDate");
    if (joiningDate) {
        joiningDate.textContent = user.joining_date || "";
    }

    // Status
    const memberStatus = document.getElementById("memberStatus");
    if (memberStatus) {

        memberStatus.textContent = user.status || "Unknown";

        if (user.status === "Active") {
            memberStatus.classList.add("active");
        } else {
            memberStatus.classList.add("inactive");
        }
    }

    // Profile Photo
    const profilePhoto = document.getElementById("profilePhoto");

    if (profilePhoto) {

        if (user.photo_link && user.photo_link !== "") {

            profilePhoto.src = user.photo_link;

        } else {

            profilePhoto.src = "assets/default-avatar.png";

        }

    }

    // ID Card Button
    const idCardBtn = document.getElementById("idCardBtn");

    if (idCardBtn) {

        idCardBtn.onclick = function () {

            if (user.id_card_link) {

                window.open(user.id_card_link, "_blank");

            } else {

                alert("ID Card Not Available");

            }

        };

    }

}
// --------------------------------
// Loading Function
// --------------------------------

function showLoading(show) {

    const loading = document.getElementById("loadingScreen");

    if (!loading) return;

    if (show) {
        loading.style.display = "flex";
    } else {
        loading.style.display = "none";
    }

}

// --------------------------------
// Page Navigation
// --------------------------------

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.style.display = "none";
    });

    const currentPage = document.getElementById(pageId);

    if (currentPage) {
        currentPage.style.display = "block";
    }

}

// --------------------------------
// Side Menu
// --------------------------------

function openMenu() {

    const menu = document.getElementById("sideMenu");

    if (menu) {
        menu.classList.add("open");
    }

}

function closeMenu() {

    const menu = document.getElementById("sideMenu");

    if (menu) {
        menu.classList.remove("open");
    }

}

// --------------------------------
// Refresh Member Data
// --------------------------------

async function refreshProfile() {

    if (!currentUser) return;

    try {

        const { data, error } = await supabase
            .from("members")
            .select("*")
            .eq("member_id", currentUser.member_id)
            .single();

        if (error || !data) return;

        currentUser = data;

        localStorage.setItem(
            "msimUser",
            JSON.stringify(data)
        );

        loadDashboard(data);

    } catch (err) {

        console.log(err);

    }

}

// --------------------------------
// Global Error Handler
// --------------------------------

window.onerror = function (message, source, line, column, error) {

    console.error("MSIM Error:", message);

    return false;

};

// --------------------------------
// App Ready
// --------------------------------

console.log("================================");
console.log("MSIM APP V2 READY");
console.log("Supabase Connected");
console.log("Login System Ready");
console.log("Dashboard Ready");
console.log("================================");
// --------------------------------
// Load Duties
// --------------------------------

async function loadDuties() {

    if (!currentUser) return;

    try {

        const { data, error } = await supabase
            .from("duties")
            .select("*")
            .eq("member_id", currentUser.member_id);

        if (error) {
            console.log(error);
            return;
        }

        console.log("Duties Loaded", data);

    } catch (err) {

        console.log(err);

    }

}

// --------------------------------
// Load Announcements
// --------------------------------

async function loadAnnouncements() {

    try {

        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.log(error);
            return;
        }

        console.log("Announcements Loaded", data);

    } catch (err) {

        console.log(err);

    }

}

// --------------------------------
// Load Contacts
// --------------------------------

async function loadContacts() {

    try {

        const { data, error } = await supabase
            .from("contacts")
            .select("*");

        if (error) {
            console.log(error);
            return;
        }

        console.log("Contacts Loaded", data);

    } catch (err) {

        console.log(err);

    }

}

// --------------------------------
// App Initialize
// --------------------------------

async function initializeApp() {

    await refreshProfile();

    await loadDuties();

    await loadAnnouncements();

    await loadContacts();

}

// --------------------------------
// Start After Login
// --------------------------------

if (currentUser) {

    initializeApp();

}

console.log("MSIM APP V2 Production Script Loaded Successfully");
