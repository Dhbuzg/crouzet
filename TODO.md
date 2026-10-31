# Crouzet — suivi du nettoyage et de l’organisation

Date : 27 octobre 2026. Statut : réorganisation locale réalisée le 27 octobre 2026 ; contrôles et éléments en attente détaillés ci-dessous.

## Orientation retenue

Le rangement actuel convient à un petit site statique, mais les images sont mélangées dans assets et les styles cumulent plusieurs générations de corrections. Le problème principal est cette accumulation, pas le nombre de dossiers.

Les maquettes ordinateur et mobile représentent **un seul site responsive** : conserver un HTML commun, des styles partagés et des adaptations par largeur. Ne pas créer deux copies du site ni des dossiers mobile/ordinateur contenant chacun leurs pages. Les variantes de photos restent sélectionnées avec picture/srcset.

Cette structure est une recommandation adaptée à Crouzet, pas une norme imposée par les sources. Garder HTML, CSS et JavaScript natifs, sans ajouter de framework ni de compilation pour ce seul rangement.

## Arborescence cible

```text
crouzet/
├── index.html
├── 404.html
├── favicon.png
├── CNAME
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── .gitignore
├── .gitattributes
├── package.json
├── server.mjs
├── README.md
├── TODO.md
├── documentation/
│   └── referencement.md
└── assets/
    ├── css/
    │   ├── site.css
    │   └── 404.css
    ├── js/
    │   └── site.js
    ├── fonts/
    ├── images/
    │   ├── histoire-desktop-460.webp
    │   ├── histoire-desktop-920.webp
    │   ├── histoire-mobile-400.webp
    │   ├── histoire-mobile-560.webp
    │   ├── histoire-mobile-1080.webp
    │   ├── contact-desktop-440.webp
    │   ├── contact-desktop-880.webp
    │   ├── contact-mobile-330.webp
    │   ├── contact-mobile-660.webp
    │   └── preview-crouzet.png
    └── illustrations/
        ├── corbeau-renard.svg
        ├── corbeau.svg
        ├── renard.svg
        ├── fromage.svg
        └── cursor.svg
```

Pas de dossier par version Figma. Git conserve l’historique ; les sauvegardes telles que old restent hors du dossier publié. documentation est destiné aux notes, et non à la source de publication /docs de GitHub Pages. Les fichiers de documentation peuvent être accessibles publiquement avec une publication depuis la racine : n’y mettre aucune donnée confidentielle.

## 1. Établir une référence avant modifications

- [x] Relever l’état Git et préserver tout changement existant.
- [x] Capturer le rendu actuel ordinateur, mobile et 404, aux dimensions de référence des maquettes.
- [x] Inventorier les références dans HTML, CSS, JavaScript, métadonnées et données structurées, y compris les masques SVG et curseurs intégrés.
- [ ] Confirmer la source de publication GitHub Pages avant tout changement de configuration. Conserver la publication actuelle pour ce nettoyage.

## 2. Supprimer les éléments inutilisés

Candidats identifiés lors de l’audit ; refaire le contrôle des références au moment de supprimer.

- [x] Supprimer les 9 images assets/plateau-{essentiel,heritage,exception}-{400,640,1080}.webp : rubrique retirée.
- [x] Supprimer assets/contact-400.webp, contact-640.webp et contact-1080.webp : remplacées par les variantes actuelles.
- [x] Supprimer assets/fonts/inter-variable.woff2 si aucune référence active n’est apparue.
- [x] Conserver les tailles d’images utilisées par srcset et toutes les polices actives.
- [x] Unifier les favicons identiques : garder favicon.png à la racine, corriger les références puis retirer assets/favicon.png.
- [x] Supprimer state seulement s’il est toujours vide et sans usage.
- [x] Retirer les styles des anciens plateaux, légendes et variantes de texte absentes du HTML.
- [x] Vérifier les filtres SVG de la 404 : retirer uniquement ceux sans usage ; préserver tout effet encore visible.

