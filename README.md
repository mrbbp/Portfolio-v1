# portfolio-v1
a small portfolio (only picture) with yaml simple file for content description

Un simple portfolio, html + css + js + fichier yaml de config.
Design frugal (pas de base de donnée MySQL), un simple fichier yaml pour structurer le contenu
Il suffit de remplir le fichier `config.yaml` pour ajouter des contenus (et d'ajouter les images sur le serveur).

Pour le moment, le script attend une ou des images (pas de vidéo), créée des `<article><figure><img></figure><figcaption></figcaption></article>` à partir de `urls` ou `url`

C'est un première ébauche pour un portfolio pour les étudiants de DNMADe Design graphique en mouvement du lycée Bréquigny de Rennes.

Une barre contenant tous les tags est générée et permet de désactiver certains projets (simple disparition dans la colonne)

Lorsque qu'un projet est cliqué, une "light-box" permet de faire défiler les images du projet en fondu enchainé.
La première partie du fichier css/style.css contient qlq variables css pour madifier les couleurs du texte et l'écart entre les images (gouttière)

Le script utilise le parser js-yaml https://github.com/nodeca/js-yaml pour structurer les infos.

Le design est un peu grossier, il utilise par défaut la Source Sans Variable, dessinée par Adobe® system.


exemple de config.yaml

```yaml
images:
  - titre: Titre du projet
    urls: #url des images (uniquement des images)
      - url_of_image1.jpg
      - url_of_image2.jpg
    # or just 1 picture
    url: url_of_image.image
    annee: 2019 #année du projet
    commentaire: |
      supporte les retours à la ligne
    tags: tag1,tag2 #ajouten les tags qui permettent de classer les projets
  [...]
  - titre: 
```
