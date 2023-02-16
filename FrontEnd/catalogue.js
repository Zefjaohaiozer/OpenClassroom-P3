const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();
export {works, reponse, showPortfolio};
function showPortfolio(){

    const catalogue = document.querySelector("#portfolio");

    const worksTitleDiv = document.createElement("div");
    worksTitleDiv.className ="worksTitleDiv";
    const worksTitle = document.createElement("h2");
    worksTitle.innerText="Mes Projets";

    const filters = document.createElement("div");
    filters.className="filters";

    const gallery = document.createElement("div");
    gallery.className = "gallery";

    catalogue.style.display="inherit";

    catalogue.appendChild(worksTitleDiv);
    worksTitleDiv.appendChild(worksTitle);
    catalogue.appendChild(filters);
    catalogue.appendChild(gallery);
    console.log("catalogue.js a chargé le contenu")
    const sectionWorks = document.querySelector(".gallery");
            const divFilters = document.querySelector(".filters");
            const filterCat = [] ;



    // console.log(works);

    function genererWorks(works){
        for (let i = 0 ; i < works.length; i++){
        
        const work = works[i];
        
        const workElement = document.createElement("figure");

        const imageWork= document.createElement("img");
        imageWork.src = work.imageUrl;
        imageWork.crossOrigin="anonymous";
        
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
function genererFiltres(){


        for (let i = 0 ; i < works.length ; i++){
            const work= works[i];
            if(!filterCat.includes(work.category.name)){
            filterCat.push(work.category.name);
            }
            
        }
    // console.log(filterCat);
    
        const noFilterBtn = document.createElement("button");
        noFilterBtn.className = `filterButton`;
        noFilterBtn.id = "noFilter";
        noFilterBtn.innerText = "Tous"
        divFilters.appendChild(noFilterBtn);
        noFilterBtn.addEventListener("click", function(){
            document.querySelector(".gallery").innerHTML= "";
            genererWorks(works);
        });


    // on utilise l'Array créé précédemment pour créer les boutons des catégories 

    for (let i = 0 ; i < filterCat.length; i++){
     
        // création des boutons et attributions de classes et ID pour ces boutons 
        const filterElement = document.createElement("button");
        filterElement.className = `filterButton`;
        filterElement.id= `${filterCat[i]}`
        filterElement.innerText = filterCat[i];
        divFilters.appendChild(filterElement);
       
        // test console pour valider le fonctionnement de la fonction 
        // console.log(filterElement);


        // ajout d'un listener de click sur chaque bouton créé par la boucle, afin de filtrer correctement selon l'ID du bouton 
        filterElement.addEventListener("click", function(){

            // création d'une variable btnId qui prend l'ID du filterElement concerné 
            const btnId = this.id;
            
            // création d'un tableau filWork, ou travaux filtrés, qui ne prend que les éléments de la DB dont la catégorie name correspond précisément à l'ID du bouton 
            const filWork = works.filter(function(work){
                return work.category.name == btnId ;
            });


            // on supprime le contenu HTML de la gallery pour la recréer ensuite, mais avec une nouvelle variable dans notre fonction : filWork, le tableau fraichement créé pour cet usage. 
            document.querySelector(".gallery").innerHTML= "";
            genererWorks(filWork);
            
            // test console pour valider le fonctionnement de la fonction 
            // console.log(filWork);

        });
                   
    }
}

// on affiche les boutons, forcément.
genererFiltres(works);

};