Les 12 anciennes photos et la police représentent environ 1 Mo. Ne pas supprimer cursor.svg avant d’avoir remplacé ses copies intégrées.

## 3. Ranger et nommer les fichiers

- [x] Déplacer les styles dans assets/css et le JavaScript dans assets/js.
- [x] Déplacer les photos et l’aperçu dans assets/images, les illustrations dans assets/illustrations.
- [x] Renommer histoire-v17-* en histoire-mobile-* : nommer selon le rôle, pas selon une ancienne version Figma.
- [x] Donner aux polices google-0…4 des noms indiquant leur famille, style et graisse après vérification.
- [x] Déplacer REFERENCEMENT.md vers documentation/referencement.md.
- [x] Mettre à jour tous les chemins, notamment les url() CSS désormais relatifs à assets/css.
- [x] Mettre à jour les URL absolues de l’aperçu social et des données structurées. Prévoir leur cache lors de la publication.
- [x] Conserver les fichiers d’entrée et de publication à la racine ; ne pas créer src/dist sans besoin de compilation.

## 4. Simplifier les styles sans changer le design

- [x] Consolider style.css et layout.css dans site.css ; supprimer ensuite les anciens fichiers et leurs références.
- [x] Organiser site.css : polices, variables, bases, navigation, accueil, histoire, marchés, contact, pied de page, curseur, adaptations responsive.
- [x] Regrouper les adaptations d’un même élément et les points de rupture identiques ; supprimer les règles écrasées par d’autres règles.
- [x] Réduire les !important en clarifiant l’ordre et la spécificité des sélecteurs.
- [x] Centraliser palette, épaisseur de ligne, espacement des titres, dimensions de référence et hauteur du menu.
- [x] Conserver les séparateurs et soulignages déclarés à 1 px, sans recalage à chaque défilement.
- [x] Préserver la géométrie des maquettes et la mise à l’échelle ; éviter une réécriture globale du positionnement pendant le rangement.
- [x] Garder 404.css séparé pour les seules particularités de la page 404.
- [x] Garder une source identifiable pour chaque illustration ; éviter des copies divergentes des SVG dans le CSS.
- [x] Centraliser le dessin du curseur dans cursor.svg et contrôler le comportement local file:// avant de retirer les formes intégrées : les ressources SVG externes peuvent se comporter différemment selon le navigateur.

## 5. Clarifier HTML et JavaScript

- [x] Réindenter le HTML et séparer les éléments longs pour faciliter les modifications.
- [x] Garder un seul contenu par rubrique, commun aux deux formats ; réserver les différences aux styles, images et sauts de ligne réellement nécessaires.
- [x] Structurer site.js en fonctions courtes : largeur utile, navigation, curseur, comportement tactile.
- [x] Conserver les animations, leur interruption, la réduction du mouvement et le focus clavier.
- [x] Éviter les accès fragiles à des éléments supposés présents ; ne charger le script du site que sur les pages concernées.
- [x] Retirer les commentaires historiques et conserver les explications utiles aux choix non évidents.
- [x] Remplacer les mécanismes de cache manuels dispersés par une méthode cohérente et documentée, sans ajouter une compilation uniquement pour cela.

## 6. Actualiser la documentation

- [x] Réécrire README.md : lancement local, arborescence, endroits à modifier, maquettes de référence et vérifications.
- [x] Retirer les anciennes descriptions de plateaux, tarifs et animations supprimées.
- [x] Garder les informations utiles de référencement dans un seul document dédié.
- [x] Documenter les points de rupture et les images ordinateur/mobile.
- [x] Conserver ce TODO comme suivi : cocher uniquement les actions réalisées et vérifiées.

## 7. Points fonctionnels à traiter séparément du rangement

- [x] Ajuster l’arrivée sur Contact à la hauteur du menu pour masquer le bas du renard, puis comparer à Figma. Ce changement a été diagnostiqué mais n’est pas encore appliqué.
- [x] Mentions légales : maintenir le libellé inactif tant que la page et son contenu ne sont pas fournis. Ne pas inventer de page.
- [ ] Vérifier la cohérence de la page 404 avec l’accueil après les déplacements récents de l’accueil ; toute différence de design doit être validée séparément.

