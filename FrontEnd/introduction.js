
function createIntro(){
const introduction = document.querySelector("#introduction");


const introDiv = document.createElement("div");
introDiv.className = "introDiv";

const profilePic = document.createElement("figure");
profilePic.setAttribute("id","profilePic");
profilePic.className=("profilePic");
profilePic.innerHTML=`<img src="./assets/images/sophie-bluel.png" alt="Portrait de Sophie Bluel en extérieur.">`

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
const showIntro = function(){
        const introduction = document.querySelector("#introduction");
        introduction.style.display=null;
}
export{createIntro, showIntro};