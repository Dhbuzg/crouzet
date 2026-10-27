# Crèmerie Crouzet

Site statique HTML, CSS et JavaScript, sans compilation ni dépendance à installer. Un contenu commun s’adapte aux maquettes ordinateur Version_22 et mobile Version_03, avec leurs dernières corrections.

## Utiliser le projet

Avec Node.js installé, lancer `npm start`, puis ouvrir http://127.0.0.1:4173. Arrêter avec Ctrl+C. `npm run check` vérifie la syntaxe JavaScript. Les fichiers HTML peuvent aussi être ouverts directement ; le serveur permet de tester les URL inexistantes.

## Organisation

- `index.html` : contenu, marchés, contact et métadonnées.
- `404.html` : page introuvable.
- `assets/css/site.css` : polices, variables, sections et adaptations mobiles.
- `assets/css/404.css` : particularités de la 404.
- `assets/js/site.js` : navigation, largeur utile et curseur.
- `assets/images/` : photos responsive et aperçu de partage.
- `assets/illustrations/` : SVG et curseur.
- `assets/fonts/` : polices nommées par famille, graisse et style.
- `server.mjs` : serveur local.
- `documentation/referencement.md` : notes SEO.
- `TODO.md` : suivi des travaux.

## Modifier le site

Les formats ordinateur et mobile partagent le même HTML. Le point de rupture est de 760 px. La composition est mise à l’échelle depuis les coordonnées Figma : blocs de 1440 × 900 sur ordinateur, maquette de 390 px de large sur mobile. Les variables sont au début de site.css et les adaptations mobiles en fin de fichier.

Modifier les textes dans index.html et les dimensions dans les règles de la section concernée. Éviter les correctifs successifs en fin de fichier. Conserver les variantes de photos référencées par picture/srcset : elles fournissent les recadrages et résolutions utiles.

Les SVG utilisent #2b4a31, avec 10 % d’opacité pour les fonds. Les séparateurs sont déclarés à 1 px. Les liens sont soulignés sur mobile et au survol sur ordinateur. La rubrique Plateaux est retirée ; Mentions légales reste inactif tant que sa page n’est pas fournie.

Les références CSS et JavaScript partagent une version de publication : `?v=20261027`. Lors d’une modification destinée à être publiée, actualiser cette valeur dans les deux pages. Pas de génération automatique d’empreintes ni de compilation.

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
