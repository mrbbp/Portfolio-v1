# Portfolio-v1.2
_A small portfolio (~~only picture~~ pictures + videos) with yaml formated file for content description_

Un simple portfolio, html + css + js + fichier yaml de config (pour desktop).
Design frugal (pas de base de donnée MySQL), un simple fichier yaml pour structurer le contenu.
Il suffit de compléter le fichier `config.yaml` pour ajouter des contenus (et d'ajouter les medias sur le serveur).

C'est un ~~première~~ seconde ébauche d'un portfolio destiné  aux étudiants du DNMADe Design graphique en mouvement du lycée Bréquigny de Rennes. (url encours)

- Pour le moment, le script attend une ou des images, créée des `<article><figure><img></figure><figcaption></figcaption></article>` à partir de `urls` ou `url` (ou créée un objet `<video>`)

- Une barre contenant tous les tags (contenus dans `config.yaml`) est générée et permet de montrer/cacher certains projets (simple disparition dans la colonne de droite)

- Lorsque qu'un projet est cliqué, une "light-box" permet de faire défiler les images du projet en fondu enchainé et de retourner à la sélection des projets.

- La première partie du fichier css/style.css contient qlq variables css pour modifier les couleurs du texte et l'écart entre les images (gouttière).

- le nombre de projets est "illimité"...

- Le script utilise le parser js-yaml https://github.com/nodeca/js-yaml pour structurer les infos.

- Par défaut,l'app utilise la police *Source Sans Variable*, dessinée par Adobe® system disponible [ici](https://github.com/adobe-fonts/source-sans-pro/releases)


## màj 200915:
  - Accepte les vidéos (verticales ou horizontales) format mp4, webm, ogv
  - une vidéo est précédée d'une image (prévisue sur la home)
  - ajout d'une gestion de l'`object-fit` sur les medias (images et vidéos) - calage sur la largeur ou la hauteur du média (1 object-fit / projet)
  - si les légendes (home) dépassent, il n'y a plus d'acenceur pour scroller `overflow:scroll` ... **bug sous win: montre des acenceurs vides**
  - gestion d'un clique sur la vidéo (passe en fullscreen , puis play-pause). Réinit. d'une booléenne entre chaque projet, pas testé si 2 vidéos dans un projet...
  - ajout de la gestion des couleurs du site, dans le premiere partie de `config.yaml` (remplace les variables dans la css)
  - on réference un seul fichier video dans le `config.yaml`, le script ajoute les autres formats (ogv, webm ou mp4) dans \<video> (il faut les autres formats, ne crée rien)
  - correction erreur en cas de tag: vide (config.yaml)
  
  
exemple de config.yaml

```yaml
images:
  - titre: Titre du projet
    #object-fit géré sur les vidéos et images `contain` vs `cover`
    objectFit: contain
    urls: #url des images (images ou videos)
      - url_of_image1.jpg
      - url_of_video.mov
      - url_of_image2.jpg
    # or just 1 picture
    url: url_of_image.image
    annee: 2019 #année du projet
    # la première ligne de commentaire ()+ |) permet de préciser que la suite contient des retours à la ligne qu'il faut conserver
    commentaire: |
      supporte les retours à la ligne
    tags: tag1,tag2 #ajoutez des tags qui permettent de montrer/cacher les projets, avec une [virgule] comme séparateur
  [...]
  - titre: 
```


## TODO:
- supprimer la prévisue lors de la consultation du projet quand il y a une vidéo
- gérer la lisibilité sur smartphone
