# NutriPlan — Figma UI + FastAPI integration

This frontend uses the Figma Make design and is wired to the existing NutriPlan FastAPI endpoint.

## Run

```bash
npm install
npm run dev
```

Optional `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

The planner sends `POST /api/nutrition/calculate` and renders the returned nutrition and PostgreSQL-backed meal data on the Results page.
