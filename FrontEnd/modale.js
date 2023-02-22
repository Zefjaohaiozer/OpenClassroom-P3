import{works,createPortfolio, showPortfolio, destroyPortfolio, updateWorksAfterDeletion} from "./catalogue.js";
import{showEditPage} from "./admin.js";

let modale = null;
let focusableSelector;
let focusableElement = [];
let previouslyFocusedElement = null;
let arrayMods;
let destroyGalleryFigure;


const stopPropagation = function(e){
    e.stopPropagation();
}
function openModale(e){
   e.preventDefault();
//    console.log("Modale défaut prévenu");
   modale = document.querySelector(e.target.getAttribute("href"));

//    console.log("lien modale trouvé");
   
    previouslyFocusedElement = document.querySelector(':focus');
   modale.style.display = null;
//    console.log("display modale modifié")
   modale.removeAttribute('aria-hidden');
   modale.setAttribute('aria-modal','true');
   modale.addEventListener('click',closeModale);
   const closeButton = modale.querySelector('.closeModale');
//    console.log(closeButton);
   closeButton.addEventListener('click',closeModale);
   const stopProp = modale.querySelector('.modale-stop');
   stopProp.addEventListener('click',stopPropagation);
}


const closeModale = function(e){
    // console.log(modale);
    if (modale === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    e.preventDefault();
    // console.log("Modale Close défaut prévenu");
    modale.style.display = "none";
    // console.log("display modale annulé")
    modale.setAttribute('aria-hidden','true');
    modale.removeAttribute('aria-modal');
    modale.removeEventListener('click',closeModale);
    const closeButton = modale.querySelector('.closeModale');
    closeButton.removeEventListener('click',closeModale);
    const stopProp = modale.querySelector('.modale-stop');
    stopProp.removeEventListener('click',stopPropagation);
    modale=null;
    showMainModale()
   
};


function createModale(){
    const modaleSection = document.createElement("section");

    modaleSection.innerHTML = `
    <aside id = "modale" class="modale" aria-hidden="true" role="dialog" aria-modal="false" aria-labelledby="modaleTitle" style="display:none" >
        <div class="modale-wrapper modale-stop">
        <a href="#" class="closeModale"><i class="fa-solid fa-x"></i></a>
        <div class="modale1">
            <h3 class = "modaleTitle" id="modaleTitle">
                Galerie Photo
            </h3>
            <div class="modaleContentCatalogue" id="modaleContentCatalogue">
            
            </div> 
            <div class="modaleContentAddWorks" id="modaleContentAddworks">
                
                <input type="submit" value="Ajouter une photo" id="picAddBtn"></input>
                <a href="#" id="selfDestructBtn">Supprimer la galerie</a>
            </div>
        </div>
        <div class="modale2" >
            <a href="#" class="arrowLeft"> <i class="fa fa-light fa-arrow-left"></i></a>
            <h3 class = "modaleTitle" id="modaleTitle">
                Ajout photo
            </h3>
                <div class="divAjoutPhotos" id="divAjoutPhotos">
                   
                    <div class="divAddWork">
                    <div class="addWorkFormDiv">
                    <form class="addWorkForm" method="post">
                    <div class="dropzone" id="dropzone" >
                    <i class="fa fa-thin fa-image faAddImgSquare"></i>
                    <label class="addImgLabel"><p>+ Ajouter Photo </p><input type="file" accept="image/png, image/jpeg" name="image" id="imageInput"> </input></label>
                    <p> jpg, png: 4mo max</p>
                    </div>
                      
                        <label>Titre</label>
                        <input class="addWorkTitle" name="title"></input>
                        <label>Catégorie</label>
                        <select type="select" class="selectCategory" name="category">
                          <option value=""></option>
                        </select>
                        <hr class="hrLineAddWorkForm">
                        <input type="submit" value="Ajouter Photo"  id="confirmAddWork">
                      </form>
                    </div>
                  </div>
                           
                </div>
    </aside>
        
    `;
    const main = document.querySelector("main");
    main.appendChild(modaleSection)
    

    
    addEventListeners();
    addPostListener();
    listenBtnPhoto();
    listenArrowLeft();
    genererCategories();
    
  
    
}

createModale();
showMainModale();
genererWorksModifiables();
addImgChangeListener();


function addEventListeners(){
document.querySelectorAll(".openModale").forEach(a => {
    a.addEventListener("click", openModale);
})
}

function listenBtnPhoto(){
    const addPicBtn= document.getElementById("picAddBtn");

    addPicBtn.addEventListener("click",function(e){
        e.preventDefault();
        showPicAdd();
    })
}
function listenArrowLeft(){
    const arrowLeft = document.querySelector(".arrowLeft");
    arrowLeft.addEventListener("click",function(e){
        e.preventDefault();
        showMainModale();
    })
}


function showPicAdd(){
    const picAddDiv = document.querySelector(".modale2");
    const modaleMain = document.querySelector(".modale1");

    picAddDiv.style.display = null;
    modaleMain.style.display = "none";
    
    
}
function showMainModale(){
    const picAddDiv = document.querySelector(".modale2");
    const modaleMain = document.querySelector(".modale1");

    picAddDiv.style.display = "none";
    modaleMain.style.display =null;
}


const focusinModal = function(e){
    e.preventDefault();
    
    focusableSelector = "button, a, input, textarea, select";
    focusableElement = Array.from(modale.querySelectorAll(focusableSelector));
    // console.log(focusableElement);

    let index = focusableElement.findIndex(f => f === modale.querySelector(':focus'));
    // console.log(index);
    if(e.shiftKey === true){
        index--   
    }
    else{
    index++
    }

    if (index < 0){
        index = focusableElement.length -1;
    }
    if (index >= focusableElement.length){
        index = 0;
    }
    
focusableElement[index].focus();
}

window.addEventListener('keydown',function(e){
    if (e.key === "Escape" || e.key === "Esc") {
        closeModale(e);
    } 
    if (e.key === 'Tab' && modale != null){
        focusinModal(e);
    }
});


function genererWorksModifiables(){

   arrayMods = [];

    for (let i = 0 ; i < works.length; i++){ 
        // console.log(works[i]);
        const workMod = works[i];
        const cataModale = document.querySelector(".modaleContentCatalogue");


        const workModElement = document.createElement("figure");
        workModElement.className="workModFigure";
        workModElement.id=`workModNumber${i} workModIdNumber${workMod.id}`;
        arrayMods.push(workModElement.id);
        
        const imageWorkMod = document.createElement("img");
        imageWorkMod.src = workMod.imageUrl;
        imageWorkMod.crossOrigin="anonymous";
        imageWorkMod.className="workModImage";

        const editImgBtn = document.createElement("figcaption");
        editImgBtn.innerHTML = `<a href="#">éditer</a>`;
        
        const trashButtonDiv = document.createElement("div");
        trashButtonDiv.className="trashSymbolImgDiv";

        const trashButton = document.createElement("a");
        
        trashButton.setAttribute("href","#");
        trashButton.id=`trashButtonNb${workMod.id}`;
        trashButton.innerHTML=`<i class="fa fa-light fa-trash-can"></i>`;

        

        cataModale.appendChild(workModElement);
        workModElement.appendChild(imageWorkMod);
        workModElement.appendChild(editImgBtn);  
        workModElement.appendChild(trashButtonDiv);
        trashButtonDiv.appendChild(trashButton)    
        
        trashButton.addEventListener("click",deleteWork);
    }

    

    }
    async function deleteWork(event){
        event.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem("userData"));
        const userToken = userInfo.token;
        const workIdString = this.id.match(/\d/g);
        const workId = workIdString.join("");
        // console.log(workId);    
        // console.log(userInfo);
        // console.log(userToken);
        
        const destroyShowDiv = this.parentNode;
        const destroyShowElement = destroyShowDiv.parentNode;
        // console.log(destroyShowElement);
        destroyGalleryFigure = document.getElementById(`galleryFigureNumber${workId}`);

        destroyShowElement.remove();
        destroyGalleryFigure.remove();
    
        const sendDeleteRequest = await fetch(`http://localhost:5678/api/works/${workId}`,
        {   method:'DELETE',
            headers:{
                'Accept': '*/*',
                'Authorization':`Bearer ${userToken}`
            }
        }
        )  

    selfDestruct();

function selfDestruct(){
    const selfDestructBtn = document.getElementById("selfDestructBtn");
    selfDestructBtn.addEventListener("click",deleteAll);
}
async function deleteAll(event){
    event.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    const userToken = userInfo.token;
 for (let i = 0 ; i < works.length; i++){ 
    const currentItem = works[i];
    const currentItemId = currentItem.id;
    // console.log(currentItemId);


    const destroyGalleryFigure = document.getElementById(`galleryFigureNumber${currentItemId}`);
    destroyGalleryFigure.remove();

    const cataModale = document.querySelector(".modaleContentCatalogue");

    
    const sendDeleteRequest = await fetch(`http://localhost:5678/api/works/${currentItemId}`,
    {   method:'DELETE',
        headers:{
            'Accept': '*/*',
            'Authorization':`Bearer ${userToken}`
        }
    }
    )
    if(cataModale != null){
        cataModale.remove();
        }   
    
}
        
        // const deletionConfirm = await sendDeleteRequest.stringify;
        // if(deletionConfirm.status === 204){
        //     console.log("Work destruction confirmed")
        // }
        // const deletionConfirmStatus = deletionConfirm.status;
        
        // console.log(deletionConfirmStatus);

    }

    const firstWorkMod = document.getElementById(`${arrayMods[0]}`);

    const expandBtn = document.createElement("div");
        expandBtn.className="expandSymbolDiv";
        expandBtn.innerHTML=`<a href="#"><i class="fa fa-solid fa-up-down-left-right"></i></a>`;
    firstWorkMod.appendChild(expandBtn);
}





