// ======================================
// MSIM APP v2
// SCRIPT PART 1
// STARTUP + AUTHENTICATION
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("MSIM APP v2 Loaded");

    // Splash Screen
    setTimeout(() => {

        const splash =
        document.getElementById("splashScreen");

        const login =
        document.getElementById("loginScreen");

        if (splash) {
            splash.classList.remove("active");
        }

        if (login) {
            login.classList.add("active");
        }

    }, 2000);

    // Service Worker
    if ("serviceWorker" in navigator) {

        navigator.serviceWorker
        .register("./sw.js")
        .then(() => {

            console.log("PWA Ready");

        })
        .catch((err) => {

            console.log(err);

        });

    }

    checkSession();

});


// ======================================
// LOGIN
// ======================================

async function login() {

    const mobile =
    document.getElementById("mobile")?.value.trim();

    const password =
    document.getElementById("password")?.value.trim();

    const loginBtn =
    document.getElementById("loginBtn");

    const loginMessage =
    document.getElementById("loginMessage");

    if (!mobile || !password) {

        if (loginMessage) {

            loginMessage.innerHTML =
            "Please enter mobile number and password";

        }

        return;
    }

    if (loginBtn) {

        loginBtn.disabled = true;
        loginBtn.innerHTML = "Checking...";

    }

    try {

        const { data, error } =
        await supabase
        .from("members")
        .select("*")
        .eq("mobile", mobile)
        .eq("password", password)
        .single();

        if (error || !data) {

            if (loginMessage) {

                loginMessage.innerHTML =
                "Invalid Mobile Number or Password";

            }

            if (loginBtn) {

                loginBtn.disabled = false;
                loginBtn.innerHTML = "Login";

            }

            return;
        }

        localStorage.setItem(
            "msim_user",
            JSON.stringify(data)
        );

        showDashboard(data);

    } catch (err) {

        console.log(err);

        if (loginMessage) {

            loginMessage.innerHTML =
            "Login Failed";

        }

    }

    if (loginBtn) {

        loginBtn.disabled = false;
        loginBtn.innerHTML = "Login";

    }

}


// ======================================
// CHECK SESSION
// ======================================

function checkSession() {

    const user =
    localStorage.getItem("msim_user");

    if (!user) {
        return;
    }

    showDashboard(JSON.parse(user));

}

function checkSession() {

    const user =
    localStorage.getItem("msim_user");

    if (!user) {
        return;
    }

    showDashboard(JSON.parse(user));

}



//
// Yahan se Part 2 start
//

function loadMemberData() {

}

// ======================================
// MSIM APP v2
// SCRIPT PART 2
// DASHBOARD + MEMBER DATA
// ======================================

function showDashboard(user) {

    const loginScreen =
    document.getElementById("loginScreen");

    const dashboard =
    document.getElementById("dashboard");

    if (loginScreen) {

        loginScreen.classList.remove("active");

    }

    if (dashboard) {

        dashboard.classList.add("active");

    }

    loadMemberData();

    loadAnnouncements();

    loadDuties();

}


// ======================================
// LOAD MEMBER DATA
// ======================================

function loadMemberData() {

    const user =
    localStorage.getItem("msim_user");

    if (!user) {
        return;
    }

    const member =
    JSON.parse(user);

    const setText = (id, value) => {

        const el =
        document.getElementById(id);

        if (el) {

            el.innerHTML =
            value || "-";

        }

    };

    setText(
        "member-name",
        member.name
    );

    setText(
        "member-id",
        member.member_id
    );

    setText(
        "member-mobile",
        member.mobile
    );

    setText(
        "member-branch",
        member.branch
    );

    setText(
        "member-department",
        member.department
    );

    setText(
        "member-status",
        member.status
    );

    setText(
        "member-date",
        member.joining_date
    );

    const photo =
    document.getElementById(
        "profile-photo"
    );

    if (photo) {

        photo.src =
        member.photo ||
        "./assets/default-avatar.png";

    }

}


// ======================================
// LOGOUT
// ======================================

function logout() {

    localStorage.removeItem(
        "msim_user"
    );

    location.reload();

}

// ======================================
// MSIM APP v2
// SCRIPT PART 3
// DUTIES SYSTEM
// ======================================

async function loadDuties() {

    const user =
    JSON.parse(
        localStorage.getItem(
            "msim_user"
        )
    );

    if (!user) {
        return;
    }

    try {

        const { data, error } =
        await supabase
        .from("duties")
        .select("*")
        .eq(
            "member_id",
            user.member_id
        );

        if (error) {

            console.log(error);
            return;

        }

        displayDuties(
            data || []
        );

    } catch (err) {

        console.log(err);

    }

}


// ======================================
// DISPLAY DUTIES
// ======================================

