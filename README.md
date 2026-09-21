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


## Optimisation PageSpeed (20 septembre 2026)

Rapport initial bureau : performance 76, LCP 6,3 s, environ 11 925 Kio transférés. Les photos PNG étaient la principale charge réseau.

- Images WebP de qualité 82, avec plusieurs résolutions et `srcset`/`sizes`. Les originaux PNG sont conservés pour les futures retouches mais ne sont plus chargés par la page.
- Photo principale prioritaire, décodage asynchrone, chargement différé des photos plus bas.
- Polices Inter et Newsreader converties en WOFF2 avec caractères latins étendus, ponctuation et monnaies (français inclus). Les TTF originaux sont conservés mais ne sont plus chargés.
- Déclarations de polices regroupées au début de `style.css` pour éviter une seconde requête CSS bloquante. `assets/fonts.css` reste une référence, non liée par la page. Préchargement de Gambetta Medium Italic et Inter Light.
- Aucun changement des règles de mise en page ni du JavaScript des animations.

Les durées de cache HTTP de GitHub Pages relèvent de cet hébergement. Ajouter un fichier `.htaccess` ou `_headers` ici ne les modifierait pas. Les réductions de poids diminuent toutefois fortement le coût des rechargements.

Pour mesurer le nouveau score PageSpeed, envoyer ces modifications sur GitHub, attendre le déploiement Pages puis relancer le rapport. Aucun nouveau score public n’a été mesuré avant publication.

## Référencement (22 septembre 2026)

Le titre, la description et les aperçus de partage ciblent les fromages et plateaux dans les Landes. Le logo et la date 2001 sont conservés. Les données structurées décrivent l’organisation, ses coordonnées et ses communes desservies, sans présenter l’adresse privée comme une boutique. Aucun horaire supplémentaire ni tarif n’est inventé. Le contenu visible, les styles et les animations sont inchangés.

- Publier aussi robots.txt et sitemap.xml à la racine du domaine cremeriecrouzet.fr. Le sitemap ne contient que la page canonique : les ancres des sections ne sont pas des pages distinctes.
- Après publication, vérifier le domaine dans Google Search Console, transmettre https://cremeriecrouzet.fr/sitemap.xml et demander une nouvelle indexation de la page d’accueil. Cette configuration nécessite l’accès au compte et, pour la propriété de domaine, au DNS.
- Configurer Google Business Profile selon l’activité réelle et son éligibilité, sans afficher l’adresse privée comme un magasin ouvert au public.
- Demander progressivement des mentions auprès des marchés, communes et partenaires locaux.
- Les prix affichés sont encore « ?€ » : les renseigner lorsque les tarifs définitifs sont disponibles (aucune modification faite dans cette intervention).

Si le domaine change, mettre à jour ensemble la canonical, les URL de partage, le JSON-LD, robots.txt et sitemap.xml. Aucun compte Google ni déploiement n’a été modifié par cette intervention.