async function genererCategories(){

    const getCat = await fetch('http://localhost:5678/api/categories');
    const catList = await getCat.json();
    // console.log(catList)
    // on utilise l'Array créé précédemment pour créer les boutons des catégories 
    for (let i = 0 ; i < catList.length; i++){
        const selectCategory = document.querySelector(".selectCategory");
        // création des boutons et attributions de classes et ID pour ces boutons 
        const categorie = document.createElement("option");
        categorie.className = `selectCategoryElement`;
        categorie.id= `${catList[i].name}`;
        categorie.value = catList[i].id;
        categorie.innerText = `${catList[i].name}`;
        selectCategory.appendChild(categorie);
    }};



function addPostListener(){
    const addWorkForm = document.querySelector(".addWorkForm");
    addWorkForm.addEventListener("submit",postWork)};
    
function addImgChangeListener(){
    const imgInput = document.querySelector('input[name="image"]');
    
    imgInput.addEventListener("change",function(event){
        event.preventDefault();
        const imageDiv = document.getElementById("dropzone");
        const imgFontAwesome = imageDiv.querySelector(".fa");
        imgFontAwesome.style.display = 'none';
        
        const imgDivLabel = imageDiv.querySelector("label");
        const imgDivLabelP = imgDivLabel.querySelector("p");
        const imgDivLabelPreviousImg = imgDivLabel.querySelector("img");
        if (imgDivLabelP != null){
            imgDivLabelP.remove();
        }
        if (imgDivLabelPreviousImg != null){
            imgDivLabelPreviousImg.remove();
        }
        // imgDivLabel.innerHTML='<input type="file" accept="image/png, image/jpeg" name="image" id="imageInput"> </input>';
        imgDivLabel.setAttribute('class','imgDivLabel');
        const imgDivText = imageDiv.querySelector("p");
        imgDivText.style.display = 'none';
        const newImgDisplay = document.createElement("img");
        
        const imgUrl = imgInput.files[0];
        
        newImgDisplay.src = URL.createObjectURL(imgUrl);
        newImgDisplay.className="newImgDisplay";

        addImgChangeListener()
        imgDivLabel.appendChild(newImgDisplay);
        console.log(imgInput.files[0]);

    })
    
}



