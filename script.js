// ======================================
// MSIM APP v2
// script.js PART 1
// Authentication System
// ======================================


// Wait for page load
document.addEventListener("DOMContentLoaded", () => {

    console.log("MSIM APP v2 Loaded");

    checkSession();

});


// ======================================
// LOGIN FUNCTION
// ======================================

async function login() {

    const mobile = document.getElementById("mobile").value.trim();
    const password = document.getElementById("password").value.trim();

    const errorBox = document.getElementById("error-message");
    const loginBtn = document.getElementById("login-btn");


    if (!mobile || !password) {

        errorBox.innerHTML = "Please enter mobile number and password";
        return;

    }


    loginBtn.innerHTML = "Checking...";
    loginBtn.disabled = true;


    try {


        const { data, error } = await supabase
            .from("members")
            .select("*")
            .eq("mobile", mobile)
            .eq("password", password)
            .single();



        if (error || !data) {

            errorBox.innerHTML = "Invalid mobile number or password";

            loginBtn.innerHTML = "Login";
            loginBtn.disabled = false;

            return;

        }



        // Save User Session

        localStorage.setItem(
            "msim_user",
            JSON.stringify(data)
        );


        errorBox.innerHTML = "";


        showDashboard(data);



    } catch (err) {


        console.log(err);

        errorBox.innerHTML =
        "Something went wrong. Try again";


    }



    loginBtn.innerHTML = "Login";
    loginBtn.disabled = false;


}



// ======================================
// SESSION CHECK
// ======================================

function checkSession(){


    const user =
    localStorage.getItem("msim_user");


    if(user){

        const data = JSON.parse(user);

        showDashboard(data);

    }


}



// ======================================
// LOGOUT
// ======================================

function logout(){


    localStorage.removeItem("msim_user");


    location.reload();


}



// ======================================
// DASHBOARD PLACEHOLDER
// ======================================

function showDashboard(user){


    console.log("Logged In User:", user);


    const loginPage =
    document.getElementById("login-page");


    const dashboard =
    document.getElementById("dashboard");



    if(loginPage){

        loginPage.style.display = "none";

    }



    if(dashboard){

        dashboard.style.display = "block";

    }


}
// ======================================
// MSIM APP v2
// script.js PART 2
// Member Dashboard System
// ======================================


// ======================================
// LOAD MEMBER DATA
// ======================================

function loadMemberData(){


    const user =
    localStorage.getItem("msim_user");


    if(!user){

        return;

    }


    const member = JSON.parse(user);


    document.getElementById("member-name").innerHTML =
    member.name || "Member";


    document.getElementById("member-id").innerHTML =
    member.member_id || "-";


    document.getElementById("member-mobile").innerHTML =
    member.mobile || "-";


    document.getElementById("member-branch").innerHTML =
    member.branch || "-";


    document.getElementById("member-department").innerHTML =
    member.department || "-";


    document.getElementById("member-status").innerHTML =
    member.status || "-";


    document.getElementById("member-date").innerHTML =
    member.joining_date || "-";



    // Profile Photo

    const photo =
    document.getElementById("profile-photo");


    if(photo){

        photo.src =
        member.photo ||
        "./assets/default-avatar.png";

    }


}



// ======================================
// SHOW DASHBOARD
// ======================================

function showDashboard(user){


    const loginPage =
    document.getElementById("login-page");


    const dashboard =
    document.getElementById("dashboard");



    if(loginPage){

        loginPage.style.display="none";

    }



    if(dashboard){

        dashboard.style.display="block";

    }



    loadMemberData();


}



// ======================================
// UPDATE PROFILE (BASE)
// ======================================

async function updateProfile(){


    console.log("Profile update system coming soon");


}



// ======================================
// UPLOAD PHOTO (BASE)
// ======================================

async function uploadPhoto(){


    console.log("Photo upload system coming soon");


}
// ======================================
// MSIM APP v2
// script.js PART 3
// Navigation System
// ======================================


// ======================================
// TOGGLE SIDEBAR
// ======================================

function toggleSidebar(){


    const sidebar =
    document.getElementById("sidebar");


    if(sidebar){

        sidebar.classList.toggle("active");

    }


}



// ======================================
// CLOSE SIDEBAR
// ======================================

function closeSidebar(){


    const sidebar =
    document.getElementById("sidebar");


    if(sidebar){

        sidebar.classList.remove("active");

    }


}



// ======================================
// SHOW PAGE SYSTEM
// ======================================

