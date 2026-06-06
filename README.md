# Chirimoya Web Client

Clinical nutrition management UI for the **Chirimoya patient-service** REST API.

Built with **Svelte 5 + SvelteKit + Tailwind CSS v4** — dark clinical aesthetic with glassmorphism, animated micro-interactions, and real-time data.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start the dev server
npm run dev
```

Make sure the `patient-service` API is running at `http://localhost:8000` (or update `VITE_API_BASE_URL` in `.env`).

---

## 📡 API Configuration

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🗂️ Pages

| Route | Description |
|---|---|
| `/` | Dashboard — KPI cards, recent patients, API health |
| `/patients` | Patient search & list with filters and pagination |
| `/patients/new` | Create new patient (4-step form) |
| `/patients/[id]` | Patient profile — Overview, Medical, Emergency, Measurements |
| `/patients/[id]/measurements` | Full measurement history + BMI gauge + calorie tables |
| `/health` | API health status with auto-polling |

---

## 🎨 Design System

- **Background:** `#2C3531` (Deep Seed Charcoal)
- **Cards:** `#35403B` (Muted Dark Sage)
- **Accent:** `#D4E79E` (Vibrant Lime Pop)
- **Text:** `#FDFBF7` (Custard Cream)
- **Font:** Macondo (interface) + JetBrains Mono (clinical values)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Svelte 5 + SvelteKit |
| Styling | Tailwind CSS v4 |
| Icons | @lucide/svelte |
| Charts | chart.js + svelte-chartjs |
| Dates | date-fns |
| HTTP | Native fetch wrapper (`src/lib/api.ts`) |

---

## 📦 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build production bundle
npm run check     # Type check (svelte-check)
npm run lint      # Lint + format check
npm run format    # Auto-format with Prettier
```
