export{createContact, showContact};

const contactSection = document.querySelector("#contact")
function createContact(){
contactSection.innerHTML=`<h2 id="contactTest">Contact </h2>
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
document.getElementById("contact").style.display="inherit";
};

const showContact = function(){
    contactSection.style.display = null ; 
}