function postWork(event){
        event.preventDefault();
        const addWorkForm = document.querySelector(".addWorkForm");

        const formData = new FormData(addWorkForm)

        const userToken = JSON.parse(localStorage.getItem("userData")).token;
        const userId = JSON.parse(localStorage.getItem("userData")).userId;
        console.log(formData);
        // console.log(userToken);
                
                
                
        fetch("http://localhost:5678/api/works",
        {
            method : 'POST',
            headers : {
                'Authorization':`Bearer ${userToken}`,
                'Accept':'application/json',
                },
            body:formData
        })
        
        .then(res => res.json())
        .then(res => createElementAfterAdding(res))
        .then(res => console.log(res))  
        
// ajout de la nouvelle photo à la mainmodale
        



        }


function createElementAfterAdding(res){
        const newWorkId = res.id; 
        const newWorkImg = res.imageUrl
        const newWorkTitle = res.title 
        console.log(newWorkId, newWorkImg, newWorkTitle);

        const cataModale = document.querySelector(".modaleContentCatalogue");


        const workModElement = document.createElement("figure");
        workModElement.className="workModFigure";
        workModElement.id=`workModIdNumber${newWorkId}`;
        
        
        const imageWorkMod = document.createElement("img");
        imageWorkMod.src = newWorkImg;
        imageWorkMod.crossOrigin="anonymous";
        imageWorkMod.className="workModImage";

        const editImgBtn = document.createElement("figcaption");
        editImgBtn.innerHTML = `<a href="#">éditer</a>`;
        
        const trashButtonDiv = document.createElement("div");
        trashButtonDiv.className="trashSymbolImgDiv";

        const trashButton = document.createElement("a");
        
        trashButton.setAttribute("href","#");
        trashButton.id=`trashButtonNb${newWorkId}`;
        trashButton.innerHTML=`<i class="fa fa-light fa-trash-can"></i>`;
        cataModale.appendChild(workModElement);
        workModElement.appendChild(imageWorkMod);
        workModElement.appendChild(editImgBtn);  
        workModElement.appendChild(trashButtonDiv);
        trashButtonDiv.appendChild(trashButton);

        trashButton.addEventListener("click",deleteWork);

        const workElement = document.createElement("figure");
        workElement.setAttribute("id",`galleryFigureNumber${newWorkId}`);

        const imageWork= document.createElement("img");
        imageWork.src = newWorkImg;
        imageWork.crossOrigin="anonymous";
        
        const titleWork = document.createElement("figcaption");
        titleWork.innerText = newWorkTitle;

        const sectionWorks = document.querySelector(".gallery");

        sectionWorks.appendChild(workElement);
        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);


        showMainModale()
}



