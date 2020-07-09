let listeTagsBrute = [];
let listeTagActifs = [];
let listeArticles;
let listeRefs = [];
// charge le fichier de  config yaml
fetch('./config.yaml')
.then((response) => response.text())
.then((yamlResponse) => {
  // interprete le fichier yaml en obj js
  const liste = jsyaml.load( yamlResponse );
  let index = 0;
  // crée les élements dans le DOM à partir de la clef "images" du fichier yaml
  for (img of liste.images) {
    listeRefs.push(img);
    // si existe ajoute les tags à la liste
    if (img.tags) {
      console.log(img.tags, typeof(img.tags));
      const listeTagImg = img.tags.split(',');
      for (const i of listeTagImg) {
        listeTagsBrute.push(i.trim());
      }
    }
    // créée les élements
    const art = document.createElement("article");
    const fig = document.createElement("figure");
    const image = document.createElement("img");
    const figCap = document.createElement("figcaption");
    // ajoute les tags (sans espace) dans data-tags sur l'article
    art.dataset.tags = img.tags.replace(/\s/gm, '');
    art.dataset.index = index;
    figCap.innerHTML = "<h3><strong>"+img.titre+"</strong> - "+img.annee+"</h3>";
    //figCap.innerHTML += "<h4>"+img.annee+"</h4>";
    // remplace les \n par <br>
    figCap.innerHTML += "<p>"+img.commentaire.replace(/\n/gm,"<br>")+"</p>";
    // ajoute les propriétés de l'image
    if (img.url) { // si "url" existe dans le le fichier yaml
      image.src = "./medias/"+img.url;
    } else { // sinon utilise "urls"
      image.src = "./medias/"+img.urls[0];
    }

    image.title = img.titre;
    image.classList.add("cover");
    // ajoute les élements au DOM
    document.querySelector("section.images").appendChild(art);
    art.appendChild(fig);
    fig.appendChild(figCap);
    fig.insertBefore(image, figCap);
    //console.log(image,figCap);
    index++;
  }
  listeArticles = document.querySelectorAll("section.images article");
  for (const a of listeArticles) {
    a.addEventListener("click", (e) => {
      e.stopPropagation();
      //console.log(e.currentTarget.nodeName);
      afficheProjet(e.currentTarget);
    }, true);
  }
  // Nettoie les tags redondants
  const listeTags = [...new Set(listeTagsBrute)];
  // créée la liste des tags dans la barre de nav
  for (const tag of listeTags) {
    //<a href="#" data-tag="design">#design</a>
    // incremente la liste des tags actifs (allumés)
    listeTagActifs.push(tag);
    const ah = document.createElement("a");
    ah.href = "#";
    ah.dataset.tag = tag;
    ah.innerHTML = "#"+tag;
    document.querySelector("nav.tag").appendChild(ah);
    // ajoute le comportement quand click
    ah.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      if (e.target.classList.length >= 1) { // a déjà une classe
        e.target.classList.remove("OFF");
        // MàJ listeTagActifs
        listeTagActifs.push(e.target.dataset.tag);
      } else {
        e.target.classList.add("OFF");
        // enlève le tag de listeTagActifs
        const index = listeTagActifs.indexOf(e.target.dataset.tag);
        if(index!=-1){
           listeTagActifs.splice(index, 1);
        }
      }
      majVignettes();
    });
  }
  // affiche "liste" sous forme d'un objet
  console.log("listeRefs:",listeRefs);
  console.log("listeTagsBrute:"+listeTagsBrute, "listeTags:"+listeTags );
  // affiche "liste" sous forme de chaine de caractère
  //console.log(JSON.stringify(liste));
});
// quand un tag est ajouté ou retiré
const majVignettes = () => {
  console.log(listeTagActifs);
  console.log("mise à jour des images affichables");
  listeArticles = document.querySelectorAll("section.images article");
  for (const artcl of listeArticles) {
    let compteur = 0;
    const listeTagArticle = artcl.dataset.tags.split(',');
    for (const t of listeTagActifs) {
      const found = listeTagActifs.some((t) => listeTagArticle.includes(t));
      if (found) {
        compteur++;
      }
    }
    if (compteur>0) {
      artcl.style.display = "block";
    } else {
      artcl.style.display = "none";
    }
  }
};
// Gestion de l'affichage d'un projet
let projetEncours;
let projetArticleEncours;
const listeImagesProjetEncours = [];
let nbrArticlesProjetEncours = 0;
const afficheProjet = (e) => {
  projetArticleEncours = 0;
  projetEncours = e.dataset.index;
  console.log("projetEncours: "+projetEncours);
  // animation et placement des ecrans
  const nav = document.querySelector(".projet nav");
  document.querySelector(".projet").style.left = 0;
  document.querySelector(".projet").style.opacity = 1;
  document.querySelector(".projet").style.visibility = 1;
  //document.querySelector("#berceau").style.marginLeft = "-100vw";
  //document.querySelector("#berceau").style.marginTop = 0;
  //document.querySelector("#berceau").style.height  = "100vh";
  document.querySelector("nav.tag").style.marginTop = "-2rem";
  document.querySelector("nav #p").style.display = "block";
  document.querySelector("nav #n").style.display = "block";
  // efface les articles dans projets (nettoie)
  const articles = document.querySelectorAll(".projet article");
  for (const article of articles) {
    article.parentNode.removeChild(article);
  }
  const asideOld = document.querySelector(".projet aside");
  try {asideOld.parentNode.removeChild(asideOld)} catch(e) {}

  // ajoute les textes
  const aside = document.createElement("aside");
  aside.innerHTML = "<h3><span>"+listeRefs[e.dataset.index].titre+"</span></h3>";
  aside.innerHTML += "<h4><span>"+listeRefs[e.dataset.index].annee+"</span></h4>";
  // remplace les \n par <br>
  aside.innerHTML += "<p><span>"+listeRefs[e.dataset.index].commentaire.replace(/\n/gm,"<br>")+"</span></p>";
  // charge les images du projet
  // si plusieurs images
  let compteur = 0;
  if (listeRefs[e.dataset.index].urls) {
    for (img of listeRefs[e.dataset.index].urls) {
      // créée les élements
      const art = document.createElement("article");
      const fig = document.createElement("figure");
      const image = document.createElement("img");

      art.dataset.index = compteur;
      listeImagesProjetEncours.push(img);
      // ajoute les propriétés de l'image
      image.src = "./medias/"+img;
      image.title = listeRefs[e.dataset.index].titre;
      // ajoute l'id à l'article (num de l'index)
      art.id = "art_"+compteur;
      if (compteur >0) {
        art.classList.add("cache");
      }
      image.classList.add("contain");
      // ajoute les élements au DOM
      document.querySelector("section.projet").insertBefore(art,nav);
      art.appendChild(fig);
      fig.appendChild(image);
      compteur++;
    }
  } else {
    // si une seule image
    // créée les élements
    const art = document.createElement("article");
    const fig = document.createElement("figure");
    const image = document.createElement("img");

    // ajoute les propriétés de l'image
    image.src = "./medias/"+listeRefs[e.dataset.index].url;
    image.title = listeRefs[e.dataset.index].titre;
    image.classList.add("contain");
    // ajoute les élements au DOM
    document.querySelector("section.projet").insertBefore(art,nav);
    document.querySelector("nav #p").style.display = "none";
    document.querySelector("nav #n").style.display = "none";
    art.appendChild(fig);
    fig.appendChild(image);
  }
  nbrArticlesProjetEncours = compteur;
  // affiche le num de l'image
  document.querySelector("nav #num").innerHTML = "<strong>"+(projetArticleEncours+1)+"</strong> /  "+nbrArticlesProjetEncours;

  console.log("nbrArticlesProjetEncours",nbrArticlesProjetEncours);
  document.querySelector("section.projet").appendChild(aside);
  //console.log("listeRefs[projetEncours].urls: "+listeRefs[projetEncours].urls);
  console.log("listeImagesProjetEncours: "+listeImagesProjetEncours)
};
// retour
document.querySelector("nav #b").addEventListener("click", () => {
  //document.querySelector("#berceau").style.marginLeft = "0";
  document.querySelector(".projet").style.left = "100vw";
  document.querySelector(".projet").style.opacity = 0;
  document.querySelector(".projet").style.visibility = 0;
  //document.querySelector("#berceau").style.marginTop = "2rem";
  document.querySelector("#berceau").style.height  = "calc(100vh - 2rem)"
  document.querySelector("nav.tag").style.marginTop = 0;
});
// image suivante
document.querySelector("nav #n").addEventListener("click", () => {
  document.querySelector("#art_"+projetArticleEncours%nbrArticlesProjetEncours).classList.add("cache");
  // image suivante
  projetArticleEncours += 1;
  projetArticleEncours = projetArticleEncours%nbrArticlesProjetEncours;
  document.querySelector("#art_"+projetArticleEncours).classList.remove("cache");
  document.querySelector("nav #num").innerHTML = "<strong>"+(projetArticleEncours+1)+"</strong> /  "+nbrArticlesProjetEncours;
});
document.querySelector("nav #p").addEventListener("click", () => {
  // image precedente
  document.querySelector("#art_"+projetArticleEncours%nbrArticlesProjetEncours).classList.add("cache");
  // image precedente
  projetArticleEncours -= 1;
  if (projetArticleEncours<0) {projetArticleEncours = nbrArticlesProjetEncours-1}
  document.querySelector("#art_"+projetArticleEncours).classList.remove("cache");
  document.querySelector("nav #num").innerHTML ="<strong>"+(projetArticleEncours+1)+"</strong> /  "+nbrArticlesProjetEncours;
});
