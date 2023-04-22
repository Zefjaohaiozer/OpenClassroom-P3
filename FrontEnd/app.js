// Déclaration de toutes les variables Globales :
// tableau récupérant la liste des travaux dans le backend
let reponse = await fetch('/api/works');
let works = await reponse.json();
console.log(works);
// filterCat sera utilisé pour la création des boutons de filtre sur la page principale
const filterCat = [];
// Toutes ces variables servent à cibler des éléments du fichier HTML
const catalogue = document.querySelector('#portfolio');
const header = document.querySelector('header');
const main = document.getElementById('main');
const introduction = document.querySelector('#introduction');
const contact = document.querySelector('#contact');

// la modale sera définie par la cible du lien permettant d'interagir avec elle
let modale = null;
// ces éléments seront calculés une fois la modale ouverte
let focusableSelector;
let focusableElement = [];
let previouslyFocusedElement = null;
// arrayMods est un tableau qui contiendra la liste des travaux affichés dans la modale (Mods correspond à "modifiables", car ces travaux sont ceux que l'on peut supprimer)
let arrayMods;
// destroyGalleryFigure sera définie lors de la création du catalogue dans la modale
let destroyGalleryFigure;
// loginAttempt servira à compter le nombre de tentatives de connexion
let loginAttempt = 0;

// Chargement de la page.
load();

// Cette fonction sert à mettre à jour la variable récupérant la liste des travaux. Elle est appelée à chaque mise à jour des travaux : suppression ou ajout
async function updateWorks() {
  reponse = await fetch('/api/works');
  works = await reponse.json();
}

// CATALOGUE

// Création du HTML du catalogue
function createPortfolio() {
  const worksTitleDiv = document.createElement('div');
  worksTitleDiv.className = 'worksTitleDiv';
  const worksTitle = document.createElement('h2');
  worksTitle.innerText = 'Mes Projets';

  const filters = document.createElement('div');
  filters.className = 'filters';

  const gallery = document.createElement('div');
  gallery.className = 'gallery';

  catalogue.style.display = null;

  catalogue.appendChild(worksTitleDiv);
  worksTitleDiv.appendChild(worksTitle);
  catalogue.appendChild(filters);
  catalogue.appendChild(gallery);
  const sectionWorks = document.querySelector('.gallery');
  const divFilters = document.querySelector('.filters');

  const editWorksBtn = document.createElement('p');
  editWorksBtn.innerHTML = `<a href="#modale" class="openModale">
        <i class="fa fa-light fa-pen-to-square"></i> 
        modifier </a>
        `;
  editWorksBtn.setAttribute('id', 'editWorksBtn');
  editWorksBtn.className = 'editWorksBtn';
  editWorksBtn.style.display = 'none';

  worksTitleDiv.appendChild(editWorksBtn);

  // une fois les grandes parties créées, il faut créer une image et un titre pour chaque élément du catalogue, genererWorks accomplit cette tâche en retrouvant chaque élément de la variable works.
  function genererWorks(works) {
    for (let i = 0; i < works.length; i++) {
      const work = works[i];

      const workElement = document.createElement('figure');
      workElement.setAttribute('id', `galleryFigureNumber${work.id}`);

      const imageWork = document.createElement('img');
      const newImageUrl = work.imageUrl.replace(
        'http://localhost:5678',
        'https://p3.arthurpellissier.com'
      );
      imageWork.src = newImageUrl;
      imageWork.crossOrigin = 'anonymous';

      const titleWork = document.createElement('figcaption');
      titleWork.innerText = work.title;

      sectionWorks.appendChild(workElement);
      workElement.appendChild(imageWork);
      workElement.appendChild(titleWork);
    }
  }

  // une fois la fonction déclarée, on l'appelle.
  genererWorks(works);

  // Les fonctions suivantes servent à générer des boutons pour filtrer les travaux du Catalogue
  // Il faut aller chercher les catégories existantes, puis ne les afficher qu'une fois par occurrence
  // on crée un Array pour lister les catégories, puis on valide l'absence de la valeur dans l'Array avant d'y ajouter la valeur, pour n'avoir qu'une fois chaque catégorie
  // Pour la création des filtres, il est préférable d'utiliser cette méthode afin de n'avoir que des boutons pour des catégories qui ont bien des travaux "actifs"
  // on utilisera le Get Categories de l'API dans un autre cadre, qui a besoin d'afficher toutes les catégories possibles, même lorsqu'aucun travail correspondant n'est actuellement présent en bdd
  function genererFiltres() {
    for (let i = 0; i < works.length; i++) {
      const work = works[i];
      if (!filterCat.includes(work.category.name)) {
        filterCat.push(work.category.name);
      }
    }
    // Intégration d'un bouton affichant tous les travaux, qui va très simplement appeler la fonction "genererWorks()" en utilisant le tableau de l'ensemble des travaux
    const noFilterBtn = document.createElement('button');
    noFilterBtn.className = `filterButton`;
    noFilterBtn.id = 'noFilter';
    noFilterBtn.innerText = 'Tous';
    divFilters.appendChild(noFilterBtn);
    noFilterBtn.addEventListener('click', function () {
      document.querySelector('.gallery').innerHTML = '';
      genererWorks(works);
    });

    // on utilise l'Array créé précédemment pour créer les boutons des catégories

    for (let i = 0; i < filterCat.length; i++) {
      // création des boutons et attributions de classes et ID pour ces boutons
      const filterElement = document.createElement('button');
      filterElement.className = `filterButton`;
      filterElement.id = `${filterCat[i]}`;
      filterElement.innerText = filterCat[i];
      divFilters.appendChild(filterElement);
      filterElement.addEventListener('click', function () {
        const btnId = this.id;
        const filWork = works.filter(function (work) {
          return work.category.name == btnId;
        });

        // on supprime le contenu HTML de la gallery pour la recréer ensuite, mais avec une nouvelle variable dans notre fonction : filWork, le tableau fraichement créé pour cet usage. Toujours en utilisant la fonction genererWorks
        document.querySelector('.gallery').innerHTML = '';
        genererWorks(filWork);
      });
    }
  }

  // on crée les boutons en appelant la fonction précédemment déclarée
  genererFiltres(works);
}

