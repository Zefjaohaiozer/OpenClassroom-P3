// Déclaration de toutes les variables Globales : 
let reponse = await fetch('http://localhost:5678/api/works');
let works = await reponse.json();
const filterCat = [];
const catalogue = document.querySelector("#portfolio");
const header = document.querySelector("header");
let modale = null;
let focusableSelector;
let focusableElement = [];
let previouslyFocusedElement = null;
let arrayMods;
let destroyGalleryFigure;
let loginAttempt = 0;
const main = document.getElementById("main");
const contactSection = document.querySelector("#contact");
const portfolio = document.querySelector("#portfolio");
const introduction = document.querySelector("#introduction");
const contact = document.querySelector("#contact");

// Chargement de la page. 
load();




// console.log("admin.js a chargé");

// function to update works : 
async function updateWorks() {
    reponse = await fetch('http://localhost:5678/api/works');
    works = await reponse.json();
}

// Partie Catalogue : 

function createPortfolio() {

    const worksTitleDiv = document.createElement("div");
    worksTitleDiv.className = "worksTitleDiv";
    const worksTitle = document.createElement("h2");
    worksTitle.innerText = "Mes Projets";

    const filters = document.createElement("div");
    filters.className = "filters";

    const gallery = document.createElement("div");
    gallery.className = "gallery";

    catalogue.style.display = null;


    catalogue.appendChild(worksTitleDiv);
    worksTitleDiv.appendChild(worksTitle);
    catalogue.appendChild(filters);
    catalogue.appendChild(gallery);
    const sectionWorks = document.querySelector(".gallery");
    const divFilters = document.querySelector(".filters");



    const editWorksBtn = document.createElement("p");
    editWorksBtn.innerHTML = `<a href="#modale" class="openModale">
        <i class="fa fa-light fa-pen-to-square"></i> 
        modifier </a>
        `;
    editWorksBtn.setAttribute("id", "editWorksBtn");
    editWorksBtn.className = "editWorksBtn";
    editWorksBtn.style.display = "none";

    worksTitleDiv.appendChild(editWorksBtn);

    // console.log(works);

    function genererWorks(works) {
        for (let i = 0; i < works.length; i++) {

            const work = works[i];

            const workElement = document.createElement("figure");
            workElement.setAttribute("id", `galleryFigureNumber${work.id}`);

            const imageWork = document.createElement("img");
            imageWork.src = work.imageUrl;
            imageWork.crossOrigin = "anonymous";

            const titleWork = document.createElement("figcaption");
            titleWork.innerText = work.title;


            sectionWorks.appendChild(workElement);
            workElement.appendChild(imageWork);
            workElement.appendChild(titleWork)


        }
    }


    genererWorks(works);



    // Il faut aller chercher les catégories existantes, puis ne les afficher qu'une fois par occurrence 
    // on crée un Array pour lister les catégories, puis on valide l'absence de la valeur dans l'Array avant d'y ajouter la valeur, pour n'avoir qu'une fois chaque catégorie, of course
    function genererFiltres() {


        for (let i = 0; i < works.length; i++) {
            const work = works[i];
            if (!filterCat.includes(work.category.name)) {
                filterCat.push(work.category.name);
            }

        }
        // console.log(filterCat);

        const noFilterBtn = document.createElement("button");
        noFilterBtn.className = `filterButton`;
        noFilterBtn.id = "noFilter";
        noFilterBtn.innerText = "Tous"
        divFilters.appendChild(noFilterBtn);
        noFilterBtn.addEventListener("click", function() {
            document.querySelector(".gallery").innerHTML = "";
            genererWorks(works);
        });


        // on utilise l'Array créé précédemment pour créer les boutons des catégories 

        for (let i = 0; i < filterCat.length; i++) {

            // création des boutons et attributions de classes et ID pour ces boutons 
            const filterElement = document.createElement("button");
            filterElement.className = `filterButton`;
            filterElement.id = `${filterCat[i]}`
            filterElement.innerText = filterCat[i];
            divFilters.appendChild(filterElement);

            // test console pour valider le fonctionnement de la fonction 
            // console.log(filterElement);


            // ajout d'un listener de click sur chaque bouton créé par la boucle, afin de filtrer correctement selon l'ID du bouton 
            filterElement.addEventListener("click", function() {

                // création d'une variable btnId qui prend l'ID du filterElement concerné 
                const btnId = this.id;

                // création d'un tableau filWork, ou travaux filtrés, qui ne prend que les éléments de la DB dont la catégorie name correspond précisément à l'ID du bouton 
                const filWork = works.filter(function(work) {
                    return work.category.name == btnId;
                });


                // on supprime le contenu HTML de la gallery pour la recréer ensuite, mais avec une nouvelle variable dans notre fonction : filWork, le tableau fraichement créé pour cet usage. 
                document.querySelector(".gallery").innerHTML = "";
                genererWorks(filWork);

                // test console pour valider le fonctionnement de la fonction 
                // console.log(filWork);

            });

        }
    }

    // on affiche les boutons, forcément.
    genererFiltres(works);

};