function displayDuties(duties) {

    const box =
    document.getElementById(
        "duties-list"
    );

    if (!box) {
        return;
    }

    box.innerHTML = "";

    if (duties.length === 0) {

        box.innerHTML = `
        <div class="empty-box">
            No Duties Assigned
        </div>
        `;

        return;
    }

    duties.forEach(item => {

        box.innerHTML += `
        <div class="duty-card">

            <h3>
                ${item.title || ""}
            </h3>

            <p>
                ${item.description || ""}
            </p>

            <span>
                ${item.status || "Pending"}
            </span>

        </div>
        `;

    });

}


// ======================================
// REFRESH DUTIES
// ======================================

function refreshDuties() {

    loadDuties();

}

// ======================================
// MSIM APP v2
// SCRIPT PART 4
// ANNOUNCEMENTS SYSTEM
// ======================================

async function loadAnnouncements() {

    try {

        const { data, error } =
        await supabase
        .from("announcements")
        .select("*")
        .order(
            "created_at",
            { ascending: false }
        );

        if (error) {

            console.log(error);
            return;

        }

        displayAnnouncements(
            data || []
        );

    } catch (err) {

        console.log(err);

    }

}


// ======================================
// DISPLAY ANNOUNCEMENTS
// ======================================

function displayAnnouncements(
    announcements
) {

    const box =
    document.getElementById(
        "announcements-list"
    );

    if (!box) {
        return;
    }

    box.innerHTML = "";

    if (
        announcements.length === 0
    ) {

        box.innerHTML = `
        <div class="empty-box">
            No Announcements Available
        </div>
        `;

        return;

    }

    announcements.forEach(item => {

        box.innerHTML += `

        <div class="announcement-card">

            <h3>
                ${item.title || ""}
            </h3>

            <p>
                ${item.message || ""}
            </p>

            <small>
                ${item.created_at || ""}
            </small>

        </div>

        `;

    });

}


// ======================================
// REFRESH ANNOUNCEMENTS
// ======================================

function refreshAnnouncements() {

    loadAnnouncements();

}

// ======================================
// MSIM APP v2
// SCRIPT PART 5
// NAVIGATION SYSTEM
// ======================================

function showScreen(screenId) {

    const screens =
    document.querySelectorAll(".screen");

    screens.forEach(screen => {

        screen.classList.remove("active");

    });

    const target =
    document.getElementById(screenId);

    if (target) {

        target.classList.add("active");

    }

}


// ======================================
// DASHBOARD
// ======================================

function openDashboard() {

    showScreen("dashboard");

}


// ======================================
// PROFILE
// ======================================

function openProfile() {

    showScreen("profileScreen");

}


// ======================================
// DUTIES
// ======================================

function openDuties() {

    showScreen("dutiesScreen");

    loadDuties();

}


// ======================================
// ANNOUNCEMENTS
// ======================================

function openAnnouncements() {

    showScreen("announcementsScreen");

    loadAnnouncements();

}


// ======================================
// CONTACTS
// ======================================

function openContacts() {

    showScreen("contactsScreen");

}


// ======================================
// ABOUT MISSION
// ======================================

function showAbout() {

    alert(
        "Mission Syedi Ikram E Millat\nVersion 2.0.0"
    );

}


// ======================================
// CONTACT ADMIN
// ======================================

function contactAdmin() {

    window.location.href =
    "tel:+919867310766";

}

// ======================================
// MSIM APP v2
// SCRIPT PART 6
// PROFILE SYSTEM
// ======================================

async function updateProfile() {

    const user =
    JSON.parse(
        localStorage.getItem(
            "msim_user"
        )
    );

    if (!user) {
        return;
    }

    try {

        const { error } =
        await supabase
        .from("members")
        .update({

            name:
            document.getElementById(
                "edit-name"
            )?.value || user.name,

            mobile:
            document.getElementById(
                "edit-mobile"
            )?.value || user.mobile

        })
        .eq(
            "member_id",
            user.member_id
        );

        if (error) {

            console.log(error);
            alert(
                "Profile Update Failed"
            );

            return;

        }

        alert(
            "Profile Updated Successfully"
        );

    } catch (err) {

        console.log(err);

    }

}


// ======================================
// PHOTO UPLOAD
// ======================================

