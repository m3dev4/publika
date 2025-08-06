# 🟣 Publika

<p align="center">
  <img src="public/globe.svg" alt="Publika Logo" width="120" />
</p>

<p align="center">
  <b>Plateforme libre de services et de talents</b><br>
  <i>Publiez vos besoins, proposez vos services, et connectez-vous avec des talents locaux ou freelances.</i>
</p>

<p align="center">
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-15.4.4-black?logo=next.js" /></a>
  <a href="https://reactjs.org/" target="_blank"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" /></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/TailwindCSS-4+-06B6D4?logo=tailwindcss" /></a>
  <a href="https://supabase.com/" target="_blank"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" /></a>
  <a href="https://www.better-auth.com/" target="_blank"><img src="https://img.shields.io/badge/Better_Auth-Security-4F46E5" /></a>
  <a href="https://resend.com/" target="_blank"><img src="https://img.shields.io/badge/Resend-Emails-FF6F61?logo=gmail" /></a>
</p>

---

## 📑 Table des matières

- [Présentation](#présentation)
- [Objectifs](#objectifs)
- [Stack Technique](#stack-technique)
- [Architecture de Sécurité](#architecture-de-sécurité)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Scripts Utiles](#scripts-utiles)
- [Crédits](#crédits)

---

## Présentation

Publika est une application web innovante permettant à chacun de publier un <b>service</b> ou un <b>besoin</b>, et d’entrer en relation avec des <b>talents locaux ou freelances</b>. Elle intègre une carte interactive, un système d’enchères à la Upwork, une gestion fine des sessions et un onboarding intelligent.

---

## Objectifs

Créer une plateforme <b>ouverte à tous</b> – freelances, recruteurs, particuliers, entreprises – permettant :

- Proposer ou rechercher des services dans n’importe quel domaine
- Poster un projet et recevoir des propositions personnalisées
- Connecter les talents avec des opportunités locales ou internationales
- Valoriser les compétences locales, avec une expérience moderne et professionnelle

---

## Stack Technique

### Core Technologies
- **Frontend** : [Next.js 15.4.4](https://nextjs.org/) (App Router) + [React 19](https://reactjs.org/)
- **Styling** : [Tailwind CSS 4+](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **TypeScript** : Support complet avec validation stricte
- **State Management** : [Zustand](https://zustand-demo.pmnd.rs/) pour la gestion d'état globale

### Backend & Database
- **Database** : [Supabase](https://supabase.com/) (PostgreSQL) avec [Prisma ORM](https://www.prisma.io/)
- **Authentication** : [Better Auth](https://www.better-auth.com/) avec sessions sécurisées
- **Email** : [Resend](https://resend.com/) pour l'envoi de mails transactionnels
- **File Upload** : [Cloudinary](https://cloudinary.com/) pour la gestion des médias

### Security & Performance
- **Security Middleware** : Protection CSRF, rate limiting, validation d'entrée
- **Audit Logging** : Système de logs complet pour traçabilité
- **Role-Based Access Control (RBAC)** : Gestion des permissions granulaire
- **Session Management** : Limitation à 2 sessions actives par utilisateur

### Development Tools
- **Package Manager** : [pnpm](https://pnpm.io/) pour des installations rapides
- **Linting** : ESLint + Prettier pour la qualité du code
- **Animation** : [Framer Motion](https://www.framer.com/motion/) pour les animations fluides

---

## Architecture de Sécurité

### 🔐 Système d'Authentification Avancé
- **Better Auth** : Authentification moderne et sécurisée
- **Sessions limitées** : Maximum 2 sessions actives par utilisateur
- **Vérification email** : Obligatoire avant accès aux fonctionnalités
- **Reset de mot de passe** : Système sécurisé avec tokens temporaires

### 🛡️ Role-Based Access Control (RBAC)
- **Rôles utilisateur** : `USER` (défaut) et `ADMIN`
- **Protection des routes** : Middleware automatique pour les zones admin
- **Composants protégés** : `AdminProtection` pour l'interface utilisateur
- **Scripts d'administration** : Promotion d'utilisateurs en admin

### 🔍 Audit & Monitoring
- **Audit Logger** : Traçabilité complète des actions utilisateur
- **Security Middleware** : Protection contre les attaques courantes
- **Rate Limiting** : Protection contre le spam et les attaques DDoS
- **Validation d'entrée** : Sanitisation automatique des données

### 🚨 Sécurité des API
- **Endpoints sécurisés** : Validation des permissions sur chaque route
- **Headers de sécurité** : CSP, HSTS, X-Frame-Options automatiques
- **Protection CSRF** : Tokens anti-falsification de requête
- **Logging sécurisé** : Enregistrement des tentatives d'accès non autorisées

---

## Fonctionnalités

<details>
<summary>🔐 Authentification & Sécurité</summary>

- **Inscription/Connexion** : Email/password avec validation stricte
- **Vérification email** : Obligatoire avec tokens sécurisés
- **Reset mot de passe** : Système de tokens temporaires
- **Sessions limitées** : Maximum 2 sessions actives par utilisateur
- **RBAC** : Système de rôles USER/ADMIN avec permissions granulaires
- **Audit logging** : Traçabilité complète des actions utilisateur
- **Rate limiting** : Protection contre les attaques par déni de service
- **Security headers** : Protection automatique contre XSS, CSRF, clickjacking
</details>

<details>
<summary>👤 Onboarding & Profils</summary>

- **Profil complet** : Prénom, nom, ville, avatar avec upload Cloudinary
- **Choix de rôle** : `Annonciateur`, `Talent`, ou les deux
- **Services talents** : Sélection et gestion des catégories de services
- **Validation progressive** : Étapes guidées avec sauvegarde automatique
- **Vérification obligatoire** : Email vérifié requis pour l'onboarding
</details>

<details>
<summary>📢 Gestion des Annonces</summary>

- **Publication** : Besoins et services avec validation de contenu
- **Métadonnées riches** : Description, budget, localisation, tags
- **Catégorisation** : Système de catégories et tags hiérarchiques
- **Géolocalisation** : Affichage sur carte interactive
- **Modération** : Système de validation et filtrage automatique
</details>

<details>
<summary>💬 Système d'Enchères</summary>

- **Propositions tarifées** : Réponses aux besoins avec prix personnalisés
- **Gestion des offres** : Interface intuitive pour les annonceurs
- **Sélection de talents** : Processus de choix simplifié
- **Notifications** : Alertes en temps réel pour les nouvelles propositions
- **Historique** : Suivi complet des échanges et décisions
</details>

<details>
<summary>📍 Interface Géographique</summary>

- **Carte temps réel** : Affichage dynamique de toutes les annonces
- **Filtrage avancé** : Par zone, type, catégorie, budget
- **Responsive design** : Optimisé mobile et desktop
- **Clustering** : Regroupement intelligent des annonces proches
- **Géolocalisation** : Détection automatique de la position utilisateur
</details>

<details>
<summary>🔎 Recherche & Découverte</summary>

- **Moteur de recherche** : Algorithme intelligent avec filtres avancés
- **Matching automatique** : Suggestions basées sur les compétences et besoins
- **Profils publics** : Pages portfolio pour chaque talent
- **Recommandations** : IA pour proposer des collaborations pertinentes
- **Analytics** : Statistiques de performance pour les utilisateurs
</details>

---

## Installation

### Prérequis
- Node.js 18+ 
- pnpm (recommandé) ou npm
- PostgreSQL (via Supabase)
- Compte Cloudinary pour les uploads
- Compte Resend pour les emails

### 1. Cloner et installer

```bash
git clone https://github.com/tonuser/publika.git
cd publika
pnpm install
```

### 2. Configuration de l'environnement

Créez un fichier `.env` à la racine :

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Security
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configuration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# (Optionnel) Seeder les catégories
pnpm run seed:categories
```

### 4. Lancer le serveur de développement

```bash
pnpm run dev
```

L'application sera accessible sur `http://localhost:3000`

---

## Scripts Utiles

### Administration
```bash
# Promouvoir un utilisateur en admin
npx tsx scripts/promote-admin.ts <email>

# Lister tous les utilisateurs
npx tsx scripts/list-users.ts

# Test de sécurité synchrone
npx tsx scripts/test-security-sync.ts
```

### Développement
```bash
# Développement avec Turbopack
pnpm run dev

# Build de production
pnpm run build

# Linting et formatage
pnpm run lint
pnpm run format

# Seeder les catégories
pnpm run seed:categories
```

### Base de données
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Interface d'administration
npx prisma studio

# Reset de la base (développement uniquement)
npx prisma db reset
```

---

## Crédits

Développé par Mouhamed Lo <br>
Made with ❤️ in Sénégal 🇸🇳