// Fonction permettant de modifier le display du catalogue pour l'afficher
const showPortfolio = function () {
  catalogue.setAttribute('style', 'display = null');
};
// fonction permettant de détruire l'intégralité du contenu du catalogue. Utile pour mettre à jour les données après une mise à jour de works
function destroyPortfolio() {
  catalogue.innerHTML = '';
}

// HEADER

// Création du Header
function createHeader() {
  header.className = 'header';

  const editBanner = document.createElement('section');
  editBanner.setAttribute('id', 'editBanner');
  editBanner.className = 'editBanner';
  editBanner.style.display = 'none';
  editBanner.innerHTML = `   <p class="editBannerElement"> 
        <i class="fa fa-light fa-pen-to-square"></i> 
        Mode Edition</p>
        <button id="publishChange" class="publishBtn editBannerElement">publier les changements</button>
    `;

  header.appendChild(editBanner);

  const titleAndNav = document.createElement('div');
  titleAndNav.className = 'titleAndNav';

  const title = document.createElement('h1');
  title.className = 'title';
  title.innerHTML = "Sophie Bluel <span> Architecte d'intérieur</span>";

  const nav = document.createElement('nav');
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

  // on note les variables utilisées dans le document (à noter que cela doit être fait APRES avoir créé le HTML du Header, sinon les variables sont null)
  const projectBtn = document.getElementById('projectBtn');
  const contactBtn = document.getElementById('contactBtn');
  const loginBtn = document.getElementById('loginBtn');

  // on ajoute les eventlisteners qui permettent la navigation depuis les 3 boutons du Header
  projectBtn.addEventListener('click', navPortfolio);
  contactBtn.addEventListener('click', navContact);
  loginBtn.addEventListener('click', navLogin);
}

// on affiche le header en modifiant son display, on valide d'abord le statut de connexion de l'utilisateur
const showHeader = function () {
  isLoggedIn();
  header.style.display = null;
};

// on détermine une fonction qui permet de charger la page principale, elle sera appelée au lancement de la page
// Cette fonction crée chaque élément, tout en vérifiant si l'utilisateur est connecté ou non
function load() {
  createPortfolio();
  createHeader();
  createIntro();
  createContact();
  addProfilePicModifierBtn();
  isLoggedIn();
}

// une fois la page chargée, on appelle la fonction qui affichera tous les éléments de la homepage
const showMainPage = function () {
  showHeader();
  showIntro();
  showPortfolio();
  showContact();
  destroyLogin();
};

