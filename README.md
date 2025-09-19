# CampusWA Admin Hub

Hub d'administration pour la gestion des universités et amphithéâtres - CampusWA

## 🚀 Fonctionnalités

- **Gestion des Universités** : Créer, modifier et gérer les établissements d'enseignement supérieur
- **Gestion des Amphithéâtres** : Administration complète des espaces d'enseignement
- **Système de Notifications** : Notifications en temps réel avec gestion des états
- **Interface Moderne** : Design responsive avec thème éducatif et gradients modernes
- **Architecture Modulaire** : Code organisé et maintenable avec TypeScript

## 🛠️ Technologies Utilisées

- **Frontend** : React 18, TypeScript, Vite
- **UI/UX** : Tailwind CSS, shadcn/ui, Lucide React
- **État** : React Query, React Hook Form
- **Routing** : React Router DOM
- **Notifications** : Sonner
- **Containerisation** : Docker, Docker Compose
- **Base de données** : PostgreSQL (prêt pour l'intégration)
- **Cache** : Redis (prêt pour l'intégration)

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

### Production avec Docker

```bash
# Construire et démarrer en production
npm run docker:prod

# Ou directement avec docker-compose
docker-compose up --build -d
```

### Commandes Docker utiles

```bash
# Construire l'image
npm run docker:build

# Arrêter les conteneurs
npm run docker:stop

# Voir les logs
npm run docker:logs

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
- Upload d'images

### Gestion des Amphithéâtres
- CRUD complet des amphithéâtres
- Association avec les universités
- Gestion des équipements
- Statuts multiples (actif/maintenance/brouillon)

### Système de Notifications
- Notifications en temps réel
- Types multiples (info, succès, avertissement, erreur)
- Gestion des états (lu/non lu)
- Interface dropdown intuitive
- Compteur de notifications non lues

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# Database (pour Docker)
POSTGRES_DB=campuswa
POSTGRES_USER=campuswa_user
POSTGRES_PASSWORD=campuswa_password

# Redis (pour Docker)
REDIS_URL=redis://localhost:6379
```

### Configuration Docker

Le projet inclut plusieurs configurations Docker :

- `Dockerfile` : Image de production avec Nginx
- `Dockerfile.dev` : Image de développement
- `docker-compose.yml` : Stack complète de production
- `docker-compose.dev.yml` : Stack de développement
- `nginx.conf` : Configuration Nginx optimisée

## 🚀 Déploiement

### Déploiement avec Docker

1. **Production** :
   ```bash
   docker-compose up --build -d
   ```

2. **Avec base de données** :
   ```bash
   # La stack complète inclut PostgreSQL et Redis
   docker-compose up -d
   ```

### Déploiement manuel

1. **Build** :
   ```bash
   npm run build
   ```

2. **Servir les fichiers statiques** avec Nginx, Apache, ou un CDN

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run preview          # Prévisualisation du build
npm run lint             # Linting du code

# Docker
npm run docker:build     # Construire l'image Docker
npm run docker:run       # Lancer le conteneur
npm run docker:dev       # Environnement de développement
npm run docker:prod      # Environnement de production
npm run docker:stop      # Arrêter les conteneurs
npm run docker:logs      # Voir les logs
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

- [ ] Intégration API backend
- [ ] Authentification et autorisation
- [ ] Gestion des utilisateurs
- [ ] Système de réservation
- [ ] Rapports et analytics
- [ ] Mode sombre
- [ ] Internationalisation (i18n)
- [ ] Tests automatisés
- [ ] CI/CD Pipeline

---

**CampusWA Team** - Révolutionner la gestion éducative 🎓