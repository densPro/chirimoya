# Chirimoya Patient Service — Frontend Agent Spec

Build a **Svelte 5 + Tailwind CSS v4** single-page application that serves as the
clinical management UI for the Chirimoya patient-service REST API.

---

## Stack

| Layer           | Technology                                      |
|----------------|-------------------------------------------------|
| Framework       | Svelte 5 (with SvelteKit for routing)           |
| Styling         | Tailwind CSS v4 (via `@tailwindcss/vite`)       |
| HTTP client     | Native `fetch` wrapped in a typed `api.ts` layer|
| State           | Svelte stores (`$state`, `$derived`, `$effect`) |
| Icons           | `lucide-svelte`                                 |
| Notifications   | Custom toast store (no extra lib)               |
| Charts          | `chart.js` + `svelte-chartjs`                   |
| Date formatting | `date-fns`                                      |
| Forms           | Plain Svelte reactive forms (no form lib)       |

---

## Design System & Aesthetic

# UI Design System: Chirimoya Nutrition App (Clinical Dark Mode)

This document specifies the design system rules, Tailwind CSS tokens, and component architecture for the nutritionist platform application.

---

## 🎨 Theme & Color Palette

The color strategy adapts natural Chirimoya tones into an ultra-clean, clinical high-contrast dark environment.

*   **App Background:** `#2C3531` (Deep Seed Charcoal)
    *   *Usage:* Global app background canvas.
*   **Card Background:** `#35403B` (Muted Dark Sage Canvas)
    *   *Usage:* Patient detail cards, calculator panels, meal logs.
*   **Accent Brand Color:** `#D4E79E` (Vibrant Lime Pop)
    *   *Usage:* Primary call-to-actions, focus states, interactive indicators.
*   **Primary Text:** `#FDFBF7` (Custard Cream)
    *   *Usage:* High-contrast readable copy, card titles, header navigation.

---

## 🔤 Typography & Hierarchy

*   **Primary Copy Font:** `Macondo` (via Google Fonts)
    *   *Usage:* Application interface text, labels, form headings, and standard inputs.
*   **Medical Values Font:** `font-mono` (System Monospace)
    *   *Usage:* All precision clinical measurements, laboratory metrics, macro counts, and tracking data (e.g., **BMI**, **Weight**, **Kcal**).
    *   *Color Pairing:* Always rendered in `#D4E79E` (Lime Pop) for tactical screen glanceability.

---

## 📐 Layout & Borders

*   **Cards Radius:** `rounded-xl` (12px / 0.75rem)
    *   *Usage:* Content containers, macro metric blocks, charts.
*   **Inputs Radius:** `rounded-lg` (8px / 0.5rem)
    *   *Usage:* Text fields, numerical inputs, buttons, filters.
*   **Glassmorphism Layering:** `bg-[#2C3531]/40 backdrop-blur-md border border-white/10`
    *   *Usage:* Fixed components like Sidebar and Top Navigation bar to retain UI depth.

---

## 📱 Responsiveness & Mobile Support

The clinical interface must be fully responsive to support clinical staff on both desktop and mobile platforms.

- **Mobile Navigation Menu**: On viewports smaller than desktop/laptop sizes, the sidebar layout must collapse and convert into a mobile-friendly slide-over menu or drawer toggled via a hamburger button.
- **Component Scaling**: All layouts, metrics cards, gauges, charts, tables, and multi-step forms (including Patient, Doctor, and Specialty forms) must automatically stack or adapt to fit perfectly inside smaller screens without breaking the design or requiring horizontal scrolling.
- **Touch-Friendly Controls**: Touch targets must be optimized, and modal dialogs must adjust to full screen or narrow widths on mobile devices.

---

## 🎬 Motion & Transitions

*   **Micro-Interactions:** `transition-all duration-200`
    *   *Usage:* Smooth hover states for button actions, interactive lists, and focused forms.
*   **Modals / Overlays:** Slide-In Entry Animation
    *   *Usage:* Triggered panel drawers (e.g., "Add New Meal Component").

---

## 🏷️ Semantic Status Badges

Pill-shaped identifiers (`px-2.5 py-0.5 rounded-full text-xs font-medium border`) used across patient listings:

| Status | Tailwind Configuration Class | Style Description |
| :--- | :--- | :--- |
| **Active** | `bg-[#96C499]/20 text-[#96C499] border-[#96C499]/30` | Chirimoya Sage Green tint |
| **Inactive** | `bg-white/5 text-[#FDFBF7]/50 border-white/10` | Muted Seed Outline |
| **Deceased** | `bg-red-500/20 text-red-300 border-red-500/30` | Clinical Alert Red |
---