const showPortfolio = function() {
    // console.log(catalogue);
    catalogue.setAttribute("style", "display = null");
}

function destroyPortfolio() {
    catalogue.innerHTML = "";

};




//  partie Header 
// Création du Header 
function createHeader() {

    header.className = "header";

    const editBanner = document.createElement("section");
    editBanner.setAttribute("id", "editBanner");
    editBanner.className = "editBanner";
    editBanner.style.display = "none";
    editBanner.innerHTML = `
   <p class="editBannerElement"> 
   <i class="fa fa-light fa-pen-to-square"></i> 
   Mode Edition</p>

   <button id="publishChange" class="publishBtn editBannerElement">publier les changements</button>
    
`

    header.appendChild(editBanner);

    const titleAndNav = document.createElement("div");
    titleAndNav.className = "titleAndNav";

    const title = document.createElement("h1");
    title.className = "title"
    title.innerHTML = "Sophie Bluel <span> Architecte d'intérieur</span>"

    const nav = document.createElement("nav");
    nav.innerHTML = `
        <ul id="navList" class="navList">
            <li id="projectBtn">projets</li>
            <li id="contactBtn">contact</li>
            <li id="loginBtn">login</li>
            <li><img src="./assets/icons/instagram.png" alt="Instagram"></li>
        </ul>`;

    header.appendChild(editBanner);
    header.appendChild(titleAndNav);

    titleAndNav.appendChild(title);
    titleAndNav.appendChild(nav);


    // on note les variables utilisées dans le document (à noter que cela doit être fait APRES avoir créé le HTML du Header)
    const projectBtn = document.getElementById("projectBtn");
    const contactBtn = document.getElementById("contactBtn");
    const loginBtn = document.getElementById("loginBtn");

    const contact = document.getElementById('contact')
    const portfolio = document.getElementById("portfolio");
    // on ajoute les eventlisteners qui permettent la navigation depuis les 3 boutons du Header 
    projectBtn.addEventListener("click", navPortfolio);
    contactBtn.addEventListener("click", navContact);
    loginBtn.addEventListener("click", navLogin);

}
// on affiche le header

const showHeader = function() {
    isLoggedIn();
    header.style.display = null;
}
// on détermine une fonction qui permet de charger la page principale 

function load() {
    createPortfolio();
    createHeader();
    createIntro();
    createContact();
    addProfilePicModifierBtn();
    isLoggedIn();
};


// une fois la page chargée, on appelle la fonction qui affichera tous les éléments de la homepage

const showMainPage = function() {
    showHeader();
    showIntro();
    showPortfolio();
    showContact();
    destroyLogin();
}
// on écrit les fonctions qui permettent de scroller 
function scrollToPortfolio() {

    // console.log(portfolio);
    portfolio.scrollIntoView({
        align: true,
        behavior: "smooth"
    });

}

function scrollToContact() {

    // console.log(contact);
    contact.scrollIntoView({
        align: true,
        behavior: "smooth"
    });
}

function navPortfolio() {
    if (portfolio.style.display != null) {
        showMainPage();
    }

    scrollToPortfolio();

    // console.log('navportfolio a terminé son exécution')
}

