# Notre Budget

Application de suivi de budget familial partagé (PWA).

## Stack

- **Frontend** : React + Vite + TypeScript + Tailwind CSS + React Router + React Query + Zustand + Recharts
- **Backend** : Node.js + Express + TypeScript + Prisma + PostgreSQL + JWT + Zod
- **Déploiement** : Render (un seul Web Service sert l'API et le build statique du frontend)

## Structure

```
/
├── backend/     API Express (routes, controllers, services, prisma)
├── frontend/    App React (pages, components, api, store)
└── render.yaml  Infra as code pour Render
```

## Développement local

### Prérequis

- Node.js 20+
- PostgreSQL (local ou distant)

### Backend

```bash
cd backend
cp .env.example .env   # renseigner DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend en dev (Vite) proxy les appels `/api` vers le backend (voir `frontend/vite.config.ts`).

## Déploiement Render

Voir `render.yaml`. Les variables `SEED_ADMIN_EMAIL` et `SEED_ADMIN_PASSWORD` doivent être saisies manuellement dans l'interface Render (non stockées dans le repo).

En production, le backend sert le build statique de `frontend/dist` et applique les migrations Prisma (`prisma migrate deploy`) au démarrage.

## Ordre de développement

1. Auth + modèle de données + seed
2. CRUD catégories/sous-catégories (admin)
3. CRUD dépenses/revenus ponctuels + dashboard mensuel
4. Récurrents + intégration dans le calcul
5. Écran analyses/graphiques
6. Gestion utilisateurs (admin)
7. PWA (manifest + service worker)
8. Polish UI/UX
