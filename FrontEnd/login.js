import{load, destroyHeader, showMainPage} from "./header.js";
export {main, showLogin, exterminate, destroyLogin, showLogin};

let loginAttempt=0;
const main = document.getElementById("main");   
createLogin();

async function createLogin(){
    
    const loginSection = document.createElement("section");
    loginSection.className = "loginSection";
    loginSection.setAttribute("id","loginSection");
    loginSection.style.display = "none";
    
    const loginH2 = document.createElement("h2");
    loginH2.innerText = "Log-In";

    const loginForm = document.createElement("form");
    loginForm.className = "loginForm";
    loginForm.setAttribute("id","loginForm");
    loginForm.setAttribute("method","POST");
    
    
    const loginEmailText = document.createElement("label");
    loginEmailText.innerText="E-mail";


    const loginId = document.createElement("input");
    loginId.id = "idInput";
    loginId.className = "loginInput";
    loginId.setAttribute("type","email");
    loginId.setAttribute("name","emailId")
 
    
    const loginPwdText = document.createElement("label");
    loginPwdText.innerText = "Mot de Passe";
        
    const loginPwd = document.createElement("input");
    loginPwd.id ="pwdInput";
    loginPwd.className = "loginInput";
    loginPwd.setAttribute("type","password");
    loginPwd.setAttribute("name","pwdId")
 

    const loginSubmit = document.createElement("input");
    loginSubmit.id = "loginSubmit"; 
    loginSubmit.class = "loginSubmit";
    loginSubmit.setAttribute("value", "Se Connecter")
    loginSubmit.setAttribute("type","submit");


    const forgotPwd = document.createElement("p");
    forgotPwd.className="forgotPwd";
    forgotPwd.setAttribute("id","forgotPwd");
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
    if(loginFormulaire == null){
        console.log("le formulaire n'existe pas");
    }
    else{
        console.log("le formulaire existe");
    }
    loginFormulaire.addEventListener("submit",function(event){
        event.preventDefault();
        console.log("preventDefault");
        destroyUserNotFound();

        getFormInfo();

    });
};

const showLogin = function(){
    exterminate();
    const loginSection = document.getElementById("loginSection");
    loginSection.style.display = null;
}


//    on retire le HTML du catalogue, de l'intro et des contacts, qui ne sont pas présents sur le formulaire de connexion
function exterminate(){
    const portfolio = document.querySelector("#portfolio");
    const introduction = document.querySelector("#introduction");
    const contact = document.querySelector("#contact");
    // introduction.innerHTML= ""; 
    // portfolio.innerHTML= "";
    // contact.innerHTML="";
    portfolio.style.display = "none";
    introduction.style.display = "none";
    contact.style.display="none";
    console.log("DoctOOOOr");

   }

//    on empêche le HTML du login de se démultiplier.
   function destroyLogin(){

    const loginSection = document.querySelector(".loginSection");
    

    if(loginSection == null){
        console.log("I'm not doing anything");
    }
    else{
        // loginSection.remove();
        loginSection.style.display = "none";
        console.log("Login Destruction confirmed");
    }
    
}

async function getFormInfo(){
    
    const loginFormulaire = document.getElementById("loginForm");
    console.log("formulaire envoyé!");
    const loginIdSent = loginFormulaire.querySelector('input[name="emailId"]').value;
    const pwdIdSent = loginFormulaire.querySelector('input[name="pwdId"]').value;
    console.log(loginIdSent); // on montre l'ID
    console.log(pwdIdSent); // on montre le mdp
    const jsonLogin = {
        "email" : loginIdSent,
        "password": pwdIdSent
    }
    
    const serverLoginAccess = await fetch('http://localhost:5678/api/users/login',
    {
        method : 'POST',
       
        headers:{
            'Accept': 'applicationnp/json',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(jsonLogin)
    
    });
    

    const serverLoginResponse = await serverLoginAccess.json();
    const serverLoginStatus =  serverLoginAccess.status;
    console.log(serverLoginStatus);
    console.log(serverLoginResponse);

    if (serverLoginStatus == 200){
        console.log("connexion en cours");
        localStorage.setItem("userData", JSON.stringify(serverLoginResponse));
        const data = localStorage.getItem("userData");
        console.log(data);
        // destroyHeader();
        showMainPage();
        loginAttempt = 0;
    }
    else{
        loginAttempt = loginAttempt+1;

        const userNotFound = document.createElement("p");
        if(loginAttempt<10){
        userNotFound.innerText=`L'utilisateur n'existe pas, vérifiez votre adresse email et votre mot de passe. Vous avez essayé de vous connecter ${loginAttempt} fois.`;
        }
        else{
            userNotFound.innerText=`Trop de tentatives de connexion.`;
            showMainPage();
        }
        userNotFound.className="userNotFound";
        userNotFound.setAttribute("id","userNotFound");
        const loginSection = document.getElementById("loginSection");
        loginSection.appendChild(userNotFound);

        console.log("utilisateur introuvable");
    };
    
};

function destroyUserNotFound(){
    const userNotFound = document.getElementById("userNotFound");
    if(userNotFound != null){
        userNotFound.remove();
    }
}




