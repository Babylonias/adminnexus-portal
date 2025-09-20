# CampusWA Admin Hub

Hub d'administration pour la gestion des universités et amphithéâtres - CampusWA

## 🚀 Fonctionnalités

- **Gestion des Universités** : Créer, modifier et gérer les établissements d'enseignement supérieur
- **Gestion des Amphithéâtres** : Administration complète des espaces d'enseignement
- **Localisation Avancée** : Sélection de localisation via Google Maps ou coordonnées GPS
- **Système de Notifications** : Interface déroulante avec gestion étendue des notifications
- **Interface Moderne** : Design responsive avec thème éducatif et gradients modernes
- **Architecture Modulaire** : Code organisé et maintenable avec TypeScript
- **Backend Laravel** : Intégration prête avec API Laravel existante

## 🛠️ Technologies Utilisées

- **Frontend** : React 18, TypeScript, Vite
- **UI/UX** : Tailwind CSS, shadcn/ui, Lucide React
- **État** : React Query, React Hook Form
- **Routing** : React Router DOM
- **Cartes** : Google Maps API, géolocalisation
- **Notifications** : Sonner
- **Backend** : API Laravel (externe)
- **Containerisation** : Docker, Docker Compose

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Docker et Docker Compose (optionnel)

### Installation locale

```bash
# Cloner le repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

## 🐳 Docker

### Développement avec Docker

```bash
# Démarrer l'environnement de développement
npm run docker:dev

# Ou directement avec docker-compose
docker-compose -f docker-compose.dev.yml up --build
```

L'application sera accessible sur `http://localhost:55555`

### Commandes Docker utiles

```bash
# Construire l'image
docker build -t campuswa-admin .

# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Nettoyer les conteneurs et volumes
docker-compose down -v
```

## 🏗️ Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base (shadcn/ui)
│   ├── layout/         # Composants de mise en page
│   ├── dashboard/      # Composants du dashboard
│   ├── universities/   # Composants des universités
│   ├── amphitheaters/  # Composants des amphithéâtres
│   ├── notifications/  # Système de notifications
│   └── shared/         # Composants partagés
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires et configurations
├── pages/              # Pages de l'application
└── types/              # Types TypeScript
```

## 🎨 Design System

Le projet utilise un système de design éducatif moderne avec :

- **Couleurs** : Palette bleue éducative avec accents violets
- **Gradients** : Dégradés modernes pour les éléments importants
- **Ombres** : Système d'ombres élégantes avec effets de lueur
- **Animations** : Transitions fluides et micro-interactions
- **Responsive** : Design adaptatif pour tous les écrans

## 📊 Fonctionnalités Principales

### Dashboard
- Vue d'ensemble avec statistiques
- Graphiques et métriques
- Activités récentes

### Gestion des Universités
- CRUD complet des universités
- Filtrage et recherche avancée
- Gestion des statuts (actif/brouillon)
- Localisation avec Google Maps ou coordonnées GPS
- Upload d'images

### Gestion des Amphithéâtres
- CRUD complet des amphithéâtres
- Association avec les universités
- Gestion des équipements
- Localisation précise (Google Maps + GPS)
- Statuts multiples (actif/maintenance/brouillon)

### Système de Notifications
- Interface déroulante avec liste étendue
- Types multiples (info, succès, avertissement, erreur)
- Gestion des états (lu/non lu)
- Compteur de notifications non lues
- Suppression individuelle des notifications

### Localisation Avancée
- **Google Maps** : Sélection interactive sur carte
- **Coordonnées GPS** : Saisie manuelle latitude/longitude
- **Géolocalisation** : Utilisation de la position actuelle
- **Géocodage inverse** : Conversion coordonnées ↔ adresse
- Interface utilisateur avec onglets pour choisir le mode

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# API Configuration - Backend Laravel
VITE_API_URL=http://localhost:8000/api
VITE_LARAVEL_BACKEND_URL=http://localhost:8000

# Google Maps API Key (optionnelle - peut être saisie dans l'interface)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Configuration Google Maps

L'application supporte Google Maps pour la sélection de localisation :

1. **Avec clé API** : Configurez `VITE_GOOGLE_MAPS_API_KEY` dans `.env`
2. **Sans clé API** : L'interface permet la saisie directe de la clé
3. **Mode alternatif** : Utilisation des coordonnées GPS manuellement

Pour obtenir une clé API Google Maps :
1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activez l'API Maps JavaScript
3. Créez une clé API et configurez les restrictions appropriées

### Configuration Docker

Le projet inclut une configuration Docker optimisée :

- `Dockerfile.dev` : Image de développement avec pnpm
- `docker-compose.dev.yml` : Stack de développement
- Port par défaut : `55555` (Docker) / `8080` (local)

## 🚀 Déploiement

### Déploiement avec Docker

```bash
# Environnement de développement
docker-compose -f docker-compose.dev.yml up --build -d
```

### Déploiement manuel

1. **Build** :
   ```bash
   npm run build
   ```

2. **Servir les fichiers statiques** avec Nginx, Apache, ou un CDN

### Intégration Backend Laravel

L'application est conçue pour s'intégrer avec un backend Laravel :

1. **API Endpoints** : Configurez `VITE_API_URL` vers votre API Laravel
2. **Authentication** : Compatible avec Laravel Sanctum/Passport
3. **CORS** : Assurez-vous que CORS est configuré sur Laravel
4. **Routes API** : L'app attend les endpoints standards REST

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement (port 8080)
npm run build            # Build de production
npm run preview          # Prévisualisation du build
npm run lint             # Linting du code

# Docker
docker-compose -f docker-compose.dev.yml up --build  # Développement (port 55555)
docker-compose down      # Arrêter les conteneurs
docker-compose logs -f   # Voir les logs en temps réel
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

1. Consulter la documentation
2. Vérifier les issues existantes
3. Créer une nouvelle issue si nécessaire

## 🔄 Roadmap

- [x] Interface CRUD pour universités et amphithéâtres
- [x] Système de notifications étendu et déroulable
- [x] Localisation avec Google Maps et coordonnées GPS
- [x] Design system moderne avec gradients
- [ ] Intégration complète API Laravel
- [ ] Authentification et autorisation
- [ ] Gestion des utilisateurs et rôles
- [ ] Système de réservation d'amphithéâtres
- [ ] Rapports et analytics avancés
- [ ] Mode sombre
- [ ] Internationalisation (i18n)
- [ ] Tests automatisés
- [ ] CI/CD Pipeline
- [ ] Upload et gestion d'images
- [ ] Notifications push en temps réel

---

**CampusWA Team** - Révolutionner la gestion éducative 🎓