# Railway deployment plan for Dhota Construction

## Backend service
- Runtime: Python / FastAPI
- Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Environment variables:
  - `PORT` (Railway injects this automatically)
  - `MONGO_URL`
  - `DB_NAME`
  - `JWT_SECRET`
  - `ADMIN_SECRET_KEY`
  - `ALLOWED_ORIGINS=http://localhost:3000,https://<your-frontend-domain>`

## Frontend service
- Runtime: Node / CRA
- Build command: `npm run build`
- Start command: `npm run start`
- Environment variables:
  - `REACT_APP_API_URL=https://<your-backend-domain>`

## Notes
- The old Emergent-style multi-process scaffolding is no longer needed on Railway.
- The SPA fallback is handled by the `serve -s build -l $PORT` start command.