function navContact() {
    if (contact.style.display != null) {
        showMainPage();
        scrollToContact();
    } else {
        scrollToContact();
        // console.log("j'ai pas attendu");
    }


}

// on exécute 2 fonctions en cliquant sur le bouton login, la première détruit le HTML du login, la seconde crée le HTML du login.
function navLogin() {
    const loginBtn = document.getElementById("loginBtn");
    const loginBtnValue = loginBtn.innerText;
    if (loginBtnValue == "logout") {
        logOut();
    } else {
        destroyLogin();
        showLogin();
    }

}

function isLoggedIn() {
    const userId = localStorage.getItem("userData");
    if (userId != null) {

        const loginBtn = document.getElementById("loginBtn");
        loginBtn.innerText = "logout";
        showEditPage();

    } else {
        logOut();

    }


}

function logOut() {
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.innerHTML = "login";
    localStorage.clear();
    destroyEditPage();

}

function destroyHeader() {
    const header = document.querySelector("header");
    header.innerHTML = "";
}

// partie Modale : 

const stopPropagation = function(e) {
    e.stopPropagation();
}

function openModale(e) {
    e.preventDefault();
    //    console.log("Modale défaut prévenu");
    modale = document.querySelector(e.target.getAttribute("href"));

    //    console.log("lien modale trouvé");

    previouslyFocusedElement = document.querySelector(':focus');
    modale.style.display = null;
    //    console.log("display modale modifié")
    modale.removeAttribute('aria-hidden');
    modale.setAttribute('aria-modal', 'true');
    modale.addEventListener('click', closeModale);
    const closeButton = modale.querySelector('.closeModale');
    //    console.log(closeButton);
    closeButton.addEventListener('click', closeModale);
    const stopProp = modale.querySelector('.modale-stop');
    stopProp.addEventListener('click', stopPropagation);
}


const closeModale = function(e) {
    // console.log(modale);
    if (modale === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    e.preventDefault();
    // console.log("Modale Close défaut prévenu");
    modale.style.display = "none";
    // console.log("display modale annulé")
    modale.setAttribute('aria-hidden', 'true');
    modale.removeAttribute('aria-modal');
    modale.removeEventListener('click', closeModale);
    const closeButton = modale.querySelector('.closeModale');
    closeButton.removeEventListener('click', closeModale);
    const stopProp = modale.querySelector('.modale-stop');
    stopProp.removeEventListener('click', stopPropagation);
    modale = null;
    showMainModale()

};


function createModale() {
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
                    <label class="addImgLabel"><p>+ Ajouter Photo </p><input type="file" accept="image/png, image/jpeg" name="image" id="imageInput" required> </input></label>
                    <p> jpg, png: 4mo max</p>
                    </div>
                      
                        <label>Titre</label>
                        <input class="addWorkTitle" name="title" required></input>
                        <label>Catégorie</label>
                        <select type="select" class="selectCategory" name="category" required>
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


function addEventListeners() {
    document.querySelectorAll(".openModale").forEach(a => {
        a.addEventListener("click", openModale);
    })
}

function listenBtnPhoto() {
    const addPicBtn = document.getElementById("picAddBtn");

    addPicBtn.addEventListener("click", function(e) {
        e.preventDefault();
        showPicAdd();
    })
}

function listenArrowLeft() {
    const arrowLeft = document.querySelector(".arrowLeft");
    arrowLeft.addEventListener("click", function(e) {
        e.preventDefault();
        showMainModale();
    })
}


function showPicAdd() {
    const picAddDiv = document.querySelector(".modale2");
    const modaleMain = document.querySelector(".modale1");

    picAddDiv.style.display = null;
    modaleMain.style.display = "none";


}

function showMainModale() {
    const picAddDiv = document.querySelector(".modale2");
    const modaleMain = document.querySelector(".modale1");

    picAddDiv.style.display = "none";
    modaleMain.style.display = null;



}


const focusinModal = function(e) {
    e.preventDefault();

    focusableSelector = "button, a, input, textarea, select";
    focusableElement = Array.from(modale.querySelectorAll(focusableSelector));
    // console.log(focusableElement);

    let index = focusableElement.findIndex(f => f === modale.querySelector(':focus'));
    // console.log(index);
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }

    if (index < 0) {
        index = focusableElement.length - 1;
    }
    if (index >= focusableElement.length) {
        index = 0;
    }

    focusableElement[index].focus();
}

window.addEventListener('keydown', function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModale(e);
    }
    if (e.key === 'Tab' && modale != null) {
        focusinModal(e);
    }
});