async function uploadPhoto() {

    const fileInput =
    document.getElementById(
        "photoInput"
    );

    if (
        !fileInput ||
        !fileInput.files.length
    ) {
        return;
    }

    const file =
    fileInput.files[0];

    const fileName =
    Date.now() +
    "-" +
    file.name;

    try {

        const { error } =
        await supabase.storage
        .from("member-photos")
        .upload(
            fileName,
            file
        );

        if (error) {

            console.log(error);
            alert(
                "Photo Upload Failed"
            );

            return;

        }

        const {
            data
        } =
        supabase.storage
        .from("member-photos")
        .getPublicUrl(
            fileName
        );

        const user =
        JSON.parse(
            localStorage.getItem(
                "msim_user"
            )
        );

        if (!user) {
            return;
        }

        await supabase
        .from("members")
        .update({

            photo:
            data.publicUrl

        })
        .eq(
            "member_id",
            user.member_id
        );

        user.photo =
        data.publicUrl;

        localStorage.setItem(
            "msim_user",
            JSON.stringify(user)
        );

        loadMemberData();

        alert(
            "Photo Uploaded"
        );

    } catch (err) {

        console.log(err);

    }

}

// ======================================
// MSIM APP v2
// SCRIPT PART 7
// CONTACTS DIRECTORY
// ======================================

let contactsData = [];


// ======================================
// LOAD CONTACTS
// ======================================

async function loadContacts() {

    try {

        const { data, error } =
        await supabase
        .from("members")
        .select("*")
        .order(
            "name",
            { ascending: true }
        );

        if (error) {

            console.log(error);
            return;

        }

        contactsData =
        data || [];

        displayContacts(
            contactsData
        );

    } catch (err) {

        console.log(err);

    }

}


// ======================================
// DISPLAY CONTACTS
// ======================================

function displayContacts(list) {

    const box =
    document.getElementById(
        "contacts-list"
    );

    if (!box) {
        return;
    }

    box.innerHTML = "";

    if (list.length === 0) {

        box.innerHTML = `
        <div class="empty-box">
            No Contacts Found
        </div>
        `;

        return;

    }

    list.forEach(member => {

        box.innerHTML += `

        <div class="contact-card">

            <h3>
                ${member.name || ""}
            </h3>

            <p>
                ${member.department || ""}
            </p>

            <p>
                ${member.mobile || ""}
            </p>

        </div>

        `;

    });

}


// ======================================
// SEARCH CONTACTS
// ======================================

function searchContacts() {

    const keyword =
    document.getElementById(
        "contact-search"
    )?.value
    .toLowerCase()
    .trim();

    if (!keyword) {

        displayContacts(
            contactsData
        );

        return;

    }

    const filtered =
    contactsData.filter(member =>

        (member.name || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (member.department || "")
        .toLowerCase()
        .includes(keyword)

    );

    displayContacts(
        filtered
    );

}


// ======================================
// OPEN CONTACTS SCREEN
// ======================================

function openContacts() {

    showScreen(
        "contactsScreen"
    );

    loadContacts();

}

// ======================================
// MSIM APP v2
// SCRIPT PART 8
// ID CARD + UTILITIES
// ======================================


// ======================================
// MEMBER ID CARD
// ======================================

function loadIdCard() {

    const user =
    JSON.parse(
        localStorage.getItem(
            "msim_user"
        )
    );

    if (!user) {
        return;
    }

    const setValue = (
        id,
        value
    ) => {

        const el =
        document.getElementById(id);

        if (el) {

            el.innerHTML =
            value || "-";

        }

    };

    setValue(
        "idcard-name",
        user.name
    );

    setValue(
        "idcard-memberid",
        user.member_id
    );

    setValue(
        "idcard-branch",
        user.branch
    );

    setValue(
        "idcard-department",
        user.department
    );

    const photo =
    document.getElementById(
        "idcard-photo"
    );

    if (photo) {

        photo.src =
        user.photo ||
        "./assets/default-avatar.png";

    }

}


// ======================================
// OPEN ID CARD
// ======================================

function openIdCard() {

    showScreen(
        "idCardScreen"
    );

    loadIdCard();

}


// ======================================
// PRINT ID CARD
// ======================================

function printIdCard() {

    window.print();

}


// ======================================
// COPY MEMBER ID
// ======================================

function copyMemberId() {

    const user =
    JSON.parse(
        localStorage.getItem(
            "msim_user"
        )
    );

    if (!user) {
        return;
    }

    navigator.clipboard
    .writeText(
        user.member_id || ""
    );

    alert(
        "Member ID Copied"
    );

}


// ======================================
// REFRESH APP
// ======================================

function refreshApp() {

    location.reload();

}


// ======================================
// CLEAR CACHE
// ======================================

async function clearAppCache() {

    try {

        const names =
        await caches.keys();

        await Promise.all(

            names.map(name =>

                caches.delete(name)

            )

        );

        alert(
            "Cache Cleared"
        );

    } catch (err) {

        console.log(err);

    }

}


// ======================================
// APP VERSION
// ======================================

function appVersion() {

    return "2.0.0";

}


// ======================================
// END OF SCRIPT
// ======================================

console.log(
    "MSIM APP v2 Ready"
);

