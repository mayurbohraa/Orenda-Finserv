# Orenda Finserv CRM

Orenda Finserv CRM is a frontend-only CRM mock portal developed as part of the Orenda Finserv Frontend Assignment. The application is built using React, JavaScript (ES6+), JSX, Tailwind CSS, React Router DOM, and Context API, with all application data managed through local JSON files. It recreates the provided Figma designs as closely as possible, including the complete case creation flow, applicant and co-applicant management, activity timeline, documents, and responsive user interface. The project follows a reusable component-based architecture with clean, maintainable code and simulates all interactions using local state without any backend, authentication, or database.

## Stack

| Layer    | Choice                       |
| -------- | ---------------------------- |
| UI       | React 19 + Vite              |
| Language | JavaScript (ES6+) / JSX      |
| Routing  | React Router DOM             |
| Styling  | Tailwind CSS v4              |
| State    | Context API                  |
| Data     | JSON fixtures in `src/data/` |
| Icons    | lucide-react                 |

## Setup

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start local development server |
| `npm run build`   | Production build to `dist/`    |
| `npm run preview` | Preview the production build   |
| `npm run lint`    | Run oxlint                     |
| `npm test`        | Run focused regression tests   |

## Routes

| Path         | Screen                                                         |
| ------------ | -------------------------------------------------------------- |
| `/`          | Dashboard (Home)                                               |
| `/cases`     | Cases list                                                     |
| `/cases/:id` | Case detail (applicant, co-applicant, documents, activity log) |

## Features

- **Dashboard** — welcome header, sample KPI metrics with sparklines, cases table, search, status filter, pagination, CSV export of all matching cases, Create Case
- **Cases** — searchable/filterable table, Add Case modal, pagination
- **Add Case** — validation, disabled submit until complete, pincode → city/state autofill (read-only)
- **Case detail** — applicant & co-applicant preview/edit, activity timeline, documents (view / upload / update / delete)
- **Header** — reward points, notifications dropdown (unread red dot), profile dropdown (email, role, demo session notice)
- **Scrollbars** — custom navy thumb on main areas, tables, dropdowns, and panels; visible only while scrolling
- **Toast** — accessible feedback for case creation, CSV export, document actions, and demo-only controls

## Notes

- City and state autofill from `src/data/pincodes.json` first; any other valid 6-digit Indian pincode is resolved via the India Post API.
- PIN lookups clear stale locations, support cancellation and an eight-second timeout, and show errors with retry. Loan amounts must be positive, safe whole-rupee integers.
- Changes and uploaded files last only for the current session and reset on refresh.
- New cases start as **Pending** and appear at the top of the list.
- Co-applicant form prefills loan type, constitution, amount, and address from the applicant case.
- Some cases include sample documents; others start empty until files are added.
- Uploaded documents can be previewed in a modal (images/PDFs); sample seeded docs show a placeholder preview.
- Select menus render above cards and modals so options are not clipped.
- Logout and Support explain that no authentication session or support service exists in this demo.
- The sidebar uses an icon rail below desktop widths. Dialogs manage focus; dropdowns support arrows, Home/End, Enter, and Escape.
- Runtime assets remain in `public/`. Sibling `Orenda Finserv_Docs`, `Orenda Finserv_Assets`, and `Orenda Finserv_Visuals` folders hold private reference documents, original branding resources, and reference screenshots outside the Git repository.

## Project structure

```
src/
  components/
    applicant/   # applicant & co-applicant panels, activity log
    cases/       # table, add-case modal, documents, sparkline
    layout/      # sidebar, header, app shell
    ui/          # reusable UI primitives (ScrollInset, Select, Modal, …)
  contexts/      # AppContext (local state)
  data/          # JSON mock data
  pages/         # Dashboard, Cases, Case Detail
  utils/         # shared helpers
  App.jsx
  index.js
  index.css
```

## Trade-offs / with more time

This assignment prioritised Figma-faithful UI and the full case flow over a production backend. State lives in React Context over JSON fixtures, so creates, edits, and document uploads reset on refresh; Logout and Support explicitly describe their demo limitations; CSV export works locally and escapes spreadsheet formulas.

**With more time I would:**

- Add a thin data layer (mock API or `localStorage` first) so cases and documents persist, then wire real upload/preview URLs instead of blob URLs.
- Introduce auth (login, route guards, real logout) and derive dashboard KPIs from live case data rather than static `dashboard.json`.
- Model status/phase transitions and add document delete confirmations.
- Consider TypeScript and a maintained browser test runner alongside the existing Node regression tests.
