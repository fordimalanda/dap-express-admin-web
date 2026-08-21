# 🏛️ Dap-Express Admin Web & API

Ce répertoire regroupe le cerveau central de l'écosystème Dap-Express :
- `apps/api/` : API Backend REST propulsée par **NestJS**, **Prisma ORM**, **PostgreSQL**, **Auth JWT** et intégration **Cloudflare R2 (S3 SDK)**.
- `apps/web/` : Tableau de bord d'administration Web propulsé par **Next.js (App Router)**, **Tailwind CSS**, **Recharts** et **Lucide Icons**.

## 📁 Architecture des Applications

```
dap-express-admin-web/
├── apps/
│   ├── api/    # Backend NestJS (Port 3001)
│   └── web/    # Dashboard Admin Web (Port 3002)
└── README.md
```

## 🚀 Démarrage Rapide

### 1. Backend API (`apps/api`)
```bash
cd apps/api
cp .env.example .env
npm install
npx prisma generate
# npx prisma migrate dev --name init
npm run start:dev
```

### 2. Dashboard Web Admin (`apps/web`)
```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```
