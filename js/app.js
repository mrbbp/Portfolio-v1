/*
  maj 310820
    - ajout d'un bouton dans les tags pour tout (dé)selectionner
    - support des vidéos (on référence seulement une video mp4 ou ogv  ou webm, ajoute les autres sources avec le meme nom de fichier)
      au minimum 2 fichiers : une image (en prmeier sert de prévisu) , une vidéo
      config.yaml :
        urls:
          - slanted.jpg
          - 110506.mp4
    - gestion de l'object-fit des images (visu projet)
      config.yaml: objectFit: cover (contain par defaut)
  maj 200915
    - suppression de overflow:scroll sur "figcation p" (pb affichage ascenceurs sous win)
    - object-fit pour les vidéos
    - ajout classe .vcontain
    --> quand video verticale le player dépasse la fenêtre
    - gestion des videos par cliques succéssifs
      - 1: fullScreen
      - 2A: play()
      - 2B: pause()
      - réinit du comportement pour chaque nouveau projet
*/
const listeTagsBrute = [];
let listeTagActifs = [];
let listeArticles;
const listeRefs = [];
const listeConfs = [];
let _PATH_MEDIAS;
// charge le fichier de  config yaml
fetch('./config.yaml')
.then((response) => response.text())
.then((yamlResponse) => {
  // interprete le fichier yaml en obj js
  const liste = jsyaml.load( yamlResponse );
  let index = 0;
  //console.log(yamlResponse);
  // document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');

  /* lecture des parametres de configuration */
  for (const conf in liste.conf) {
    if (liste.conf[conf].medias) {
      _PATH_MEDIAS = liste.conf[conf].medias;
    }
    if (liste.conf[conf].css) {
      //console.log("css");
      for (const vari in liste.conf[conf].css) {
        const lista = liste.conf[conf].css;
        for (const key in lista[vari]) {
          // ajoute les variables css
          document.documentElement.style.setProperty("--"+key, lista[vari][key]);
          //console.log(key," ---- ",lista[vari][key]);
          //console.log(getComputedStyle(element).getPropertyValue("--"+key) );
        }
        //console.log(vari, liste.conf[conf].css[vari]);
      }
    }
  }
  // crée les élements dans le DOM à partir de la clef "images" du fichier yaml
  for (media of liste.medias) {
    listeRefs.push(media);
    // si existe ajoute les tags à la liste
    if (media.tags) {
      //console.log(media.tags, typeof(media.tags));
      const listeTagImg = media.tags.split(',');
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
    art.dataset.tags = media.tags.replace(/\s/gm, '');
    art.dataset.index = index;
    figCap.innerHTML = "<h3><strong>"+media.titre+"</strong> - "+media.annee+"</h3>";
    // remplace les \n par <br>
    figCap.innerHTML += "<p>"+media.commentaire.replace(/\n/gm,"<br>")+"</p>";
    // ajoute les propriétés de l'image

    if (media.url) { // si "url" existe dans le le fichier yaml
      image.src = _PATH_MEDIAS+media.url;
      console.log("seule:",media.url);
    } else { // sinon utilise "urls"
      image.src = _PATH_MEDIAS+media.urls[0];
    }
    if (media.lien) {
      art.dataset.lien = media.lien;
    }
    
    // corrige un bug d'affichage sur Windows™ (les ascenseurs apparaissent même quand inutiles)
    // à vérifier sur plusieurs machines win
    if (navigator.appVersion.indexOf("Win") != -1) {
      console.log("sous windows corrige overflow");
      figCap.querySelector("p").style.overflow = "unset";
    }
    
    image.title = media.titre;
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
  // ajoute le bouton pour déselectionner tous les listeTags
  const bouton = document.createElement("a");
  bouton.href = "#";
  //ah.dataset.tag = tag;
  bouton.innerHTML = "aucun";
  document.querySelector("nav.tag").appendChild(bouton);
  const listeObjTags = document.querySelectorAll("nav.tag a");
  let bListe = true;
  bouton.addEventListener("click", (e) => {
    if (bListe) {
      listeTagActifs = [];
      bListe = false;
      for (const tag of listeObjTags) {
        tag.classList.add("OFF");
      }
      bouton.innerHTML = "tous";
    } else {
      bListe = true;
      for (const tag of listeObjTags) {
        tag.classList.remove("OFF");
        listeTagActifs.push(tag.dataset.tag);
      }
      bouton.innerHTML = "aucun";
    }
    bouton.classList.remove("OFF");
    majVignettes();
  });

  // affiche "liste" sous forme d'un objet
  //console.log("listeRefs:",listeRefs);
  //console.log("listeTagsBrute:"+listeTagsBrute, "listeTags:"+listeTags );
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
// video en fullScreen?
let bvFS = false;
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
  // liste les articles dans projet
  const articles = document.querySelectorAll(".projet article");
  // efface les articles dans projets
  for (const article of articles) {
    article.parentNode.removeChild(article);
    bvFS = false;
  }
  // efface les textes si présents
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
    for (media of listeRefs[e.dataset.index].urls) {
      // utilitaire
      function addSrc2V(element, src, type) {
          const source = document.createElement('source');
          source.src = src;
          source.type = type;
          video.appendChild(source);
      }
      // créée les élements
      const art = document.createElement("article");
      const fig = document.createElement("figure");
      const image = document.createElement("img");
      const video = document.createElement("video");

      const extension = media.split(".")[1];
      console.log(media);
      // si c'est une image
      if (extension.match(/jpg|gif|jpeg|png|webp/g)){
        art.dataset.index = compteur;
        listeImagesProjetEncours.push(media);
        // ajoute les propriétés de l'image
        image.src = _PATH_MEDIAS+media;
        image.title = listeRefs[e.dataset.index].titre;
        // ajoute l'id à l'article (num de l'index)
        art.id = "art_"+compteur;
        if (compteur >0) {
          art.classList.add("cache");
        }
        // aspect ratio image en fonction conf ou par defaut
        if (listeRefs[e.dataset.index].objectFit) {
          image.classList.add(listeRefs[e.dataset.index].objectFit);
        } else {
          image.classList.add("contain");
        }
        //image.classList.add("contain");
        // ajoute les élements au DOM
        document.querySelector("section.projet").insertBefore(art,nav);
        art.appendChild(fig);
        fig.appendChild(image);
        compteur++;
      } else if (extension.match(/mp4|ogv|webm/g)) {
        listeImagesProjetEncours.push(media);

        art.id = "art_"+compteur;
        if (compteur >0) {
          art.classList.add("cache");
        }
        // ajoute le objectfit à la video
        if (listeRefs[e.dataset.index].objectFit) {
          video.classList.add("v"+listeRefs[e.dataset.index].objectFit);
          // video.width =  "80vw";
          //image.classList.add(listeRefs[e.dataset.index].objectFit);
        } else {
          video.classList.add("vcover");
        }
        // video en boucle
        video.loop = true;
        // affichage du player
        //video.controls = true;

        // c'est une vidéo
        console.log("c'est un fichier vidéo");
        addSrc2V(video, _PATH_MEDIAS+media.split(".")[0]+'.ogv', 'video/ogg');
        addSrc2V(video, _PATH_MEDIAS+media.split(".")[0]+'.webm', 'video/webm');
        addSrc2V(video, _PATH_MEDIAS+media.split(".")[0]+'.mp4', 'video/mp4');
        // ajoute les élements au DOM
        document.querySelector("section.projet").insertBefore(art,nav);
        art.appendChild(fig);
        fig.appendChild(video);

        video.addEventListener("click",(e) => {
          e.preventDefault();
          const video = e.srcElement;
          if (!bvFS) {
            video.requestFullscreen();
            bvFS = true;
          } else  {
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }
          console.log("click video",e,e.srcElement.exitFullscreen(), e.srcElement);
        });
        compteur++;
      }else {
        console.log("extension non prise en charge: "+extension);
      }
    }
    if (compteur <= 1) {
      // cache nav images
      document.querySelector("nav #p").style.display = "none";
      document.querySelector("nav #n").style.display = "none";
      // cache le  compteur  d'images
      document.querySelector("nav #num").style.display = "none";
    }
    // remontre le compteur d'image
    document.querySelector("nav #num").style.display = "block";
  } else {
    // si une seule image
    // créée les élements
    const art = document.createElement("article");
    const fig = document.createElement("figure");
    const image = document.createElement("img");

    // ajoute les propriétés de l'image
    image.src = _PATH_MEDIAS+listeRefs[e.dataset.index].url;
    image.title = listeRefs[e.dataset.index].titre;
    image.classList.add("contain");
    // ajoute les élements au DOM
    document.querySelector("section.projet").insertBefore(art,nav);
    // cache nav images
    document.querySelector("nav #p").style.display = "none";
    document.querySelector("nav #n").style.display = "none";
    // cache le  compteur  d'images
    document.querySelector("nav #num").style.display = "none";
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
