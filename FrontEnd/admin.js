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
    editProfilePicPrompt.innerHTML =`<p class="editProfilePicInnerText">
        <i class="fa fa-light fa-pen-to-square"></i> 
        modifier</p>
        `;
    editProfilePicPrompt.setAttribute("id","editProfilePicPrompt");
    editProfilePicPrompt.className="editProfilePicPrompt";

    const introSection = document.getElementById("introduction");

    introSection.appendChild(editProfilePicPrompt);
}
addProfilePicModifierBtn();

function addWorksModifierBtn(){
    const editWorksBtn = document.createElement("p");
    editWorksBtn.innerHTML =`
        <i class="fa fa-light fa-pen-to-square"></i> 
        modifier
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
    if(editProfilePicPrompt != null){
        editProfilePicPrompt.remove();
        console.log("profilePicPrompt détruit avec succès.");
    }
}