## API Base URL

```
VITE_API_BASE_URL=http://localhost:8000
```

Configurable via `.env` file.  All requests go through a single `src/lib/api.ts` module.

---

## API Contracts (derived from patient-service)

### Enums

```ts
type Gender        = "male" | "female" | "non_binary" | "other" | "prefer_not_to_say" | "unknown"
type MaritalStatus = "single" | "married" | "divorced" | "widowed" | "separated" | "domestic_partner" | "unknown"
type BloodType     = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "unknown"
type PatientStatus = "active" | "inactive" | "deceased"
```

### Patient Endpoints

| Method  | Path                           | Description                   | Request Body           | Response                        |
|---------|--------------------------------|-------------------------------|------------------------|---------------------------------|
| `POST`  | `/api/v1/patients`             | Create patient                | `PatientCreateDTO`     | `PatientResponseDTO`            |
| `GET`   | `/api/v1/patients/{id}`        | Get patient by UUID           | —                      | `PatientResponseDTO`            |
| `GET`   | `/api/v1/patients/mrn/{mrn}`   | Get patient by MRN            | —                      | `PatientResponseDTO`            |
| `PATCH` | `/api/v1/patients/{id}`        | Partial update patient        | `PatientUpdateDTO`     | `PatientResponseDTO`            |
| `GET`   | `/api/v1/patients`             | Search / list patients        | Query params (below)   | `PaginatedPatientsResponseDTO`  |

**Search query params**: `first_name`, `last_name`, `date_of_birth` (YYYY-MM-DD), `mrn`,
`status` (PatientStatus), `limit` (1-100, default 20), `offset` (default 0).

### Body Measurement Endpoints

| Method | Path                                          | Description              | Request Body                 | Response                           |
|--------|-----------------------------------------------|--------------------------|------------------------------|------------------------------------|
| `POST` | `/api/v1/patients/{id}/measurements`          | Record measurement       | `BodyMeasurementCreateDTO`   | `BodyMeasurementResponseDTO`       |
| `GET`  | `/api/v1/patients/{id}/measurements/latest`   | Get latest measurement   | —                            | `BodyMeasurementResponseDTO`       |
| `GET`  | `/api/v1/patients/{id}/measurements`          | List all measurements    | `limit`, `offset` (query)    | `PaginatedMeasurementsResponseDTO` |

### Health

| Method | Path      | Response                        |
|--------|-----------|---------------------------------|
| `GET`  | `/health` | `{ status: "ok", version, ... }`|

---

## TypeScript Types

