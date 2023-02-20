import { works } from "./catalogue.js";
console.log("admin.js en chargement");
export{destroyEditPage, showEditPage};



function addProfilePicModifierBtn(){

    const editProfilePicPrompt = document.createElement("div");
    editProfilePicPrompt.innerHTML =`<p class="editProfilePicInnerText"><a href="#modale" class="openModale">
        <i class="fa fa-light fa-pen-to-square"></i> 
        modifier </a></p>
        `;
    editProfilePicPrompt.setAttribute("id","editProfilePicPrompt");
    editProfilePicPrompt.className="editProfilePicPrompt";

    const introSection = document.getElementById("introduction");

    introSection.appendChild(editProfilePicPrompt);
}
addProfilePicModifierBtn();



console.log("admin.js a chargé");
;

function destroyEditPage(){
    
    editBanner.style.display = "none";
    
    const editProfilePicPrompt = document.getElementById("editProfilePicPrompt");
    const editWorksPrompt = document.getElementById('editWorksBtn');
    if(editWorksPrompt != null){
    if(editProfilePicPrompt.style.display != "none" && editWorksPrompt.style.display != "none"){
        editProfilePicPrompt.style.display = "none";
        editWorksPrompt.style.display = "none";
        console.log("profilePicPrompt détruit avec succès.");

    }
}
}

function showEditPage(){
    editBanner.style.display = null;
    const editProfilePicPrompt = document.getElementById("editProfilePicPrompt");
    const editWorksPrompt = document.getElementById('editWorksBtn');
    editProfilePicPrompt.style.display = null;
    editWorksPrompt.style.display = null;

}