// on écrit les fonctions qui créent le scroll vers le catalogue ou les contacts :
function scrollToPortfolio() {
  catalogue.scrollIntoView({
    align: true,
    behavior: 'smooth',
  });
}

function scrollToContact() {
  contact.scrollIntoView({
    align: true,
    behavior: 'smooth',
  });
}
//  on crée ensuite les fonctions qui vérifient l'état d'affichage de ces éléments avant de déclencher le scroll, permettant ainsi de naviguer même depuis l'interface "login"
function navPortfolio() {
  if (catalogue.style.display != null) {
    showMainPage();
  }
  scrollToPortfolio();
}

function navContact() {
  if (contact.style.display != null) {
    showMainPage();
  }
  scrollToContact();
}

// Le bouton "Login" peut avoir 2 valeurs, soit login, soit logout, il faut déterminer la valeur "actuelle" avant de déterminer les actions à mener : soit déconnecter l'utilisateur, soit lui montrer la page de connexion
function navLogin() {
  const loginBtn = document.getElementById('loginBtn');
  const loginBtnValue = loginBtn.innerText;
  if (loginBtnValue == 'logout') {
    logOut();
  } else {
    destroyLogin();
    showLogin();
  }
}
// isLoggedIn permet de déterminer le statut de connexion de l'internaute en allant vérifier l'existence d'un userId dans le localStorage.
// S'il y avait plusieurs types d'utilisateurs avec des droits différents, il faudrait également consulter le backend pour valider le niveau de droits. Ce n'est pas nécessaire ici.

function isLoggedIn() {
  const userId = localStorage.getItem('userData');
  // si l'utilisateur est connecté, on modifie le bouton login pour qu'il affiche "logout", et on montre la homepage dans sa version "édition"
  if (userId != null) {
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.innerText = 'logout';
    showEditPage();
  } else {
    logOut();
  }
}

// la fonction logOut permet de masquer l'affichage des parties "édition" du site, pour retourner sur la version visible du public,
// elle détruit également toute information contenue dans le local storage, et remodifie le texte du bouton login pour afficher "login"
function logOut() {
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.innerHTML = 'login';
  localStorage.clear();
  destroyEditPage();
}

// destroyHeader permet de supprimer tout le HTML contenu dans le header
function destroyHeader() {
  const header = document.querySelector('header');
  header.innerHTML = '';
}

// MODALE

// on évite la propagation des événements, tels que le click pour quitter la modale
const stopPropagation = function (e) {
  e.stopPropagation();
};

// on déclare la fonction d'ouverture de la modale
function openModale(e) {
  e.preventDefault();
  modale = document.querySelector(e.target.getAttribute('href'));
  previouslyFocusedElement = document.querySelector(':focus');
  modale.style.display = null;
  modale.removeAttribute('aria-hidden');
  modale.setAttribute('aria-modal', 'true');
  modale.addEventListener('click', closeModale);
  const closeButton = modale.querySelector('.closeModale');
  closeButton.addEventListener('click', closeModale);
  const stopProp = modale.querySelector('.modale-stop');
  stopProp.addEventListener('click', stopPropagation);
}

// et une fonction inverse, qui ferme la modale
const closeModale = function (e) {
  if (modale === null) return;
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
  e.preventDefault();
  modale.style.display = 'none';
  modale.setAttribute('aria-hidden', 'true');
  modale.removeAttribute('aria-modal');
  modale.removeEventListener('click', closeModale);
  const closeButton = modale.querySelector('.closeModale');
  closeButton.removeEventListener('click', closeModale);
  const stopProp = modale.querySelector('.modale-stop');
  stopProp.removeEventListener('click', stopPropagation);
  modale = null;
  showMainModale();
};

// on crée le HTML des 2 modales : la Modale1 affiche le catalogue modifiable, la modale2 affiche le formulaire d'ajout de travaux
function createModale() {
  const modaleSection = document.createElement('section');
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
                    <label class="addImgLabel"><p>+ Ajouter Photo </p><p class="addWorkFormMandatoryStar">*</p><input type="file" accept="image/png, image/jpeg" name="image" id="imageInput" required> </input></label>
                    <p> jpg, png: 4mo max</p>
                    </div>
                      
                        <label class="addWorkLabel"><p>Titre</p> <p class="addWorkFormMandatoryStar">*</p></label>
                        <input class="addWorkTitle" name="title" required></input>
                        <label class="addWorkLabel"><p>Catégorie</p><p class="addWorkFormMandatoryStar">*</p></label>
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
  const main = document.querySelector('main');
  main.appendChild(modaleSection);
  addEventListeners();
  addPostListener();
  listenBtnPhoto();
  genererCategories();
  showMainModale();
  genererWorksModifiables();
  addImgChangeListener();

  // ne jamais déclencher cette fonction.
  selfDestruct();
}