```ts
// src/lib/types.ts

export interface AddressDTO {
  street_line_1: string
  street_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string           // default "US"
}

export interface ContactInfoDTO {
  phone_number: string
  email?: string
  secondary_phone?: string
}

export interface EmergencyContactDTO {
  full_name: string
  relationship: string
  phone_number: string
  email?: string
}

export interface InsuranceInfoDTO {
  provider_name: string
  policy_number: string
  group_number?: string
  subscriber_name?: string
  subscriber_relationship?: string
  effective_date?: string
  expiration_date?: string
}

export interface PatientCreateDTO {
  first_name: string
  last_name: string
  date_of_birth: string      // ISO date "YYYY-MM-DD"
  gender: Gender
  marital_status?: MaritalStatus
  ssn_last_four?: string     // 4 digits
  national_id?: string
  blood_type?: BloodType
  allergies?: string[]
  chronic_conditions?: string[]
  contact_info: ContactInfoDTO
  address?: AddressDTO
  emergency_contact?: EmergencyContactDTO
  insurance_info?: InsuranceInfoDTO
  notes?: string
}

export type PatientUpdateDTO = Partial<PatientCreateDTO & { status: PatientStatus }>

export interface TDEEResponseDTO {
  sedentary?: number
  lightly_active?: number
  moderately_active?: number
  very_active?: number
}

export interface StressCaloriesDTO {
  sedentary?: number
  lightly_active?: number
  moderately_active?: number
  very_active?: number
}

export interface TotalCaloriesResponseDTO {
  major_surgery?: StressCaloriesDTO
  minor_surgery?: StressCaloriesDTO
  mild_infection?: StressCaloriesDTO
  moderate_infection?: StressCaloriesDTO
  severe_infection?: StressCaloriesDTO
  trauma_with_impaired_consciousness?: StressCaloriesDTO
  burns_40_tbsa?: StressCaloriesDTO
  burns_100_tbsa?: StressCaloriesDTO
  cancer?: StressCaloriesDTO
  malnutrition?: StressCaloriesDTO
  traumatic_brain_injury?: StressCaloriesDTO
}

export interface BodyMeasurementResponseDTO {
  id: string
  patient_id: string
  measured_at: string
  height_cm?: number
  height_m?: number
  weight_kg?: number
  waist_cm?: number
  hip_cm?: number
  bmi?: number
  bmi_category?: string
  healthy_weight?: number
  minimum_weight?: number
  maximum_weight?: number
  bmr_harris_benedict?: number
  bmr_mifflin_st_jeor?: number
  tdee_harris_benedict?: TDEEResponseDTO
  tdee_mifflin_st_jeor?: TDEEResponseDTO
  total_calories_harris_benedict?: TotalCaloriesResponseDTO
  total_calories_mifflin_st_jeor?: TotalCaloriesResponseDTO
  created_at: string
}

export interface BodyMeasurementCreateDTO {
  height_cm?: number
  weight_kg?: number
  waist_cm?: number
  hip_cm?: number
  measured_at?: string       // ISO datetime
}

export interface PatientResponseDTO {
  id: string
  mrn: string
  first_name: string
  last_name: string
  full_name: string
  date_of_birth: string
  gender: Gender
  marital_status: MaritalStatus
  ssn_last_four?: string
  national_id?: string
  age?: number
  latest_measurement?: BodyMeasurementResponseDTO
  blood_type: BloodType
  allergies: string[]
  chronic_conditions: string[]
  contact_info?: ContactInfoDTO
  address?: AddressDTO
  emergency_contact?: EmergencyContactDTO
  insurance_info?: InsuranceInfoDTO
  notes?: string
  status: PatientStatus
  created_at: string
  updated_at: string
}

export interface PaginatedPatientsResponseDTO {
  items: PatientResponseDTO[]
  total: number
  limit: number
  offset: number
}

export interface PaginatedMeasurementsResponseDTO {
  items: BodyMeasurementResponseDTO[]
  total: number
  limit: number
  offset: number
}
```

---

## Folder Structure

```
src/
├── app.html
├── app.css                        # Tailwind directives + global tokens
├── lib/
│   ├── types.ts                   # All TS interfaces / enums (above)
│   ├── api.ts                     # Typed fetch wrapper — all API calls here
│   ├── stores/
│   │   ├── patients.svelte.ts     # $state store for patient list + search state
│   │   ├── toast.svelte.ts        # Global toast notification store
│   │   └── theme.svelte.ts        # (optional) light/dark toggle
│   ├── utils/
│   │   ├── formatters.ts          # formatDate, formatBMI, formatWeight, etc.
│   │   └── validators.ts          # Client-side field validation helpers
│   └── components/
│       ├── ui/
│       │   ├── Button.svelte
│       │   ├── Input.svelte
│       │   ├── Select.svelte
│       │   ├── Textarea.svelte
│       │   ├── Badge.svelte       # Status / blood-type / gender pills
│       │   ├── Card.svelte
│       │   ├── Modal.svelte       # Accessible dialog wrapper
│       │   ├── Toast.svelte       # Individual toast bubble
│       │   ├── ToastContainer.svelte
│       │   ├── Spinner.svelte
│       │   ├── EmptyState.svelte
│       │   └── Pagination.svelte
│       ├── layout/
│       │   ├── Sidebar.svelte     # Collapsible nav sidebar
│       │   ├── TopBar.svelte      # Breadcrumb + global search + user avatar
│       │   └── PageHeader.svelte  # Title + action slot
│       ├── patients/
│       │   ├── PatientCard.svelte         # Compact list card
│       │   ├── PatientTable.svelte        # Table view for search results
│       │   ├── PatientSearchBar.svelte    # Filter inputs + status chip filters
│       │   ├── PatientForm.svelte         # Shared create/edit form (tabbed sections)
│       │   └── PatientStatusBadge.svelte  # Active / Inactive / Deceased badge
│       └── measurements/
│           ├── MeasurementCard.svelte     # Single measurement summary card
│           ├── MeasurementForm.svelte     # Record new measurement form
│           ├── BMIGauge.svelte            # Visual BMI category gauge
│           ├── MeasurementTimeline.svelte # History list with chart toggle
│           └── CalorieTable.svelte        # TotalCalories breakdown table
├── routes/
│   ├── +layout.svelte             # Root layout: sidebar + topbar
│   ├── +page.svelte               # Dashboard: KPI cards + recent patients
│   ├── patients/
│   │   ├── +page.svelte           # Patient search & list page
│   │   ├── new/
│   │   │   └── +page.svelte       # Create patient page
│   │   └── [id]/
│   │       ├── +page.svelte       # Patient detail / profile page
│   │       ├── +page.ts           # Load patient by ID
│   │       └── measurements/
│   │           └── +page.svelte   # Measurement history page
│   └── health/
│       └── +page.svelte           # API health status page
```