## 8. Validation avant clôture

- [x] Exécuter npm run check en adaptant les chemins renommés ; vérifier le diff et les ressources locales manquantes.
- [ ] Contrôler Firefox et Chromium : ordinateur, mobile, passage entre formats, menu fixe, ancres et bouton retour.
- [ ] Vérifier 320, 390, 430, 760, 1024, 1440 et 1920 px, ainsi que plusieurs hauteurs et niveaux de zoom.
- [x] Contrôler les titres, espacements, images, séparateurs pendant le défilement et absence de débordement horizontal.
- [x] Contrôler les liens : soulignage permanent sur mobile, au survol sur ordinateur, épaisseur de 1 px.
- [x] Vérifier le curseur, sa rotation dans le quart inférieur de l’accueil et son absence sur un appareil tactile.
- [x] Vérifier navigation clavier, focus visible, réduction des animations et liens mail/téléphone.
- [x] Tester 404.html et une URL inexistante : ressources chargées, retour à l’accueil, absence de défilement et statut HTTP 404 via serveur.
- [x] Tester via le serveur local et par ouverture directe des fichiers HTML.
- [x] Vérifier canonical, robots, sitemap, aperçu social et absence de tarifs fictifs.
- [x] Comparer aux captures de référence et noter toute différence restante.
- [ ] Après accord de publication seulement : publier et vérifier les chemins sur GitHub Pages.

## Références consultées

Consultées le 27 octobre 2026. Elles expliquent les principes ; l’arborescence ci-dessus est adaptée à la petite taille du projet.

- [MDN — Dealing with files](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Dealing_with_files) : regrouper les ressources par rôle, adopter des noms simples et gérer correctement les chemins.
- [MDN — Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) : adapter une même page aux différents formats grâce aux mises en page souples et media queries.
- [GitHub — Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) : publication depuis une branche, à la racine ou dans /docs, ou par un workflow.
- [GitHub — Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) : placer la page d’entrée en tête de la source publiée et conserver .nojekyll pour le site statique.

## Bilan de cette intervention — 27 octobre 2026

- Rangement effectué selon l’arborescence ci-dessus, sans nouvelle dépendance. Les anciennes versions restent dans Git et le dossier old voisin n’a pas été touché.
- 12 photos obsolètes, une police inutilisée, le favicon en double et state vide supprimés. Environ 1 Mo de ressources inutilisées retirées.
- site.css remplace style.css et layout.css : styles des plateaux, anciennes légendes et corrections écrasées retirés ; une section mobile commune. Les SVG des fichiers sont maintenant réellement utilisés, sans copies encodées dans les styles. Le filtre de texture actif de la 404 reste conservé.
- Polices renommées par famille, style et graisse. Photos recadrées et variantes responsive conservées sans recompression.
- Position d’arrivée des ancres ordinateur alignée sur le menu de 75 px : le bas du renard est masqué lors de l’arrivée sur Contact.
- Captures avant/après et contrôles détaillés conservés hors du dépôt, dans le dossier temporaire crouzet-cleanup. Les positions des blocs, photos et textes ont été comparées aux références. Le passage des masques aux images SVG produit de légères différences de rastérisation des contours, sans changement des chemins ni des emplacements.
- Chromium : contrôles à 320, 390, 430, 760, 1024, 1440 et 1920 px, plusieurs hauteurs, aucun débordement horizontal ou échec de chargement observé. Curseur vert chargé en file://, rotation et clic vers Histoire vérifiés. Liens et soulignages, retour navigateur, focus clavier, réduction du mouvement et mode tactile vérifiés.
- Firefox : rendu ordinateur vérifié avec le navigateur automatisé disponible. Son ancienne version ne prend pas en charge la commande de redimensionnement du pilote actuel ; le contrôle mobile Firefox et la matrice de zoom réel restent à refaire dans Firefox utilisateur. La case générale correspondante reste ouverte.
- 404 vérifiée à 390 et 1440 px : ressources chargées, aucun défilement, statut HTTP 404 sur URL inexistante. Ouverture directe des deux HTML vérifiée. JSON-LD analysé, chemins locaux contrôlés, syntaxe JavaScript et diff sans erreur.
- La configuration distante Pages n’a pas été modifiée ni confirmée depuis un compte GitHub. Aucun commit, push ou déploiement n’a été réalisé.
- Restent hors de ce nettoyage : nouveau design éventuel de la 404, création de la page Mentions légales et validation après publication.

