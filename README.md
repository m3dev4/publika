# 🟣 Publika – Plateforme libre de services et de talents

**Publika** est une application web innovante qui permet à toute personne de publier un **service** ou un **besoin**, et d’entrer en relation avec des **talents locaux ou freelances**.  
L’application intègre une carte interactive, un système d’enchères à la Upwork, une gestion fine des sessions et un onboarding intelligent.

## 🎯 Objectif

Créer une plateforme **ouverte à tous** – freelances, recruteurs, particuliers, entreprises – permettant :

- De **proposer ou rechercher** des services dans n’importe quel domaine
- De **poster un projet** et recevoir des **propositions personnalisées**
- De **connecter les talents** avec des opportunités locales ou internationales
- De **valoriser les compétences locales**, avec une expérience moderne et professionnelle

---

## 🔧 Stack Technique

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Auth**: [Better Auth](https://authjs.dev/) + OAuth (Google, GitHub, LinkedIn)
- **Email**: [Resend](https://resend.com/) pour l'envoi de mails transactionnels
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL) avec [Prisma](https://www.prisma.io/)
- **Map**: [React Leaflet](https://react-leaflet.js.org/) pour l'affichage des annonces géolocalisées
- **Animation**: [Framer Motion](https://www.framer.com/motion/) / [GSAP](https://greensock.com/gsap/)

---

## 📦 Fonctionnalités principales

### 🔐 Authentification
- Inscription / Connexion (email/password + OAuth)
- Vérification email
- Récupération mot de passe
- Sécurité renforcée : **2 sessions actives max par utilisateur**

### 👤 Onboarding utilisateur
- Renseignement du profil (prénom, nom, ville, avatar)
- Choix du rôle : `Annonciateur`, `Talent`, ou les deux
- Si Talent ➜ choix des services proposés

### 📢 Annonces
- Publier un besoin ou un service
- Ajouter une description, un budget, une localisation, des tags
- Affichage sur une carte interactive

### 💬 Enchères & Propositions
- Un utilisateur peut répondre à un besoin avec une proposition tarifée
- L’auteur du besoin peut consulter les offres reçues
- Il peut ensuite **sélectionner un talent gagnant**

### 📍 Carte interactive
- Affiche toutes les annonces en temps réel
- Filtrage par zone, type d’annonce, catégorie
- Navigation intuitive mobile + desktop

### 🔎 Recherche & Matching
- Système de filtre et moteur de recherche puissant
- Découverte de profils talentueux
- Page publique de chaque utilisateur (mini portfolio)

---

## 🚀 Lancer le projet en local

### 1. Cloner le repo

```bash
git clone https://github.com/tonuser/publika.git
cd publika


npm install

````

Crée un fichier .env

 ```
 DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

 Lancer le dev server

 ```
 npm run dev
 ```


 🤝 Crédits
Développé par Mouhamed Lo <br>
Made with ❤️ in Sénégal 🇸🇳