function genererWorksModifiables() {

    arrayMods = [];

    for (let i = 0; i < works.length; i++) {
        // console.log(works[i]);
        const workMod = works[i];
        const cataModale = document.querySelector(".modaleContentCatalogue");


        const workModElement = document.createElement("figure");
        workModElement.className = "workModFigure";
        workModElement.id = `workModNumber${i} workModIdNumber${workMod.id}`;
        arrayMods.push(workModElement.id);

        const imageWorkMod = document.createElement("img");
        imageWorkMod.src = workMod.imageUrl;
        imageWorkMod.crossOrigin = "anonymous";
        imageWorkMod.className = "workModImage";

        const editImgBtn = document.createElement("figcaption");
        editImgBtn.innerHTML = `<a href="#">éditer</a>`;

        const trashButtonDiv = document.createElement("div");
        trashButtonDiv.className = "trashSymbolImgDiv";

        const trashButton = document.createElement("a");

        trashButton.setAttribute("href", "#");
        trashButton.id = `trashButtonNb${workMod.id}`;
        trashButton.innerHTML = `<i class="fa fa-light fa-trash-can"></i>`;



        cataModale.appendChild(workModElement);
        workModElement.appendChild(imageWorkMod);
        workModElement.appendChild(editImgBtn);
        workModElement.appendChild(trashButtonDiv);
        trashButtonDiv.appendChild(trashButton)

        trashButton.addEventListener("click", deleteWork);
    }
    const expandBtn = document.createElement("div");
    expandBtn.className = "expandSymbolDiv";
    expandBtn.innerHTML = `<a href="#"><i class="fa fa-solid fa-up-down-left-right"></i></a>`;

    const firstWorkMod = document.getElementById(`${arrayMods[0]}`);
    firstWorkMod.appendChild(expandBtn);



}
async function deleteWork(event) {
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

    const sendDeleteRequest = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${userToken}`
        }
    })
    updateWorks();
}

selfDestruct();

function selfDestruct() {
    const selfDestructBtn = document.getElementById("selfDestructBtn");
    selfDestructBtn.addEventListener("click", deleteAll);
}

async function deleteAll(event) {
    event.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    const userToken = userInfo.token;
    updateWorks();
    for (let i = 0; i < works.length; i++) {
        const currentItem = works[i];
        const currentItemId = currentItem.id;
        // console.log(currentItemId);
        const destroyGalleryFigure = document.getElementById(`galleryFigureNumber${currentItemId}`);
        destroyGalleryFigure.remove();
        const cataModale = document.querySelector(".modaleContentCatalogue");
        const sendDeleteRequest = await fetch(`http://localhost:5678/api/works/${currentItemId}`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${userToken}`
            }
        })
        if (cataModale != null) {
            cataModale.remove();
        }


    }
    updateWorks();
}



async function genererCategories() {

    const getCat = await fetch('http://localhost:5678/api/categories');
    const catList = await getCat.json();
    // console.log(catList)
    // on utilise l'Array créé précédemment pour créer les boutons des catégories 
    for (let i = 0; i < catList.length; i++) {
        const selectCategory = document.querySelector(".selectCategory");
        // création des boutons et attributions de classes et ID pour ces boutons 
        const categorie = document.createElement("option");
        categorie.className = `selectCategoryElement`;
        categorie.id = `${catList[i].name}`;
        categorie.value = catList[i].id;
        categorie.innerText = `${catList[i].name}`;
        selectCategory.appendChild(categorie);
    }
};



function addPostListener() {
    const addWorkForm = document.querySelector(".addWorkForm");
    addWorkForm.addEventListener("submit", postWork)
};

