# SHMIS Frontend

React + Vite frontend for the SHMIS backend (Sindh Health Management Information System).

## Run it

1. Start MongoDB, then the backend (`npm run dev` inside `shmis-backend`, port 5000).
2. In this folder:

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

If your backend is somewhere else, copy `.env.example` to `.env` and change `VITE_API_URL`.

## What's inside

- `src/resources.jsx` – describes every backend collection once: table columns, form fields, dropdown rules.
  To add or remove a column or a form field, this is the only file you need to touch.
- `src/pages/ResourcePage.jsx` – the shared list screen (search, status filter, sorting, paging, CSV export, view/edit/delete).
- `src/pages/Dashboard.jsx` – dashboard with counts, upcoming appointments, waiting lab reports, and breakdowns from `/api/analytics`.
- `src/components/` – drawer, searchable dropdown, form, detail view, patient history.
- `src/styles.css` – all the styling, one file.

## Sign in and roles

The app opens on a login page. Pick Admin, Doctor or Patient, then sign in.

| Role | Can open | Can edit |
|------|----------|----------|
| Admin | Everything | Everything |
| Doctor | Dashboard, Patients, Appointments, Clinical records, Prescriptions, Lab tests | Same pages |
| Patient | Dashboard, Appointments, Clinical records, Prescriptions, Lab tests (own records only) | Nothing (read-only) |

Sign-in calls `POST /api/auth/login` with `{ username, password, role }` and expects
`{ token, user: { role, name, ... } }` (optionally wrapped in `data`). If the backend has no such route yet,
the demo accounts in `src/auth.js` are used: `admin / admin123`, `doctor / doctor123`, `patient / patient123`.
The role rules live in `src/auth.js`.

Note: hiding pages and filtering a patient's rows happens in the browser. Real privacy needs the backend to check the token and role too.
