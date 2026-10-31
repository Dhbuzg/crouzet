# Crèmerie Crouzet

Site statique HTML, CSS et JavaScript, sans compilation ni dépendance à installer. Un contenu commun s’adapte aux maquettes ordinateur Version_22 et mobile Version_03, avec leurs dernières corrections.

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

Les formats ordinateur et mobile partagent le même HTML. Le point de rupture est de 760 px. Les coordonnées suivent les maquettes Figma : sections de 1440 × 800 espacées de 200 px sur ordinateur (Version_23), maquette mobile de 390 × 1720 px (Version_04). L’arrivée sur les sections ordinateur utilise un offset de 150 px à l’échelle de référence. Les variables sont au début de site.css ; les adaptations mobiles et le panneau légal sont regroupés dans des sections dédiées.

Modifier les textes dans index.html et les dimensions dans les règles de la section concernée. Éviter les correctifs successifs en fin de fichier. Conserver les variantes de photos référencées par picture/srcset : elles fournissent les recadrages et résolutions utiles.

Les SVG utilisent #2b4a31, avec 10 % d’opacité pour les fonds. Les séparateurs sont déclarés à 1 px. Les liens sont soulignés sur mobile et au survol sur ordinateur. La rubrique Plateaux est retirée. Les mentions légales sont intégrées dans index.html sous forme de panneau modal : ouverture vers le haut, défilement interne, fermeture progressive par défilement vers le haut à la limite du contenu. La section dédiée de assets/js/site.js gère cette interaction ; Échap permet aussi de fermer. La position du site est conservée derrière le panneau.

Les ressources modifiées sont versionnées dans leurs références (`?v=20261031-5` pour les styles actuels). Actualiser les références concernées lors d’une publication. Pas de génération automatique d’empreintes ni de compilation.

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