function addImgChangeListener() {
    const imgInput = document.querySelector('input[name="image"]');

    imgInput.addEventListener("change", function(event) {
        event.preventDefault();
        const imageDiv = document.getElementById("dropzone");
        const imgFontAwesome = imageDiv.querySelector(".fa");
        imgFontAwesome.style.display = 'none';

        const imgDivLabel = imageDiv.querySelector("label");
        const imgDivLabelP = imgDivLabel.querySelector("p");
        const imgDivLabelPreviousImg = imgDivLabel.querySelector("img");
        if (imgDivLabelP != null) {
            imgDivLabelP.remove();
        }
        if (imgDivLabelPreviousImg != null) {
            imgDivLabelPreviousImg.remove();
        }
        // imgDivLabel.innerHTML='<input type="file" accept="image/png, image/jpeg" name="image" id="imageInput"> </input>';
        imgDivLabel.setAttribute('class', 'imgDivLabel');
        const imgDivText = imageDiv.querySelector("p");
        imgDivText.style.display = 'none';
        const newImgDisplay = document.createElement("img");

        const imgUrl = imgInput.files[0];

        newImgDisplay.src = URL.createObjectURL(imgUrl);
        newImgDisplay.className = "newImgDisplay";

        addImgChangeListener()
        imgDivLabel.appendChild(newImgDisplay);
        // console.log(imgInput.files[0]);

    })

}



function postWork(event) {
    event.preventDefault();
    const addWorkForm = document.querySelector(".addWorkForm");

    const formData = new FormData(addWorkForm)

    const userToken = JSON.parse(localStorage.getItem("userData")).token;
    const userId = JSON.parse(localStorage.getItem("userData")).userId;
    // console.log(formData);
    // console.log(userToken);



    fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Accept': 'application/json',
            },
            body: formData
        })

        .then(res => res.json())
        .then(res => createElementAfterAdding(res))
        .then(res => updateWorks())


}

// ajout de la nouvelle photo à la mainmodale et au catalogue
function createElementAfterAdding(res) {
    const newWorkId = res.id;
    const newWorkImg = res.imageUrl
    const newWorkTitle = res.title
    // console.log(newWorkId, newWorkImg, newWorkTitle);

    const cataModale = document.querySelector(".modaleContentCatalogue");


    const workModElement = document.createElement("figure");
    workModElement.className = "workModFigure";
    workModElement.id = `workModIdNumber${newWorkId}`;


    const imageWorkMod = document.createElement("img");
    imageWorkMod.src = newWorkImg;
    imageWorkMod.crossOrigin = "anonymous";
    imageWorkMod.className = "workModImage";

    const editImgBtn = document.createElement("figcaption");
    editImgBtn.innerHTML = `<a href="#">éditer</a>`;

    const trashButtonDiv = document.createElement("div");
    trashButtonDiv.className = "trashSymbolImgDiv";

    const trashButton = document.createElement("a");

    trashButton.setAttribute("href", "#");
    trashButton.id = `trashButtonNb${newWorkId}`;
    trashButton.innerHTML = `<i class="fa fa-light fa-trash-can"></i>`;
    cataModale.appendChild(workModElement);
    workModElement.appendChild(imageWorkMod);
    workModElement.appendChild(editImgBtn);
    workModElement.appendChild(trashButtonDiv);
    trashButtonDiv.appendChild(trashButton);

    trashButton.addEventListener("click", deleteWork);

    const workElement = document.createElement("figure");
    workElement.setAttribute("id", `galleryFigureNumber${newWorkId}`);

    const imageWork = document.createElement("img");
    imageWork.src = newWorkImg;
    imageWork.crossOrigin = "anonymous";

    const titleWork = document.createElement("figcaption");
    titleWork.innerText = newWorkTitle;

    const sectionWorks = document.querySelector(".gallery");

    sectionWorks.appendChild(workElement);
    workElement.appendChild(imageWork);
    workElement.appendChild(titleWork);


    showMainModale()
}

// partie Login 

createLogin();