// on appelle la fonction précédemment créée
createModale();

// on crée des listeners pour chaque lien permettant d'ouvrir la modale
function addEventListeners() {
  document.querySelectorAll('.openModale').forEach((a) => {
    a.addEventListener('click', openModale);
  });
}

// on écoute le bouton permettant d'afficher la modale2, qu'on appelle "picAdd", puisqu'elle permet d'ajouter des photos
function listenBtnPhoto() {
  const addPicBtn = document.getElementById('picAddBtn');
  addPicBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showPicAdd();
  });
}

// la modale2, ou picAdd, dispose d'une flèche orientée vers la gauche, permettant de revenir à la modale1, cette fonction permet de l'écouter et d'afficher la modale principale sur un click
function listenArrowLeft() {
  const arrowLeft = document.querySelector('.arrowLeft');
  arrowLeft.addEventListener('click', function (e) {
    e.preventDefault();
    showMainModale();
  });
}

// on fait l'inverse, il s'agit de l'affichage par défaut de la modale, il est appelé lors du click "OpenModale"
function showMainModale() {
  const picAddDiv = document.querySelector('.modale2');
  const mainModale = document.querySelector('.modale1');

  picAddDiv.style.display = 'none';
  mainModale.style.display = null;
}
// on montre la modale2, ou PicAdd, et on cache la modale1, ou mainModale
function showPicAdd() {
  const picAddDiv = document.querySelector('.modale2');
  const mainModale = document.querySelector('.modale1');
  listenArrowLeft();
  picAddDiv.style.display = null;
  mainModale.style.display = 'none';
}

// cette fonction est appelée lorsqu'un travail est ajouté avec succès, elle permet de reset le contenu du formulaire d'ajout
function recreateForm() {
  const modale2 = document.querySelector('.modale2');
  modale2.innerHTML = `
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
                    <label class="addImgLabel"><p>+ Ajouter Photo </p><p class="addWorkFormMandatoryStar">*</p><input type="file" accept="image/png, image/jpeg" name="image" id="imageInput" required> </input></label>
                    <p> jpg, png: 4mo max</p>
                    </div>
                      
                        <label class="addWorkLabel"><p>Titre</p> <p class="addWorkFormMandatoryStar">*</p></label>
                        <input class="addWorkTitle" name="title" required></input>
                        <label class="addWorkLabel"><p>Catégorie</p><p class="addWorkFormMandatoryStar">*</p></label>
                        <select type="select" class="selectCategory" name="category" required>
                          <option value=""></option>
                        </select>
                        <hr class="hrLineAddWorkForm">
                        <input type="submit" value="Ajouter Photo"  id="confirmAddWork">
                      </form>
                    </div>
                  </div>
                  `;
  addImgChangeListener();
  addPostListener();
  genererCategories();
}
// Cette fonction permet de conserver le focus à l'intérieur de la modale lors d'une navigation clavier
const focusinModal = function (e) {
  e.preventDefault();
  focusableSelector = 'button, a, input, textarea, select';
  focusableElement = Array.from(modale.querySelectorAll(focusableSelector));
  let index = focusableElement.findIndex(
    (f) => f === modale.querySelector(':focus')
  );
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  if (index < 0) {
    index = focusableElement.length - 1;
  }
  if (index >= focusableElement.length) {
    index = 0;
  }

  focusableElement[index].focus();
};

// on ajoute des listeners sur toute la page permettant de fermer la modale, ou de naviguer au clavier
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModale(e);
  }
  if (e.key === 'Tab' && modale != null) {
    focusinModal(e);
  }
});

