# Crouzet — Crèmerie artisanale

Site statique réalisé à partir de `Site_Crouzet / Version_04` (Figma, cadre `65:230`). HTML, CSS et JavaScript natifs, sans dépendance à installer ni compilation. Images et polices stockées localement.

## Lancer en local

Avec Node.js installé, ouvrir un terminal dans ce dossier :

```sh
npm start
```

Ouvrir http://127.0.0.1:4173. Arrêter avec Ctrl+C. Il est aussi possible d’ouvrir directement `index.html` dans un navigateur.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub et y envoyer le contenu de ce dossier.
2. Dans les paramètres du dépôt, ouvrir Pages, choisir le déploiement depuis une branche, puis `main` et `/ (root)`.
3. Enregistrer et attendre que GitHub affiche l’adresse du site.

Tous les chemins sont relatifs : le site fonctionne aussi sous une adresse de type `utilisateur.github.io/crouzet/`. Le fichier `.nojekyll` permet de servir les fichiers statiques directement. Aucun secret ni service externe n’est requis. Le dépôt n’a pas été créé et le site n’a pas été publié automatiquement.

## Modifier le site

- `index.html` : textes, marchés, coordonnées et cartes de plateaux.
- `style.css` : couleurs, tailles, mise en page responsive et animations.
- `script.js` : sélection des plateaux au survol, au clic et au clavier.
- `assets/` : photos exactes exportées de Figma et polices.
- `server.mjs` : serveur de développement local uniquement.

Les commentaires Figma sont reproduits : les légendes des photos se déplient depuis l’arrière de l’image lorsque leur emplacement entre dans la zone visible au défilement, une seule fois par chargement ; au survol d’un plateau, sa photo devient nette et sa description se déplie vers le bas. Sur mobile, les cartes sont nettes et défilent horizontalement au toucher ; les informations restent accessibles. Les préférences de réduction du mouvement sont respectées.

Les six cartes de la maquette reprennent la même photographie. La seule fiche commerciale renseignée est « Le Plateau Terroir », 4 à 6 personnes, environ 700 g, à partir de 42 €. Cette fiche est réutilisée pour les six vues : remplacer les images et textes quand le catalogue définitif sera fourni.

Les commandes passent par téléphone ou courriel, comme dans la maquette. Le lien de l’adresse ouvre une recherche cartographique. Les textes et coordonnées ont été repris de Figma, sans vérification commerciale indépendante.

## Vérifications effectuées

Rendu ordinateur et mobile inspecté ; chargement des images et polices ; navigation des plateaux au clavier ; sélection par clic ; liens de contact ; absence de débordement à 390, 760, 1024 et 1440 px ; réduction des animations ; absence d’erreurs JavaScript et de ressources HTTP manquantes.

## Sources

- Maquette : https://www.figma.com/design/nmCJegZYehT8oqW1ipGjeQ/Site_Crouzet?node-id=65-230
- Photos : ressources fournies dans cette maquette.
- Gambetta : Fontshare / Indian Type Foundry, https://www.fontshare.com/fonts/gambetta
- Inter et Newsreader : Google Fonts, https://fonts.google.com

Les droits sur les photos restent ceux de leurs ayants droit. Les polices conservent leurs licences respectives.

## Interaction de la galerie
Le déplacement horizontal de la souris sur toute la section sélectionne les plateaux successivement, y compris dans les espaces vides. Une tolérance de 8 pixels aux frontières évite les oscillations. La navigation clavier et le défilement tactile sont conservés.