---

## Pages & Features to Generate

### 1. Root Layout (`+layout.svelte`)
- Collapsible dark glassmorphism sidebar with:
  - Chirimoya logo / wordmark at top
  - Nav items: Dashboard, Patients, Health
  - Each nav item with a Lucide icon
- TopBar: page title (via layout data) + global patient quick-search input
- `<ToastContainer />` mounted at root
- Slot for page content

### 2. Dashboard (`/`)
- KPI cards row:
  - **Total Patients** — call `GET /api/v1/patients?limit=1` and read `total`
  - **Active Patients** — `GET /api/v1/patients?status=active&limit=1`
  - **Inactive Patients** — `GET /api/v1/patients?status=inactive&limit=1`
  - **Deceased Patients** — `GET /api/v1/patients?status=deceased&limit=1`
- Recent Patients section: `GET /api/v1/patients?limit=5&offset=0` — rendered
  as `<PatientCard>` list with animated entrance
- API Health indicator: live `GET /health` ping with green/red dot

### 3. Patient List / Search (`/patients`)
- `<PatientSearchBar>` with debounced inputs:
  - Text: `first_name`, `last_name`, `mrn`, `date_of_birth`
  - Chip filters: `status` (All | Active | Inactive | Deceased)
- Results rendered in `<PatientTable>` with columns:
  `MRN | Full Name | DOB | Age | Gender | Blood Type | Status | Latest BMI | Actions`
- Pagination via `<Pagination>` (limit 20, previous/next + page numbers)
- Row actions: **View** → `/patients/{id}`, **Edit** → opens edit modal
- Empty state with illustration when no results

### 4. Create Patient (`/patients/new`)
- Multi-step form using `<PatientForm>` with 4 tab sections:
  1. **Demographics** — `first_name`, `last_name`, `date_of_birth`, `gender`,
     `marital_status`, `ssn_last_four`, `national_id`
  2. **Medical** — `blood_type`, `allergies` (tag input), `chronic_conditions` (tag input)
  3. **Contact & Address** — `contact_info` + `address` (optional)
  4. **Emergency & Insurance** — `emergency_contact` + `insurance_info` (optional collapsibles)
- Submit calls `POST /api/v1/patients`
- On success: toast + redirect to `/patients/{id}`
- Client-side validation for all required fields before submit

### 5. Patient Profile (`/patients/[id]`)
- Loads `GET /api/v1/patients/{id}` via `+page.ts`
- Header section: avatar initials bubble + `full_name`, MRN badge, status badge,
  age, blood type pill
- Tab sections:
  1. **Overview** — demographics, contact info, address on a 2-col grid
  2. **Medical** — blood type, allergies chips, chronic conditions chips, notes
  3. **Emergency & Insurance** — emergency contact card + insurance card
  4. **Measurements** — embedded `<MeasurementTimeline>` + add button
- **Edit** action: opens `<Modal>` with pre-populated `<PatientForm>`
  - Submits `PATCH /api/v1/patients/{id}`
- **Status change** quick dropdown (Active / Inactive / Deceased)

### 6. Measurement History (`/patients/[id]/measurements`)
- Full-page measurement history view
- Top: `<BMIGauge>` card showing latest BMI
- Metric summary row: Height, Weight, Waist, Hip, BMI, BMR (Harris-Benedict + Mifflin-St Jeor)
- TDEE breakdown table (4 activity levels × 2 formulas)
- `<CalorieTable>` for `total_calories_harris_benedict` — clinical stress conditions
- Timeline of all measurements: `GET /api/v1/patients/{id}/measurements`
  - Each row expandable to show full calculated data
- **Record Measurement** button → `<MeasurementForm>` modal
  - Fields: `height_cm`, `weight_kg`, `waist_cm`, `hip_cm`, `measured_at` (datetime-local)
  - At least one measurement field required (client-side check)
  - Calls `POST /api/v1/patients/{id}/measurements`
  - On success: refreshes timeline + updates BMI gauge

