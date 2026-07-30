/* ==========================================
   MSIM APP v2
   FINAL SCRIPT
========================================== */

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");

const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

// ==========================================
// MENU
// ==========================================

function toggleMenu(){

    sideMenu.classList.toggle("active");

    overlay.classList.toggle("active");

}

// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(page){

    document
        .querySelectorAll(".page")
        .forEach(p=>p.style.display="none");

    document
        .getElementById(page)
        .style.display="block";

    sideMenu.classList.remove("active");

    overlay.classList.remove("active");

}

// ==========================================
// LOGIN
// ==========================================

async function login(){

    const mobile =
        document.getElementById("mobile").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if(!mobile || !password){

        alert("Enter mobile & password");

        return;

    }

    document
        .getElementById("loginStatus")
        .innerHTML="Checking...";
       try{

        const { data, error } = await supabase
            .from("members")
            .select("*")
            .eq("mobile", mobile)
            .eq("password", password)
            .single();

        if(error || !data){

            document
                .getElementById("loginStatus")
                .innerHTML="❌ Invalid Mobile or Password";

            return;

        }

        localStorage.setItem(
            "msim_member",
            JSON.stringify(data)
        );

        loadMember(data);

        loginPage.style.display="none";

        dashboard.style.display="block";

        showPage("home");

        refreshDashboard();

    }

    catch(err){

        console.error(err);

        document
            .getElementById("loginStatus")
            .innerHTML="❌ Login Failed";

    }

}

// ==========================================
// LOAD MEMBER
// ==========================================

function loadMember(member){

    document.getElementById("memberName").textContent =
        member.name || "-";

    document.getElementById("memberId").textContent =
        member.member_id || "-";

    document.getElementById("memberBranch").textContent =
        member.branch || "-";

    document.getElementById("memberStatus").textContent =
        member.status || "-";

    document.getElementById("joiningDate").textContent =
        member.joining_date || "-";

    if(member.photo_link){

        document.getElementById("memberPhoto").src =
            member.photo_link;

    }

    // Profile Page

    document.getElementById("profileName").textContent =
        member.name || "-";

    document.getElementById("profileMobile").textContent =
        member.mobile || "-";

    document.getElementById("profileMemberId").textContent =
        member.member_id || "-";

    document.getElementById("profileBranch").textContent =
        member.branch || "-";

    document.getElementById("profileStatus").textContent =
        member.status || "-";

    document.getElementById("profileJoining").textContent =
        member.joining_date || "-";

    if(member.photo_link){

        document.getElementById("profilePhoto").src =
            member.photo_link;

        document.getElementById("idPhoto").src =
            member.photo_link;

    }

    document.getElementById("idName").textContent =
        member.name || "-";

    document.getElementById("idMemberId").textContent =
        member.member_id || "-";

    document.getElementById("idBranch").textContent =
        member.branch || "-";

    document.getElementById("idStatus").textContent =
        member.status || "-";

}
/* ==========================================
   AUTO LOGIN
========================================== */

window.addEventListener("load", async () => {

    const saved = localStorage.getItem("msim_member");

    if(saved){

        const member = JSON.parse(saved);

        loadMember(member);

        loginPage.style.display = "none";

        dashboard.style.display = "block";

        showPage("home");

        await refreshDashboard();

    }

});

/* ==========================================
   LOGOUT
========================================== */

function logout(){

    localStorage.removeItem("msim_member");

    loginPage.style.display = "flex";

    dashboard.style.display = "none";

    toggleMenu();

}

/* ==========================================
   DUTIES
========================================== */

async function loadDuties(){

    const box = document.getElementById("dutiesList");

    box.innerHTML = "<p>Loading...</p>";

    const { data, error } = await supabase
        .from("duties")
        .select("*")
        .order("id",{ascending:false});

    if(error || !data){

        box.innerHTML = "<p>No Duties Found</p>";

        return;

    }

    box.innerHTML = "";

    data.forEach(item=>{

        box.innerHTML += `
        <div class="item-card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
        `;

    });

}

/* ==========================================
   ANNOUNCEMENTS
========================================== */

async function loadAnnouncements(){

    const box = document.getElementById("announcementList");

    box.innerHTML = "<p>Loading...</p>";

    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("id",{ascending:false});

    if(error || !data){

        box.innerHTML = "<p>No Announcements Found</p>";

        return;

    }

    box.innerHTML = "";

    data.forEach(item=>{

        box.innerHTML += `
        <div class="item-card">
            <h3>${item.title}</h3>
            <p>${item.message}</p>
        </div>
        `;

    });

}

/* ==========================================
   REFRESH DASHBOARD
========================================== */

async function refreshDashboard(){

    await loadDuties();

    await loadAnnouncements();

}

/* ==========================================
   SERVICE WORKER
========================================== */

if("serviceWorker" in navigator){

    window.addEventListener("load",()=>{

        navigator.serviceWorker
            .register("./sw.js")
            .then(()=>console.log("SW Registered"))
            .catch(console.error);

    });

}

console.log("MSIM APP v2 Ready");