// on génère le catalogue des travaux modifiables/supressibles
function genererWorksModifiables() {
  arrayMods = [];
  for (let i = 0; i < works.length; i++) {
    const workMod = works[i];
    const cataModale = document.querySelector('.modaleContentCatalogue');

    const workModElement = document.createElement('figure');
    workModElement.className = 'workModFigure';
    workModElement.id = `workModNumber${i} workModIdNumber${workMod.id}`; // cette figure aura 2 ID : un permettant de numéroter sa place au sein du catalogue "affiché" sur la modale, et un autre permettant d'identifier le travail qui lui est associé dans la bdd
    arrayMods.push(workModElement.id);

    const imageWorkMod = document.createElement('img');
    const newImageUrl = workMod.imageUrl.replace(
      'http://localhost:5678',
      'https://p3.arthurpellissier.com'
    );
    imageWorkMod.src = newImageUrl;
    imageWorkMod.crossOrigin = 'anonymous';
    imageWorkMod.className = 'workModImage';

    const editImgBtn = document.createElement('figcaption');
    editImgBtn.innerHTML = `<a href="#">éditer</a>`;

    const trashButtonDiv = document.createElement('div');
    trashButtonDiv.className = 'trashSymbolImgDiv';

    const trashButton = document.createElement('a');

    trashButton.setAttribute('href', '#');
    trashButton.id = `trashButtonNb${workMod.id}`; // ce bouton aura un ID permettant d'identifier le travail qui lui est associé dans la base de données
    trashButton.innerHTML = `<i class="fa fa-light fa-trash-can"></i>`;

    cataModale.appendChild(workModElement);
    workModElement.appendChild(imageWorkMod);
    workModElement.appendChild(editImgBtn);
    workModElement.appendChild(trashButtonDiv);
    trashButtonDiv.appendChild(trashButton);

    trashButton.addEventListener('click', deleteWork); // on écoute chaque bouton de suppression créé
  }

  // le tableau arrayMods nous permet de connaître le premier élément affiché sur ce catalogue, et de lui associer un bouton "expand"
  const expandBtn = document.createElement('div');
  expandBtn.className = 'expandSymbolDiv';
  expandBtn.innerHTML = `<a href="#"><i class="fa fa-solid fa-up-down-left-right"></i></a>`;

  const firstWorkMod = document.getElementById(`${arrayMods[0]}`);
  firstWorkMod.appendChild(expandBtn);
}

// la fonction deleteWork permet de trouver l'ID du bouton "delete" cliqué, de le transformer en chiffres uniquement, puis de supprimer le travail correspondant et ses affichages sur le catalogue principal et celui de la modale
async function deleteWork(event) {
  event.preventDefault();
  const userInfo = JSON.parse(localStorage.getItem('userData'));
  const userToken = userInfo.token;
  const workIdString = this.id.match(/\d/g);
  const workId = workIdString.join('');
  const destroyShowDiv = this.parentNode;
  const destroyShowElement = destroyShowDiv.parentNode;
  destroyGalleryFigure = document.getElementById(
    `galleryFigureNumber${workId}`
  );

  destroyShowElement.remove();
  destroyGalleryFigure.remove();

  const sendDeleteRequest = await fetch(`/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${userToken}`,
    },
  });
  // On met à jour la variable works en fonction de la nouvelle BDD des travaux
  updateWorks();
}

// Ajout d'un listener sur le lien "supprimer la galerie"
function selfDestruct() {
  const selfDestructBtn = document.getElementById('selfDestructBtn');
  selfDestructBtn.addEventListener('click', deleteAll);
}