### 7. Health Page (`/health`)
- Calls `GET /health` every 10 seconds
- Shows: service name, version, status indicator, database connection status
- Styled as a terminal/status card

---

## `src/lib/api.ts` — Functions to implement

```ts
// Patient API
createPatient(dto: PatientCreateDTO): Promise<PatientResponseDTO>
getPatientById(id: string): Promise<PatientResponseDTO>
getPatientByMrn(mrn: string): Promise<PatientResponseDTO>
updatePatient(id: string, dto: PatientUpdateDTO): Promise<PatientResponseDTO>
searchPatients(params: PatientSearchParams): Promise<PaginatedPatientsResponseDTO>

// Measurements API
addMeasurement(patientId: string, dto: BodyMeasurementCreateDTO): Promise<BodyMeasurementResponseDTO>
getLatestMeasurement(patientId: string): Promise<BodyMeasurementResponseDTO>
listMeasurements(patientId: string, limit?: number, offset?: number): Promise<PaginatedMeasurementsResponseDTO>

// Health
getHealth(): Promise<HealthResponseDTO>
```

Each function must:
- Throw a typed `ApiError` (with `status` + `detail` message) on non-2xx
- Be fully typed with the TS interfaces above

---

## `src/lib/stores/toast.svelte.ts`

```ts
// Expose:
addToast(message: string, type: "success" | "error" | "info" | "warning", duration?: number)
// Toasts auto-dismiss after duration ms (default 4000)
```

---

## Component Contracts

### `<PatientForm>` Props
```ts
patient?: PatientResponseDTO  // if provided → edit mode, else → create mode
onSave: (dto: PatientCreateDTO | PatientUpdateDTO) => Promise<void>
onCancel: () => void
loading: boolean
```

### `<Modal>` Props
```ts
open: boolean
title: string
size?: "sm" | "md" | "lg" | "xl"   // default "md"
onClose: () => void
```

### `<BMIGauge>` Props
```ts
bmi?: number
category?: string
```
Visual gauge: colored arc from 15 to 40, with needle at current BMI.
Color zones: Underweight (blue) | Normal (green) | Overweight (yellow) | Obese (red).

### `<CalorieTable>` Props
```ts
calories: TotalCaloriesResponseDTO
formula: "harris_benedict" | "mifflin_st_jeor"
```
Renders 11 stress conditions × 4 activity levels as a sortable table.

### `<Pagination>` Props
```ts
total: number
limit: number
offset: number
onChange: (offset: number) => void
```

---

## Constraints

- No external UI component libraries (shadcn, daisyUI, etc.) — build all components from scratch
- All forms must have loading states and error handling
- Responsive: sidebar collapses on `md` breakpoint, mobile drawer on `sm`
- All numeric medical values (BMI, weight, calories) displayed with 2 decimal places
- Dates displayed as `MMM d, yyyy` (e.g., "Jun 5, 2026")
- `allergies` and `chronic_conditions` use a tag-input pattern (type + Enter to add, × to remove)
- Patient avatar initials auto-generated from `first_name[0] + last_name[0]`
- Skeleton loaders on all async data fetches (no raw spinners for page-level loads)
- TypeScript strict mode enabled
- `eslint` + `prettier` configured

---

## Generate

1. `package.json` with all dependencies
2. `vite.config.ts`
3. `svelte.config.ts`
4. `tsconfig.json`
5. `tailwind.config.ts` (if needed for v4 custom tokens)
6. `.env.example`
7. `src/app.html` + `src/app.css`
8. `src/lib/types.ts`
9. `src/lib/api.ts`
10. `src/lib/stores/toast.svelte.ts`
11. `src/lib/stores/patients.svelte.ts`
12. `src/lib/utils/formatters.ts`
13. `src/lib/utils/validators.ts`
14. All `src/lib/components/**/*.svelte` (see folder structure)
15. All `src/routes/**` files (see pages spec)
16. `src/routes/+layout.svelte`
17. `README.md` for the frontend

---

## Additional Notes

- API base URL must be read from `import.meta.env.VITE_API_BASE_URL`
- Include a working `error.svelte` page for unhandled route errors
- The health page should auto-poll using `setInterval` in `onMount` + clear on `onDestroy`
- TDEE values (sedentary, lightly_active, moderately_active, very_active) should be shown
  as a small grouped bar chart using `chart.js` inside `<MeasurementTimeline>`
- BMR comparison (Harris-Benedict vs Mifflin-St Jeor) shown as a horizontal bar chart
- All modals trap focus and close on `Escape`