### Ajustement mobile suivant

- [x] Photos Histoire et Contact alignées à 10 px des bords, largeur 180 px et hauteur 225 px sur la référence de 390 px.
- [x] Contact : texte remonté, numéro sur une ligne dédiée et illustration remontée. Ajustement fondé sur les captures fournies ; lecture directe Figma indisponible (quota).

- [x] Favicon PNG 192 × 192 confirmé identique en local et sur le domaine public ; référence versionnée dans les deux pages pour invalider les anciennes copies en cache. À actualiser après remplacement du fichier.

### Page Mentions légales — PDF Version_02

- [x] Page mentions-legales.html intégrée, avec les positions et textes du PDF 1440 × 900.
- [x] Lien du pied de page activé et sitemap actualisé.
- [x] Présentation en une colonne lisible sur petit écran, en attendant une éventuelle maquette mobile dédiée.
- [ ] Préciser les durées de conservation et finaliser les formulations provisoires du PDF relatives aux traitements et traceurs. Le contenu fourni est conservé sans validation juridique.

Cette intégration remplace les anciennes mentions du libellé légal inactif dans le bilan précédent.

### Mentions légales — mise en page Version_04

- [x] Une colonne, marges latérales de 50 px à 1440 px, titre principal 70 px, titres de rubrique 40 px, corps 20 px / interligne 30 px.
- [x] Positions et espacements repris du PDF 1440 × 2249, avec les emphases actualisées.

### Maquettes Figma du 31 octobre 2026

- [x] Ordinateur Version_23 : corbeau sans fromage, renard redimensionné et replacé, coordonnées des blocs, photos, textes et titres actualisées.
- [x] Mobile Version_04 : Histoire avec photo à droite, Contact avec photo à gauche, illustrations et textes replacés sur la référence 390 × 1720.
- [x] Mentions légales Version_08 : ordre des rubriques, largeurs de texte, graisses, séparateur et espacements repris sur la référence 1440 × 3132.
- [x] Contrôle dans le navigateur intégré : coordonnées aux largeurs utiles de 1440 et 390 px, navigation, chargement des images et absence de débordement horizontal à plusieurs largeurs.
- [x] Vérification de syntaxe et du diff local.
- [ ] Intégrer les mentions légales à la page principale avec ouverture du bas vers le haut. Cette interaction est volontairement reportée ; le fichier existant reste l’aperçu de travail.
- [ ] Refaire le contrôle visuel dans Firefox après ces modifications.

### Ajustement du cadrage — Version_23 révisée

- [x] Espacement ordinateur porté à 200 px entre les blocs, pied de page compris ; hauteur totale de référence : 4175 px.
- [x] Offset de navigation ordinateur porté à 150 px à l’échelle de référence, partagé par le défilement animé et les ancres natives. Les réglages mobiles restent inchangés.
- [x] Navigateur intégré, vue 1456 × 1100 : arrivée des trois rubriques à 150 px environ ; titre suivant hors champ pour Histoire et Marchés. Coordonnées des blocs confirmées : 1100, 2100 et 3100 px.

### Mentions légales — PDF Version_08 révisé

- [x] Numéro 00, titre et séparateur repositionnés ; rubriques et espacements repris du nouvel export 1440 × 3315.
- [x] Textes conservés ; ouverture animée dans la page principale toujours reportée.
- [x] Positions contrôlées dans le navigateur : rubriques à 355, 939, 1283, 1717, 2361 et 2885 px sur la référence ; aucun débordement horizontal à 320 px.
