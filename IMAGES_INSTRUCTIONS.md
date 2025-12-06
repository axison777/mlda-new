# Instructions pour les images MDLA

## Images à remplacer dans le carrousel HeroCarousel

Les placeholders actuels doivent être remplacés par de vraies images professionnelles. Voici les spécifications pour chaque slide :

### Slide 1 - Formation & Langue Allemande
**Fichier :** `src/assets/hero-slide-1.jpg`
**Dimensions recommandées :** 1920x800px
**Description :** Étudiants africains jeunes et dynamiques dans un environnement d'apprentissage
**Ambiance :** Positive, motivante, inclusive
**Éléments suggérés :**
- Groupe d'étudiants africains souriants
- Possiblement avec des livres ou ordinateurs
- Ambiance classe ou bibliothèque moderne
- Peut inclure subtilement le drapeau allemand ou des éléments allemands

### Slide 2 - Ausbildung & Opportunités Professionnelles
**Fichier :** `src/assets/hero-slide-2.jpg`
**Dimensions recommandées :** 1920x800px
**Description :** Environnement professionnel, médical ou technique en Allemagne
**Ambiance :** Professionnelle, compétente, rassurante
**Éléments suggérés :**
- Personnel médical (infirmier/infirmière) ou techniciens au travail
- Environnement hospitalier moderne ou atelier technique
- Professionnels concentrés et compétents
- Peut montrer une personne africaine intégrée dans un environnement professionnel allemand

### Slide 3 - Import-Export & Véhicules
**Fichier :** `src/assets/hero-slide-3.jpg`
**Dimensions recommandées :** 1920x800px
**Description :** Logistique, commerce, véhicules allemands
**Ambiance :** Dynamique, commerce international, qualité allemande
**Éléments suggérés :**
- Véhicules allemands de qualité (Mercedes, BMW, Volkswagen, etc.)
- Environnement portuaire ou logistique
- Conteneurs, transport international
- Ambiance commerce et import/export

## Optimisation des images

Pour de meilleures performances :
- Format : JPEG ou WebP
- Compression : Qualité 80-85%
- Résolution : 1920x800px (ratio 2.4:1)
- Taille fichier : < 500KB par image

## Où placer les images

1. Créer le dossier `src/assets/` s'il n'existe pas
2. Placer les 3 images dans ce dossier
3. Modifier le fichier `src/components/HeroCarousel.tsx`
4. Remplacer les URLs placeholder par :
   - Slide 1 : `import Slide1 from '../assets/hero-slide-1.jpg'`
   - Slide 2 : `import Slide2 from '../assets/hero-slide-2.jpg'`
   - Slide 3 : `import Slide3 from '../assets/hero-slide-3.jpg'`

## Sources d'images gratuites recommandées

- [Pexels](https://www.pexels.com/) - Photos libres de droits
- [Unsplash](https://unsplash.com/) - Photos haute qualité
- [Pixabay](https://pixabay.com/) - Images et photos gratuites

Mots-clés de recherche suggérés :
- "African students learning"
- "Medical professional Germany"
- "German cars logistics"
- "International trade port"
