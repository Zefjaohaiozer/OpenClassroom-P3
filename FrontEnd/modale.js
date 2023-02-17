import {works} from './catalogue.js';

let modale = null;
const focusableSelector = "button, a, input, textarea";
let focusableElement = [];
let previouslyFocusedElement = null;




function openModale(e){
   e.preventDefault();
   console.log("Modale défaut prévenu");
   modale = document.querySelector(e.target.getAttribute("href"));

   console.log("lien modale trouvé");
   focusableElement = Array.from(modale.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
   modale.style.display = null;
   console.log("display modale modifié")
   modale.removeAttribute('aria-hidden');
   modale.setAttribute('aria-modal','true');
   modale.addEventListener('click',closeModale);
   const closeButton = modale.querySelector('.closeModale');
   console.log(closeButton);
   closeButton.addEventListener('click',closeModale);
   const stopProp = modale.querySelector('.modale-stop');
   stopProp.addEventListener('click',stopPropagation);
}


const closeModale = function(e){
    console.log(modale);
    if (modale === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    e.preventDefault();
    console.log("Modale Close défaut prévenu");
    modale.style.display = "none";
    console.log("display modale annulé")
    modale.setAttribute('aria-hidden','true');
    modale.removeAttribute('aria-modal');
    modale.removeEventListener('click',closeModale);
    const closeButton = modale.querySelector('.closeModale');
    closeButton.removeEventListener('click',closeModale);
    const stopProp = modale.querySelector('.modale-stop');
    stopProp.removeEventListener('click',stopPropagation);
    modale=null;
   
};


function createModale(){
    const modaleSection = document.createElement("section");

    modaleSection.innerHTML = `
    <aside id = "modale" class="modale" aria-hidden="true" role="dialog" aria-modal="false" aria-labelledby="modaleTitle" style="display:none" >
        <div class="modale-wrapper modale-stop">
        <button class="closeModale">Fermer</button>
            <h2 class = "modaleTitle" id="modaleTitle">
                Galerie Photo
            </h2>
            <div class="modaleContentCatalogue" id="modaleContentCatalogue">
            </div> 
            <div class="modaleContentAddWorks" id="modaleContentAddworks">
            <input></input>
            <input></input>
            <input></input>
            </div>

    
    </aside>
        
    `
    const main = document.querySelector("main");
    main.appendChild(modaleSection)

    setTimeout(addEventListeners,0);
}

createModale();

function addEventListeners(){
document.querySelectorAll(".openModale").forEach(a => {
    a.addEventListener("click", openModale);
})
}

const stopPropagation = function(e){
    e.stopPropagation();
}

const focusinModal = function(e){
    e.preventDefault();
    console.log(focusableElement);

    let index = focusableElement.findIndex(f => f === modale.querySelector(':focus'));
    console.log(index);
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