async function createLogin() {

    const loginSection = document.createElement("section");
    loginSection.className = "loginSection";
    loginSection.setAttribute("id", "loginSection");
    loginSection.style.display = "none";

    const loginH2 = document.createElement("h2");
    loginH2.innerText = "Log-In";

    const loginForm = document.createElement("form");
    loginForm.className = "loginForm";
    loginForm.setAttribute("id", "loginForm");
    loginForm.setAttribute("method", "POST");


    const loginEmailText = document.createElement("label");
    loginEmailText.innerText = "E-mail";


    const loginId = document.createElement("input");
    loginId.id = "idInput";
    loginId.className = "loginInput";
    loginId.setAttribute("type", "email");
    loginId.setAttribute("name", "emailId")


    const loginPwdText = document.createElement("label");
    loginPwdText.innerText = "Mot de Passe";

    const loginPwd = document.createElement("input");
    loginPwd.id = "pwdInput";
    loginPwd.className = "loginInput";
    loginPwd.setAttribute("type", "password");
    loginPwd.setAttribute("name", "pwdId")


    const loginSubmit = document.createElement("input");
    loginSubmit.id = "loginSubmit";
    loginSubmit.class = "loginSubmit";
    loginSubmit.setAttribute("value", "Se Connecter")
    loginSubmit.setAttribute("type", "submit");


    const forgotPwd = document.createElement("p");
    forgotPwd.className = "forgotPwd";
    forgotPwd.setAttribute("id", "forgotPwd");
    forgotPwd.innerHTML = `
        <a href="#" class="forgotPwdLink">
            Mot de passe oublié
        </a>
    `

    main.appendChild(loginSection);

    loginSection.appendChild(loginH2);
    loginSection.appendChild(loginForm);
    loginForm.appendChild(loginEmailText);
    loginForm.appendChild(loginId);
    loginForm.appendChild(loginPwdText);
    loginForm.appendChild(loginPwd);
    loginForm.appendChild(loginSubmit);
    loginSection.appendChild(forgotPwd);

    const loginFormulaire = document.getElementById("loginForm");
    if (loginFormulaire == null) {
        // console.log("le formulaire n'existe pas");
    } else {
        // console.log("le formulaire existe");
    }
    loginFormulaire.addEventListener("submit", function(event) {
        event.preventDefault();
        // console.log("preventDefault");
        destroyUserNotFound();

        getFormInfo();

    });
};

const showLogin = function() {
    exterminate();
    const loginSection = document.getElementById("loginSection");
    loginSection.style.display = null;
}


//    on retire le HTML du catalogue, de l'intro et des contacts, qui ne sont pas présents sur le formulaire de connexion
function exterminate() {

    // introduction.innerHTML= ""; 
    // portfolio.innerHTML= "";
    // contact.innerHTML="";
    portfolio.style.display = "none";
    introduction.style.display = "none";
    contact.style.display = "none";
    // console.log("DoctOOOOr");

}

//    on empêche le HTML du login de se démultiplier.
function destroyLogin() {

    const loginSection = document.querySelector(".loginSection");


    if (loginSection == null) {
        // console.log("I'm not doing anything");
    } else {
        // loginSection.remove();
        loginSection.style.display = "none";
        // console.log("Login Destruction confirmed");
    }

}

async function getFormInfo() {

    const loginFormulaire = document.getElementById("loginForm");
    // console.log("formulaire envoyé!");
    const loginIdSent = loginFormulaire.querySelector('input[name="emailId"]').value;
    const pwdIdSent = loginFormulaire.querySelector('input[name="pwdId"]').value;
    // console.log(loginIdSent); // on montre l'ID
    // console.log(pwdIdSent); // on montre le mdp
    const jsonLogin = {
        "email": loginIdSent,
        "password": pwdIdSent
    }

    const serverLoginAccess = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(jsonLogin)

    });


    const serverLoginResponse = await serverLoginAccess.json();
    const serverLoginStatus = serverLoginAccess.status;
    // console.log(serverLoginStatus);
    // console.log(serverLoginResponse);

    if (serverLoginStatus == 200) {
        // console.log("connexion en cours");
        localStorage.setItem("userData", JSON.stringify(serverLoginResponse));
        const data = localStorage.getItem("userData");
        // console.log(data);
        // destroyHeader();
        showMainPage();
        loginAttempt = 0;
    } else {
        loginAttempt = loginAttempt + 1;

        const userNotFound = document.createElement("p");
        if (loginAttempt < 10) {
            userNotFound.innerText = `L'utilisateur n'existe pas, vérifiez votre adresse email et votre mot de passe. Vous avez essayé de vous connecter ${loginAttempt} fois.`;
        } else {
            userNotFound.innerText = `Trop de tentatives de connexion.`;
            showMainPage();
        }
        userNotFound.className = "userNotFound";
        userNotFound.setAttribute("id", "userNotFound");
        const loginSection = document.getElementById("loginSection");
        loginSection.appendChild(userNotFound);

        // console.log("utilisateur introuvable");
    };

};

