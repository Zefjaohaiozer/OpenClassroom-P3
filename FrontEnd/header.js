import{showIntro} from './introduction.js';
import{works, reponse, showPortfolio} from './catalogue.js';
import { showContact } from './contact.js';
import{main, showLogin, exterminate, destroyLogin} from './login.js';
import{destroyEditPage, editPage} from './admin.js';
export{load, destroyHeader};
// on importe toutes les fonctions des autres fichiers JS 

// on affiche le header
function showHeader(){
const header = document.querySelector("header");
header.className = "header";

const editBanner = document.createElement("section");
editBanner.setAttribute("id","editBanner");
editBanner.className="editBanner";
const titleAndNav = document.createElement("div");
titleAndNav.className = "titleAndNav";

const title = document.createElement("h1");
title.className="title"
title.innerHTML="Sophie Bluel <span> Architecte d'intérieur</span>"

const nav = document.createElement("nav");
nav.innerHTML=`
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
// on détermine une fonction qui permet de charger la page principale 

function load(){
    showHeader();
    isLoggedIn();

    showIntro();
    showPortfolio();
    showContact();
    destroyLogin();

    


    console.log("Travail Terminé!");


};


// une fois la page chargée, on appelle la fonction qui affichera tous les éléments de la homepage
load();



// on écrit les fonctions qui permettent de scroller 
function scrollToPortfolio(){
    
    // console.log(portfolio);
    portfolio.scrollIntoView({align:true, behavior:"smooth"});
  
}

function scrollToContact(){
    
    // console.log(contact);
    contact.scrollIntoView({align:true, behavior :"smooth"});
}

function navPortfolio(){
    if(portfolio.innerHTML == ""){
        destroyHeader();
        load();
       
        }
    scrollToPortfolio();
   
    // console.log('navportfolio a terminé son exécution')
}

function navContact(){
    if(contact.innerHTML == ""){
        destroyHeader();
        load();
        setTimeout(scrollToContact,90);
        }

    else{
        scrollToContact();
    console.log("j'ai pas attendu");
    }
    
    
}

// on exécute 2 fonctions en cliquant sur le bouton login, la première détruit le HTML du login, la seconde crée le HTML du login.
function navLogin(){
    const loginBtn = document.getElementById("loginBtn");
    const loginBtnValue = loginBtn.innerText;
    if (loginBtnValue == "Logout"){
        logOut();
    }
    else{
        destroyLogin();
        showLogin();
    }
   
}

function isLoggedIn(){
    const userId = localStorage.getItem("userData");
    if(userId != null ){
        
        const loginBtn = document.getElementById("loginBtn");
        loginBtn.innerText="Logout";
        editPage();
        
    }
    else{
        logOut();
        
    }


}

function logOut(){
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.innerHTML = "login";
    localStorage.clear();   
    destroyEditPage();

}

function destroyHeader(){
    const header = document.querySelector("header");
    header.innerHTML="";
}