function showPage(page){


    const pages =
    document.querySelectorAll(".app-page");


    pages.forEach(section => {

        section.style.display="none";

    });



    const selectedPage =
    document.getElementById(page);



    if(selectedPage){

        selectedPage.style.display="block";

    }



    closeSidebar();


}



// ======================================
// DEFAULT PAGE
// ======================================

function openDashboard(){


    showPage("dashboard-home");


}
// ======================================
// MSIM APP v2
// script.js PART 4
// Duties + Announcements + Contacts
// ======================================



// ======================================
// LOAD DUTIES
// ======================================

async function loadDuties(){


    const user =
    JSON.parse(localStorage.getItem("msim_user"));


    if(!user){

        return;

    }


    try{


        const {data,error} =
        await supabase
        .from("duties")
        .select("*")
        .eq("member_id", user.member_id);



        if(error){

            console.log(error);
            return;

        }



        displayDuties(data);



    }catch(err){

        console.log(err);

    }


}



// ======================================
// DISPLAY DUTIES
// ======================================

function displayDuties(duties){


    const box =
    document.getElementById("duties-list");


    if(!box){

        return;

    }



    box.innerHTML="";



    duties.forEach(item=>{


        box.innerHTML += `

        <div class="duty-card">

            <h3>${item.title}</h3>

            <p>${item.description}</p>

            <span>
            ${item.status}
            </span>

        </div>

        `;


    });


}




// ======================================
// LOAD ANNOUNCEMENTS
// ======================================

async function loadAnnouncements(){


    try{


        const {data,error} =
        await supabase
        .from("announcements")
        .select("*")
        .order("created_at",
        {ascending:false});



        if(error){

            console.log(error);
            return;

        }



        displayAnnouncements(data);



    }catch(err){

        console.log(err);

    }


}



// ======================================
// DISPLAY ANNOUNCEMENTS
// ======================================

function displayAnnouncements(data){


    const box =
    document.getElementById("announcement-list");


    if(!box){

        return;

    }



    box.innerHTML="";



    data.forEach(item=>{


        box.innerHTML += `

        <div class="announcement-card">

            <h3>${item.title}</h3>

            <p>${item.description}</p>

        </div>

        `;


    });


}





// ======================================
// LOAD CONTACTS
// ======================================

async function loadContacts(){


    try{


        const {data,error} =
        await supabase
        .from("contacts")
        .select("*");



        if(error){

            console.log(error);
            return;

        }



        const box =
        document.getElementById("contact-list");



        if(!box){

            return;

        }



        box.innerHTML="";



        data.forEach(person=>{


            box.innerHTML += `

            <div class="contact-card">

                <h3>
                ${person.name}
                </h3>

                <p>
                ${person.designation}
                </p>

                <p>
                ${person.mobile}
                </p>

            </div>

            `;


        });



    }catch(err){

        console.log(err);

    }


}
// ======================================
// MSIM APP v2
// script.js PART 5
// Digital ID Card + Downloads
// ======================================



// ======================================
// GENERATE DIGITAL ID CARD
// ======================================

function generateIDCard(){


    const user =
    JSON.parse(localStorage.getItem("msim_user"));



    if(!user){

        return;

    }



    document.getElementById("id-name").innerHTML =
    user.name || "-";


    document.getElementById("id-member").innerHTML =
    user.member_id || "-";


    document.getElementById("id-branch").innerHTML =
    user.branch || "-";


    document.getElementById("id-department").innerHTML =
    user.department || "-";



    const img =
    document.getElementById("id-photo");



    if(img){

        img.src =
        user.photo ||
        "./assets/default-avatar.png";

    }



}




// ======================================
// DOWNLOAD ID CARD (BASE)
// ======================================

function downloadIDCard(){


    const card =
    document.getElementById("digital-id-card");



    if(!card){

        alert("ID Card not found");

        return;

    }



    console.log("ID Card download system ready");


    // Future:
    // html2canvas + PDF generation


}




// ======================================
// LOAD DOWNLOADS
// ======================================

async function loadFiles(){


    console.log(
    "Downloads system ready"
    );


    /*
    
    Future Supabase Storage:

    - Certificates
    - Notices
    - Documents
    - Forms

    */

}
// ======================================
// MSIM APP v2
// script.js PART 6
// Admin Panel System
// ======================================



// ======================================
// CHECK ADMIN
// ======================================

async function checkAdmin(){


    const user =
    JSON.parse(localStorage.getItem("msim_user"));



    if(!user){

        return false;

    }



    if(user.role === "admin" || user.role === "super_admin"){

        return true;

    }


    return false;


}



// ======================================
// ADD MEMBER
// ======================================

