# Frontend Local Runbook (Dev)

This runbook explains how to run the frontend locally and connect it to the backend.

## Prerequisites

- Node.js 20+ installed
- npm installed
- Backend running locally at `http://localhost:8000`
- Backend DB migrated (backend `make migrate` already executed)

---

## 1) Start backend first (required)

From backend repo:

```bash
docker-compose up -d
make migrate
```

Verify backend health:

```bash
curl http://localhost:8000/health/live
```

Expected response includes:

```json
{
  "status": "ok"
}
```

---

## 2) Configure frontend environment

From frontend repo root, create local env file:

```bash
cp .env.local.example .env.local
```

Ensure this key exists:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 3) Install dependencies

```bash
npm install
```

---

## 4) Start frontend dev server

```bash
npm run dev
```

Open:
- Home: `http://localhost:3000`
- Health page: `http://localhost:3000/health`
- Dashboard shell: `http://localhost:3000/dashboard`

---

## 5) Validate frontend ↔ backend connection

Open `http://localhost:3000/health`.

Expected:
- Page renders backend health JSON from `/health/live`
- If backend is down/misconfigured, page shows an error state.

---

## Troubleshooting

## A) Port conflicts

Symptoms:
- Frontend fails to start
- Error mentions `3000` or `8000` already in use

Check:
```bash
lsof -i :3000
lsof -i :8000
```

Fix:
- Stop conflicting process, or
- Run frontend on another port:
```bash
npm run dev -- -p 3001
```
- If backend conflict, stop duplicate local uvicorn process or container.

---

## B) DB/backend connection failures

Symptoms:
- `/health` page shows fetch failures
- Backend logs show DB connection refused
- Backend returns 5xx

Fix flow:
1. Confirm backend containers are up:
```bash
docker-compose ps
```
2. Re-run migrations:
```bash
make migrate
```
3. Check backend logs:
```bash
docker-compose logs -f --tail=200 api postgres
```
4. Re-test backend directly:
```bash
curl http://localhost:8000/health/live
```

---

## C) CORS / env mismatch

Symptoms:
- Browser shows CORS errors
- Frontend can load, but API calls fail in browser
- Wrong backend URL being called

Checks:
1. Confirm frontend env:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
2. Confirm backend allows frontend origin (e.g. `http://localhost:3000`)
3. Restart frontend after env changes:
```bash
# stop dev server then
npm run dev
```
4. Restart backend if CORS config changed:
```bash
docker-compose restart api
```

---

## Daily dev commands (frontend)

```bash
npm run dev
npm run lint
npm run typecheck
npm run format
```