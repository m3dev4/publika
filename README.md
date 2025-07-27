npm install

# 🟣 Publika

<p align="center">
  <img src="public/globe.svg" alt="Publika Logo" width="120" />
</p>

<p align="center">
  <b>Plateforme libre de services et de talents</b><br>
  <i>Publiez vos besoins, proposez vos services, et connectez-vous avec des talents locaux ou freelances.</i>
</p>

<p align="center">
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-14+-black?logo=next.js" /></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/TailwindCSS-3+-06B6D4?logo=tailwindcss" /></a>
  <a href="https://supabase.com/" target="_blank"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" /></a>
  <a href="https://authjs.dev/" target="_blank"><img src="https://img.shields.io/badge/Auth.js-OAuth-4F46E5?logo=auth0" /></a>
  <a href="https://resend.com/" target="_blank"><img src="https://img.shields.io/badge/Resend-Emails-FF6F61?logo=gmail" /></a>
</p>

---

## 📑 Table des matières

- [Présentation](#présentation)
- [Objectifs](#objectifs)
- [Stack Technique](#stack-technique)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
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

- **Frontend** : [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Auth** : [Better Auth](https://authjs.dev/) + OAuth (Google, GitHub, LinkedIn)
- **Email** : [Resend](https://resend.com/) pour l'envoi de mails transactionnels
- **Database** : [Supabase](https://supabase.com/) (PostgreSQL) avec [Prisma](https://www.prisma.io/)
- **Map** : [React Leaflet](https://react-leaflet.js.org/) pour l'affichage des annonces géolocalisées
- **Animation** : [Framer Motion](https://www.framer.com/motion/) / [GSAP](https://greensock.com/gsap/)

---

## Fonctionnalités

<details>
<summary>🔐 Authentification</summary>

- Inscription / Connexion (email/password + OAuth)
- Vérification email
- Récupération mot de passe
- Sécurité renforcée : <b>2 sessions actives max par utilisateur</b>
</details>

<details>
<summary>👤 Onboarding utilisateur</summary>

- Renseignement du profil (prénom, nom, ville, avatar)
- Choix du rôle : <code>Annonciateur</code>, <code>Talent</code>, ou les deux
- Si Talent ➜ choix des services proposés
</details>

<details>
<summary>📢 Annonces</summary>

- Publier un besoin ou un service
- Ajouter une description, un budget, une localisation, des tags
- Affichage sur une carte interactive
</details>

<details>
<summary>💬 Enchères & Propositions</summary>

- Répondre à un besoin avec une proposition tarifée
- L’auteur du besoin peut consulter les offres reçues
- Sélectionner un talent gagnant
</details>

<details>
<summary>📍 Carte interactive</summary>

- Affiche toutes les annonces en temps réel
- Filtrage par zone, type d’annonce, catégorie
- Navigation intuitive mobile + desktop
</details>

<details>
<summary>🔎 Recherche & Matching</summary>

- Système de filtre et moteur de recherche puissant
- Découverte de profils talentueux
- Page publique de chaque utilisateur (mini portfolio)
</details>

---

## Installation

1. **Cloner le repo**

   ```bash
   git clone https://github.com/tonuser/publika.git
   cd publika
   pnpm install
   ```

2. **Configurer l'environnement**

   Créez un fichier <code>.env</code> à la racine :

   ```env
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   RESEND_API_KEY=...
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Lancer le serveur de développement**

   ```bash
   pnpm run dev
   ```

---

## Crédits

Développé par Mouhamed Lo <br>
Made with ❤️ in Sénégal 🇸🇳