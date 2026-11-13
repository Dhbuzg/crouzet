# Crèmerie Crouzet

Site statique HTML, CSS et JavaScript, sans compilation ni dépendance à installer. Un contenu commun s’adapte aux maquettes ordinateur Version_25 et mobile Version_04, avec les nouveaux visuels.

## Utiliser le projet

Avec Node.js installé, lancer `npm start`, puis ouvrir http://127.0.0.1:4173. Arrêter avec Ctrl+C. `npm run check` vérifie la syntaxe JavaScript. Les fichiers HTML peuvent aussi être ouverts directement ; le serveur permet de tester les URL inexistantes.

## Organisation

- `index.html` : contenu, marchés, contact et métadonnées.
- `404.html` : page introuvable.
- `assets/css/site.css` : polices, variables, sections, adaptations mobiles et panneau des mentions légales.
- `assets/css/404.css` : particularités de la 404.
- `assets/js/site.js` : navigation, largeur utile, curseur et interactions des mentions légales.
- `assets/images/` : photos responsive et aperçu de partage.
- `assets/illustrations/` : SVG et curseur.
- `assets/fonts/` : polices nommées par famille, graisse et style.
- `server.mjs` : serveur local.
- `documentation/referencement.md` : notes SEO.
- `TODO.md` : suivi des travaux.

## Modifier le site

Les formats ordinateur et mobile partagent le même HTML. Le point de rupture est de 760 px. Le contenu et la navigation sont centrés dans une largeur maximale de 1440 px. La version ordinateur suit les auto-layouts de Version_25 : accueil de 700 px après le menu de 75 px, sections de 800 px, espacements de 200 px, écart titre-contenu de 150 px. À 1440 px, la page mesure 3975 px. Sous cette largeur, les dimensions diminuent proportionnellement ; elles ne dépendent plus de la hauteur de fenêtre. Les paires photo/texte utilisent un conteneur flex. Le mobile conserve sa composition de 390 × 1720 px avec les nouveaux visuels. L’arrivée sur les sections ordinateur conserve un offset de 150 px à l’échelle de référence.

Modifier les textes dans index.html et les dimensions dans les règles de la section concernée. Éviter les correctifs successifs en fin de fichier. Les nouvelles photos sont des exports Figma optimisés en WebP. L’ancienne photo de préparation reste utilisée dans les métadonnées de partage, conformément au choix de référencement.

Les six illustrations sont des silhouettes SVG noires. Le CSS règle leur couleur avec un filtre et leur opacité sur les conteneurs. Les séparateurs sont déclarés à 1 px. Les liens sont soulignés sur mobile et au survol sur ordinateur. La rubrique Plateaux est retirée. Les mentions légales sont intégrées dans index.html sous forme de panneau modal : ouverture vers le haut, défilement interne, fermeture progressive par défilement vers le haut à la limite du contenu. La section dédiée de assets/js/site.js gère cette interaction ; Échap permet aussi de fermer. La position du site est conservée derrière le panneau.

Les ressources modifiées sont versionnées dans leurs références (`?v=20261113-v25-2` pour les styles actuels). Actualiser les références concernées lors d’une publication. Pas de génération automatique d’empreintes ni de compilation.

## Publication et contrôles

Conserver index.html, 404.html, favicon.png, CNAME, .nojekyll, robots.txt et sitemap.xml à la racine de la source publiée. Le rangement ne nécessite aucun changement de configuration GitHub Pages. Le dossier documentation contient des notes, et ne correspond pas à la source de publication /docs.

Le domaine canonique est https://cremeriecrouzet.fr/. En cas de changement, actualiser canonical, métadonnées de partage, données structurées, robots.txt et sitemap.xml. Voir [les notes de référencement](documentation/referencement.md).

Le serveur Node est destiné au développement ; npm start ne publie rien. Les notes suivies dans la racine publiée peuvent être accessibles publiquement : ne pas y mettre de données privées.

Vérifier Firefox et Chromium, ordinateur, mobile, 404, changements de largeur, zoom et défilement. Contrôler le clavier, la réduction du mouvement, le menu fixe, les ancres, le curseur et les liens mail/téléphone. Comparer aux maquettes et cocher uniquement les contrôles réalisés dans TODO.md.

## Sources

- [Figma Crouzet](https://www.figma.com/design/nmCJegZYehT8oqW1ipGjeQ)
- [Gambetta — Fontshare](https://www.fontshare.com/fonts/gambetta)
- [Inter](https://rsms.me/inter/)
- [Newsreader](https://github.com/productiontype/Newsreader)

Photos et illustrations : ressources fournies pour le projet.

Le favicon reste au format PNG, 192 × 192 px. Après remplacement, actualiser sa référence `favicon.png?v=...` dans toutes les pages HTML pour renouveler le cache du navigateur.

Le défilement à la molette est amorti sur ordinateur, y compris dans les mentions légales et pendant leur fermeture. Les gestes tactiles restent natifs et la préférence de réduction des animations est respectée. Le curseur est conservé dans la couche supérieure pendant les transitions.
