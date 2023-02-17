import { works } from "./catalogue.js";

console.log("admin.js en chargement");
export{editPage, destroyEditPage};

async function editPage(){


    editBanner.innerHTML= `
   <p class="editBannerElement"> 
   <i class="fa fa-light fa-pen-to-square"></i> 
   Mode Edition</p>

   <button id="publishChange" class="publishBtn editBannerElement">publier les changements</button>

`
 
const header = document.querySelector("header");
header.appendChild(editBanner);

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

function addWorksModifierBtn(){
    const editWorksBtn = document.createElement("p");
    editWorksBtn.innerHTML =`<a href="#modale" class="openModale">
        <i class="fa fa-light fa-pen-to-square"></i> 
        modifier </a>
        `;
    editWorksBtn.setAttribute("id","editWorksBtn");
    editWorksBtn.className="editWorksBtn";

    const worksSection = document.querySelector(".worksTitleDiv");
    worksSection.appendChild(editWorksBtn);
    
}

setTimeout(addWorksModifierBtn,0);

console.log("admin.js a chargé");
};

function destroyEditPage(){
    
    editBanner.remove();
    
    const editProfilePicPrompt = document.getElementById("editProfilePicPrompt");
    const editWorksPrompt = document.getElementById('editWorksBtn');
    if(editProfilePicPrompt != null){
        editProfilePicPrompt.remove();
        editWorksPrompt.remove();
        console.log("profilePicPrompt détruit avec succès.");

    }
}