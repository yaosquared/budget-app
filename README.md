# Ledgr

### View Live Preview Here

Coming soon...

### Status

- Frontend: In Progress 🚧
- Backend: In Progress 🚧

### Description

A personal finance and productivity management application designed to help users track transactions, manage budgets, set financial goals, monitor attendance, and generate insightful reports — all in one place.

### Features

- Responsive Design: Fully responsive design that ensures optimal usability across various devices.
- Dashboard: Displays real-time financial metrics, budget progress tracking, and recent transactions using API-driven data.
- Transaction Management: Create, Read, Update, and Delete transaction records with ease.
- Budget Tracking: Set and monitor budgets to keep your spending in check.
- Goal Setting: Define and track financial goals to stay motivated and on target.
- Attendance Monitoring: Log and review attendance records directly within the app.
- Reports: Generate detailed reports for deeper insights into your financial activity.

### Tech Stack

- Framework: Vue 3 (Composition API)
- Language : TypeScript
- Build Tool: Vite
- Routing: Vue Router
- Data Fetching: TanStack Query (Vue Query) + Axios
- Icons: Iconify for Vue
- Styling: SASS (sass-embedded)

## Getting Started

### Pre-Requisites

- Node.js
- PostgreSQL
- pnpm (optional but preferred)

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Set Environment Variables

#### .env.development

```bash
VITE_ENV=development
VITE_APP_NAME=Ledgr
VITE_API_URL=<your_backend_domain_url>
```

#### .env.production

```bash
VITE_ENV=production
VITE_APP_NAME=Ledgr
VITE_API_URL=<your_backend_domain_url>
```

### Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

<div align="center">
  <sub>Built with ❤️ using Vue 3 + TypeScript + Vite</sub>
</div>
