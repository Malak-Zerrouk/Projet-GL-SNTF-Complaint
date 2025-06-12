# SNTF Complaint Management System

Un système complet de gestion des réclamations pour les voyageurs de la SNTF (Société Nationale des Transports Ferroviaires) en Algérie.

## 🚀 Fonctionnalités

### Pour les Voyageurs
- ✅ Création de compte et authentification
- ✅ Soumission de réclamations avec pièces jointes
- ✅ Suivi en temps réel du statut des réclamations
- ✅ Historique complet des réclamations
- ✅ Notifications sur les mises à jour de statut
- ✅ Interface responsive pour mobile et desktop

### Pour les Agents
- ✅ Authentification sécurisée
- ✅ Vue d'ensemble des réclamations avec filtres avancés
- ✅ Gestion des statuts des réclamations
- ✅ Tableau de bord analytique avec graphiques interactifs
- ✅ Prédictions ML pour anticiper le volume de réclamations
- ✅ Historique détaillé des modifications

## 🛠 Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **Recharts** pour les graphiques et visualisations
- **React Hook Form** pour la gestion des formulaires
- **React Hot Toast** pour les notifications
- **Lucide React** pour les icônes
- **date-fns** pour la gestion des dates

### Backend (Structure fournie)
- **Node.js** avec Express
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **Bcrypt** pour le hachage des mots de passe

### Tests
- **Jest** pour les tests unitaires
- **Cypress** pour les tests e2e
- **React Testing Library** pour les tests de composants

## 🏗 Structure du Projet

```
src/
├── components/
│   ├── Auth/                 # Composants d'authentification
│   ├── Dashboard/           # Tableaux de bord
│   ├── Complaints/          # Gestion des réclamations
│   └── Layout/              # Composants de mise en page
├── contexts/                # Contextes React
├── hooks/                   # Hooks personnalisés
├── types/                   # Définitions TypeScript
└── utils/                   # Utilitaires
```

## 🚦 Installation et Lancement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le dépôt
git clone [repository-url]

# Installer les dépendances
npm install

# Lancer l'application en développement
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Lancement en mode développement
npm run build        # Build de production
npm run preview      # Aperçu du build de production
npm run lint         # Vérification du code
npm run test         # Lancement des tests unitaires
npm run test:watch   # Tests en mode watch
npm run cypress:open # Interface Cypress pour les tests e2e
npm run cypress:run  # Exécution des tests Cypress en headless
```

## 🔐 Comptes de Démonstration

### Voyageur
- **Email**: voyageur@example.com
- **Mot de passe**: password123

### Agent
- **Email**: agent@example.com
- **Mot de passe**: password123

## 📊 Fonctionnalités Avancées

### Tableau de Bord Agent
- Statistiques en temps réel
- Graphiques de répartition par statut et catégorie
- Analyse des réclamations par gare
- Prédictions ML basées sur l'historique
- Filtres avancés pour la recherche

### Système de Statut
1. **Soumise** - Réclamation créée par le voyageur
2. **Acceptée** - Prise en compte par un agent
3. **Rejetée** - Non recevable
4. **En cours** - Traitement en cours
5. **Traitée** - Réclamation résolue

### Catégories de Réclamations
- Retards
- Problèmes de paiement
- Problèmes techniques
- Sécurité
- Propreté
- Comportement du personnel
- Autres

## 🧪 Tests

### Tests Unitaires
```bash
npm run test
```

Les tests couvrent :
- Authentification
- Création de réclamations
- Mise à jour des statuts
- Validation des formulaires

### Tests E2E
```bash
npm run cypress:open
```

Test fonctionnel complet :
- Parcours voyageur (inscription → réclamation → suivi)
- Parcours agent (connexion → traitement → résolution)

## 🔮 Prédictions ML

Le système intègre un modèle de prédiction basique pour anticiper :
- Volume de réclamations par jour/semaine
- Tendances par catégorie
- Charge de travail prévisionnelle

*Note : Les données de prédiction sont actuellement simulées. L'intégration d'un vrai modèle ML nécessiterait un service backend dédié.*

## 🎨 Design System

### Couleurs Principales
- **Bleu SNTF**: #1e40af (primary)
- **Vert Succès**: #059669
- **Orange Attention**: #d97706
- **Rouge Erreur**: #dc2626

### Responsive Design
- **Mobile**: < 768px
- **Tablette**: 768px - 1024px
- **Desktop**: > 1024px

## 📝 API Documentation

### Endpoints Principaux

#### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `POST /auth/logout` - Déconnexion

#### Réclamations
- `GET /complaints` - Liste des réclamations
- `POST /complaints` - Créer une réclamation
- `GET /complaints/:id` - Détails d'une réclamation
- `PUT /complaints/:id/status` - Mettre à jour le statut

#### Dashboard
- `GET /dashboard/stats` - Statistiques générales
- `GET /dashboard/predictions` - Prédictions ML

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🏢 À Propos

Ce système a été développé pour moderniser la gestion des réclamations voyageurs de la SNTF, en offrant une interface intuitive et des outils d'analyse avancés pour améliorer la qualité de service.

---

**Développé avec ❤️ pour la SNTF et ses voyageurs**