async function addMember(memberData){


    try{


        const {data,error} =
        await supabase
        .from("members")
        .insert([memberData]);



        if(error){

            console.log(error);

            alert("Member add failed");

            return;

        }



        alert("Member Added Successfully");


    }
    catch(err){

        console.log(err);

    }


}




// ======================================
// EDIT MEMBER
// ======================================

async function editMember(id, updateData){


    try{


        const {data,error} =
        await supabase
        .from("members")
        .update(updateData)
        .eq("id",id);



        if(error){

            console.log(error);

            return;

        }



        alert("Member Updated");


    }
    catch(err){

        console.log(err);

    }


}





// ======================================
// DELETE MEMBER
// ======================================

async function deleteMember(id){



    let confirmDelete =
    confirm(
    "Delete this member?"
    );



    if(!confirmDelete){

        return;

    }



    const {error} =
    await supabase
    .from("members")
    .delete()
    .eq("id",id);



    if(error){

        console.log(error);

        return;

    }



    alert(
    "Member Deleted"
    );


}





// ======================================
// SEARCH MEMBERS
// ======================================

async function searchMembers(keyword){



    try{


        const {data,error} =
        await supabase
        .from("members")
        .select("*")
        .ilike(
        "name",
        `%${keyword}%`
        );



        if(error){

            console.log(error);

            return;

        }



        console.log(
        data
        );



    }
    catch(err){

        console.log(err);

    }


}
// ======================================
// MSIM APP v2
// script.js PART 7
// Supabase Storage System
// ======================================



// ======================================
// UPLOAD PROFILE PHOTO
// ======================================

async function uploadPhoto(){


    const fileInput =
    document.getElementById("photo-upload");


    const file =
    fileInput.files[0];


    if(!file){

        alert("Select photo first");

        return;

    }



    const user =
    JSON.parse(
    localStorage.getItem("msim_user")
    );



    if(!user){

        return;

    }



    try{


        const fileName =
        "profile_" +
        user.member_id +
        "_" +
        Date.now();



        const {data,error} =
        await supabase
        .storage
        .from("profile-images")
        .upload(
            fileName,
            file
        );



        if(error){

            console.log(error);

            alert("Upload failed");

            return;

        }




        const {data:urlData} =
        supabase
        .storage
        .from("profile-images")
        .getPublicUrl(fileName);



        const photoURL =
        urlData.publicUrl;




        // Update Database

        await supabase
        .from("members")
        .update({
            photo: photoURL
        })
        .eq(
            "id",
            user.id
        );



        user.photo =
        photoURL;



        localStorage.setItem(
            "msim_user",
            JSON.stringify(user)
        );



        alert(
        "Photo Updated Successfully"
        );



        loadMemberData();



    }
    catch(err){

        console.log(err);

    }


}




// ======================================
// FILE UPLOAD SYSTEM
// ======================================

async function uploadFile(){


    console.log(
    "Document upload system ready"
    );


    /*
    
    Future Storage:

    - Certificates
    - Notices
    - Forms
    - Documents

    */


}
// ======================================
// MSIM APP v2
// script.js PART 8
// Security + Error Handling
// ======================================



// ======================================
// SESSION PROTECTION
// ======================================

function protectPage(){


    const user =
    localStorage.getItem("msim_user");



    if(!user){


        const dashboard =
        document.getElementById("dashboard");


        if(dashboard){

            dashboard.style.display="none";

        }


        const loginPage =
        document.getElementById("login-page");


        if(loginPage){

            loginPage.style.display="block";

        }


        return false;

    }


    return true;


}





// ======================================
// CLEAR SESSION
// ======================================

function clearSession(){


    localStorage.removeItem(
    "msim_user"
    );


    localStorage.removeItem(
    "msim_admin"
    );


}





// ======================================
// LOADING MESSAGE
// ======================================

function showLoading(message="Loading..."){


    const loader =
    document.getElementById("loader");


    if(loader){

        loader.innerHTML = message;

        loader.style.display="block";

    }


}




function hideLoading(){


    const loader =
    document.getElementById("loader");


    if(loader){

        loader.style.display="none";

    }


}





// ======================================
// TOAST MESSAGE
// ======================================

function showToast(message,type="success"){



    const toast =
    document.getElementById("toast");



    if(!toast){

        alert(message);

        return;

    }



    toast.innerHTML = message;


    toast.className =
    "toast " + type;


    toast.style.display="block";



    setTimeout(()=>{


        toast.style.display="none";


    },3000);



}





// ======================================
// GLOBAL ERROR HANDLER
// ======================================

window.onerror = function(
message,
source,
line
){


    console.log(
    "Error:",
    message,
    "Line:",
    line
    );


};