// deleteAll est principalement une boucle permettant de supprimer tous les travaux existants. Un par un.
// on commence par "updateWorks" afin d'être sûr d'avoir les dernières données de la bdd à jour avant de commencer la boucle
async function deleteAll(event) {
  event.preventDefault();
  const userInfo = JSON.parse(localStorage.getItem('userData'));
  const userToken = userInfo.token;
  updateWorks();
  for (let i = 0; i < works.length; i++) {
    const currentItem = works[i];
    const currentItemId = currentItem.id;
    // console.log(currentItemId);
    const destroyGalleryFigure = document.getElementById(
      `galleryFigureNumber${currentItemId}`
    );
    destroyGalleryFigure.remove();
    const cataModale = document.querySelector('.modaleContentCatalogue');
    const sendDeleteRequest = await fetch(`/api/works/${currentItemId}`, {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (cataModale != null) {
      cataModale.remove();
    }
  }
  updateWorks(); // on finit en mettant à jour la variable works.
}

// La fonction suivante permet de récupérer les catégories de la base de données
// cela servira à présenter plusieurs choix à l'admin lors de l'ajout de travaux
async function genererCategories() {
  const getCat = await fetch('/api/categories');
  const catList = await getCat.json();
  // on utilise l'Array créé précédemment pour créer les options des catégories
  for (let i = 0; i < catList.length; i++) {
    const selectCategory = document.querySelector('.selectCategory');

    const categorie = document.createElement('option');
    categorie.className = `selectCategoryElement`;
    categorie.id = `${catList[i].name}`;
    categorie.value = catList[i].id; // !! On enverra cette valeur à la bdd lors du push !!
    categorie.innerText = `${catList[i].name}`;
    selectCategory.appendChild(categorie);
  }
}

// on écoute le submit du formulaire
function addPostListener() {
  const addWorkForm = document.querySelector('.addWorkForm');
  addWorkForm.addEventListener('submit', postWork);
}

// on écoute le changement de l'input permettant l'ajout d'une image, puis on affiche cette image
// on s'assure dans la même fonction que l'image permette toujours le choix d'une nouvelle image
function addImgChangeListener() {
  const imgInput = document.querySelector('input[name="image"]');

  imgInput.addEventListener('change', function (event) {
    event.preventDefault();
    const imageDiv = document.getElementById('dropzone');
    const imgFontAwesome = imageDiv.querySelector('.fa');
    imgFontAwesome.style.display = 'none';

    const imgDivLabel = imageDiv.querySelector('label');
    const imgDivLabelP = imgDivLabel.querySelector('p');
    const imgDivLabelPreviousImg = imgDivLabel.querySelector('img');
    if (imgDivLabelP != null) {
      imgDivLabelP.remove();
    }
    if (imgDivLabelPreviousImg != null) {
      imgDivLabelPreviousImg.remove();
    }
    imgDivLabel.setAttribute('class', 'imgDivLabel');
    const imgDivText = imageDiv.querySelector('p');
    imgDivText.style.display = 'none';
    const newImgDisplay = document.createElement('img');
    const imgUrl = imgInput.files[0];

    newImgDisplay.src = URL.createObjectURL(imgUrl);
    newImgDisplay.className = 'newImgDisplay';

    addImgChangeListener();
    imgDivLabel.appendChild(newImgDisplay);
  });
}

// fonction permettant de récupérer les données du formulaire d'ajout de photo, et de les envoyer au serveur
function postWork(event) {
  event.preventDefault();
  const addWorkForm = document.querySelector('.addWorkForm');
  const formData = new FormData(addWorkForm);
  const userToken = JSON.parse(localStorage.getItem('userData')).token;

  fetch('/api/works', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json',
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => createElementAfterAdding(res))
    .then((res) => updateWorks());
}

// ajout de la nouvelle photo à la mainmodale et au catalogue
function createElementAfterAdding(res) {
  recreateForm();
  const newWorkId = res.id;
  const newWorkImg = res.imageUrl;
  const newWorkTitle = res.title;

  const cataModale = document.querySelector('.modaleContentCatalogue');

  const workModElement = document.createElement('figure');
  workModElement.className = 'workModFigure';
  workModElement.id = `workModIdNumber${newWorkId}`;

  const imageWorkMod = document.createElement('img');
  imageWorkMod.src = newWorkImg;
  imageWorkMod.crossOrigin = 'anonymous';
  imageWorkMod.className = 'workModImage';

  const editImgBtn = document.createElement('figcaption');
  editImgBtn.innerHTML = `<a href="#">éditer</a>`;

  const trashButtonDiv = document.createElement('div');
  trashButtonDiv.className = 'trashSymbolImgDiv';

  const trashButton = document.createElement('a');

  trashButton.setAttribute('href', '#');
  trashButton.id = `trashButtonNb${newWorkId}`;
  trashButton.innerHTML = `<i class="fa fa-light fa-trash-can"></i>`;
  cataModale.appendChild(workModElement);
  workModElement.appendChild(imageWorkMod);
  workModElement.appendChild(editImgBtn);
  workModElement.appendChild(trashButtonDiv);
  trashButtonDiv.appendChild(trashButton);

  trashButton.addEventListener('click', deleteWork);

  const workElement = document.createElement('figure');
  workElement.setAttribute('id', `galleryFigureNumber${newWorkId}`);

  const imageWork = document.createElement('img');
  imageWork.src = newWorkImg;
  imageWork.crossOrigin = 'anonymous';

  const titleWork = document.createElement('figcaption');
  titleWork.innerText = newWorkTitle;

  const sectionWorks = document.querySelector('.gallery');

  sectionWorks.appendChild(workElement);
  workElement.appendChild(imageWork);
  workElement.appendChild(titleWork);

  showMainModale();
}

// partie Login

createLogin();

async function createLogin() {
  const loginSection = document.createElement('section');
  loginSection.className = 'loginSection';
  loginSection.setAttribute('id', 'loginSection');
  loginSection.style.display = 'none';

  const loginH2 = document.createElement('h2');
  loginH2.innerText = 'Log-In';

  const loginForm = document.createElement('form');
  loginForm.className = 'loginForm';
  loginForm.setAttribute('id', 'loginForm');
  loginForm.setAttribute('method', 'POST');

  const loginEmailText = document.createElement('label');
  loginEmailText.innerText = 'E-mail';

  const loginId = document.createElement('input');
  loginId.id = 'idInput';
  loginId.className = 'loginInput';
  loginId.setAttribute('type', 'email');
  loginId.setAttribute('name', 'emailId');

  const loginPwdText = document.createElement('label');
  loginPwdText.innerText = 'Mot de Passe';

  const loginPwd = document.createElement('input');
  loginPwd.id = 'pwdInput';
  loginPwd.className = 'loginInput';
  loginPwd.setAttribute('type', 'password');
  loginPwd.setAttribute('name', 'pwdId');

  const loginSubmit = document.createElement('input');
  loginSubmit.id = 'loginSubmit';
  loginSubmit.class = 'loginSubmit';
  loginSubmit.setAttribute('value', 'Se Connecter');
  loginSubmit.setAttribute('type', 'submit');

  const forgotPwd = document.createElement('p');
  forgotPwd.className = 'forgotPwd';
  forgotPwd.setAttribute('id', 'forgotPwd');
  forgotPwd.innerHTML = `
        <a href="#" class="forgotPwdLink">
            Mot de passe oublié
        </a>
    `;

  main.appendChild(loginSection);

  loginSection.appendChild(loginH2);
  loginSection.appendChild(loginForm);
  loginForm.appendChild(loginEmailText);
  loginForm.appendChild(loginId);
  loginForm.appendChild(loginPwdText);
  loginForm.appendChild(loginPwd);
  loginForm.appendChild(loginSubmit);
  loginSection.appendChild(forgotPwd);

  const loginFormulaire = document.getElementById('loginForm');
  loginFormulaire.addEventListener('submit', function (event) {
    event.preventDefault();
    destroyUserNotFound();
    getFormInfo();
  });
}
// affichage du formulaire de connexion, annihilation de la page d'accueil
const showLogin = function () {
  exterminate();
  const loginSection = document.getElementById('loginSection');
  loginSection.style.display = null;
};

//  on "none" le display du catalogue, de l'intro et des contacts
function exterminate() {
  catalogue.style.display = 'none';
  introduction.style.display = 'none';
  contact.style.display = 'none';
  // console.log("DoctOOOOr");
}

// on display "none" le formulaire de connexion, à condition que celui-ci existe
function destroyLogin() {
  const loginSection = document.querySelector('.loginSection');
  if (loginSection == null) {
    return;
  } else {
    loginSection.style.display = 'none';
  }
}

// getFormInfo récupère les informations de connexion et les envoie au serveur pour valider la connexion
// en cas de connexion confirmée, on montre la page d'accueil dans son format modifiable et on ajoute les informations de l'utilisateur au localStorage
// en cas de connexion refusée, on l'indique à l'utilisateur, en rouge, et on compte ses échecs
async function getFormInfo() {
  const loginFormulaire = document.getElementById('loginForm');
  const loginIdSent = loginFormulaire.querySelector(
    'input[name="emailId"]'
  ).value;
  const pwdIdSent = loginFormulaire.querySelector('input[name="pwdId"]').value;

  const jsonLogin = {
    email: loginIdSent,
    password: pwdIdSent,
  };

  const serverLoginAccess = await fetch('/api/users/login', {
    method: 'POST',

    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(jsonLogin),
  });

  const serverLoginResponse = await serverLoginAccess.json();
  const serverLoginStatus = serverLoginAccess.status;

  if (serverLoginStatus == 200) {
    localStorage.setItem('userData', JSON.stringify(serverLoginResponse));
    showMainPage();
    loginAttempt = 0;
  } else {
    loginAttempt = loginAttempt + 1;
    const userNotFound = document.createElement('p');
    if (loginAttempt < 10) {
      userNotFound.innerText = `L'utilisateur n'existe pas, vérifiez votre adresse email et votre mot de passe. Vous avez essayé de vous connecter ${loginAttempt} fois.`;
    } else {
      userNotFound.innerText = `Trop de tentatives de connexion.`;
      showMainPage();
    }
    userNotFound.className = 'userNotFound';
    userNotFound.setAttribute('id', 'userNotFound');
    const loginSection = document.getElementById('loginSection');
    loginSection.appendChild(userNotFound);
  }
}

// on utilisera cette fonction pour retirer le message d'erreur de connexion
function destroyUserNotFound() {
  const userNotFound = document.getElementById('userNotFound');
  if (userNotFound != null) {
    userNotFound.remove();
  }
}

// INTRO

// Dans cette partie on crée et display l'introduction de Sophie Bluel
function createIntro() {
  const introduction = document.querySelector('#introduction');

  const introDiv = document.createElement('div');
  introDiv.className = 'introDiv';

  const profilePic = document.createElement('figure');
  profilePic.setAttribute('id', 'profilePic');
  profilePic.className = 'profilePic';
  profilePic.innerHTML = `<img src="./assets/images/sophie-bluel.png" alt="Portrait de Sophie Bluel en extérieur.">`;

  const presentation = document.createElement('article');
  presentation.innerHTML = `
            <h2>Designer d'espace</h2>
            <p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.</p>
            <p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
            <p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice)</p>
            `;
  introduction.appendChild(introDiv);
  introDiv.appendChild(profilePic);
  introDiv.appendChild(presentation);
}
const showIntro = function () {
  const introduction = document.querySelector('#introduction');
  introduction.style.display = null;
};

// CONTACT

// On crée et affiche le formulaire de contact. Aucune action pour l'instant
function createContact() {
  contact.innerHTML = `<h2 id="contactTest">Contact </h2>
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
  document.getElementById('contact').style.display = 'inherit';
}

const showContact = function () {
  contact.style.display = null;
};

// FOOTER

// le footer n'interagit pour l'instant avec rien, il s'agit donc d'un simple code HTML
document.querySelector('footer').innerHTML = `<nav>
<ul>
    <li id="mentionsLegales">Mentions Légales</li>
</ul>
</nav>`;

// éléments d'ADMIN

// ajout d'un bouton permettant l'édition de la photo de profil (pour l'instant ce bouton ouvre la modale, il pourra être modifié dans un prochain sprint)
function addProfilePicModifierBtn() {
  const editProfilePicPrompt = document.createElement('div');
  editProfilePicPrompt.innerHTML = `<p class="editProfilePicInnerText"><a href="#modale" class="openModale">
        <i class="fa fa-light fa-pen-to-square"></i> 
        modifier </a></p>
        `;
  editProfilePicPrompt.setAttribute('id', 'editProfilePicPrompt');
  editProfilePicPrompt.className = 'editProfilePicPrompt';
  const introSection = document.getElementById('introduction');
  introSection.appendChild(editProfilePicPrompt);
}

// cette fonction est appelée lorsqu'on se déconnecte, elle cache tous les éléments liés à l'édition de la page
function destroyEditPage() {
  editBanner.style.display = 'none';
  const editProfilePicPrompt = document.getElementById('editProfilePicPrompt');
  const editWorksPrompt = document.getElementById('editWorksBtn');

  if (editWorksPrompt != null && editProfilePicPrompt != null) {
    if (
      editProfilePicPrompt.style.display != 'none' ||
      editWorksPrompt.style.display != 'none'
    ) {
      editProfilePicPrompt.style.display = 'none';
      editWorksPrompt.style.display = 'none';
      // console.log("profilePicPrompt détruit avec succès.");
    }
  }
}

// cette fonction est appelée si l'utilisateur est connecté, elle montre tous les éléments liés à l'édition de la page
function showEditPage() {
  editBanner.style.display = null;
  const editProfilePicPrompt = document.getElementById('editProfilePicPrompt');
  const editWorksPrompt = document.getElementById('editWorksBtn');

  editProfilePicPrompt.style.display = null;
  editWorksPrompt.style.display = null;
}