function destroyUserNotFound() {
    const userNotFound = document.getElementById("userNotFound");
    if (userNotFound != null) {
        userNotFound.remove();
    }
}

// partie Intro : 

function createIntro() {
    const introduction = document.querySelector("#introduction");


    const introDiv = document.createElement("div");
    introDiv.className = "introDiv";

    const profilePic = document.createElement("figure");
    profilePic.setAttribute("id", "profilePic");
    profilePic.className = ("profilePic");
    profilePic.innerHTML = `<img src="./assets/images/sophie-bluel.png" alt="Portrait de Sophie Bluel en extérieur.">`

    const presentation = document.createElement("article");
    presentation.innerHTML = `
            <h2>Designer d'espace</h2>
            <p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.</p>
            <p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
            <p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice)</p>
            `
    introduction.appendChild(introDiv);
    introDiv.appendChild(profilePic);
    introDiv.appendChild(presentation);




}
const showIntro = function() {
    const introduction = document.querySelector("#introduction");
    introduction.style.display = null;

}


//  partie Contact 

function createContact() {
    contactSection.innerHTML = `<h2 id="contactTest">Contact </h2>
<p>Vous avez un projet ? Discutons-en !</p>
<form action="#" method="post">
    <label for="name">Nom</label>
    <input type="text" name="name" id="name">
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
    <label for="message">Message</label>
    <textarea name="message" id="message" cols="30" rows="10"></textarea>
    <input type="submit" value="Envoyer">
</form>`;
    document.getElementById("contact").style.display = "inherit";
};

const showContact = function() {
    contactSection.style.display = null;
}

// partie Footer : 
document.querySelector("footer").innerHTML =
    `<nav>
<ul>
    <li id="mentionsLegales">Mentions Légales</li>
</ul>
</nav>`;

// Partie Administration : 
function addProfilePicModifierBtn() {
    const editProfilePicPrompt = document.createElement("div");
    editProfilePicPrompt.innerHTML = `<p class="editProfilePicInnerText"><a href="#modale" class="openModale">
        <i class="fa fa-light fa-pen-to-square"></i> 
        modifier </a></p>
        `;
    editProfilePicPrompt.setAttribute("id", "editProfilePicPrompt");
    editProfilePicPrompt.className = "editProfilePicPrompt";

    const introSection = document.getElementById("introduction");

    introSection.appendChild(editProfilePicPrompt);
}

function destroyEditPage() {

    editBanner.style.display = "none";
    const editProfilePicPrompt = document.getElementById("editProfilePicPrompt");
    const editWorksPrompt = document.getElementById('editWorksBtn');

    if (editWorksPrompt != null && editProfilePicPrompt != null) {
        if (editProfilePicPrompt.style.display != "none" || editWorksPrompt.style.display != "none") {
            editProfilePicPrompt.style.display = "none";
            editWorksPrompt.style.display = "none";
            // console.log("profilePicPrompt détruit avec succès.");

        }
    }
}

function showEditPage() {
    editBanner.style.display = null;
    const editProfilePicPrompt = document.getElementById("editProfilePicPrompt");
    const editWorksPrompt = document.getElementById('editWorksBtn');

    editProfilePicPrompt.style.display = null;
    editWorksPrompt.style.display = null;
}