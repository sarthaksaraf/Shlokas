# Shlokas Emotions Project - How to Run (All Modes)

This guide explains how to run the backend and frontend for development, production, and with auto-reload. It covers both the Emotions API (file-based) and the React admin frontend.

---

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- (Optional) Docker (for containerized deployment)

---

## 1. Backend (shlok-backend)

### Install dependencies
```powershell
cd shlok-backend
npm install
```

### Run in Development (with auto-reload)
- Install nodemon globally (if not already):
  ```powershell
  npm install -g nodemon
  ```
- Start with auto-reload:
  ```powershell
  nodemon app.js
  ```

### Run in Production
- Start with Node.js:
  ```powershell
  node app.js
  ```
- Or use Docker:
  ```powershell
  docker build -t shlokas-backend .
  docker run -p 3001:3001 --env-file .env shlokas-backend
  ```

### Run Backend Tests
```powershell
npm test
```

---

## 2. Frontend (shlok-frontend)

### Install dependencies
```powershell
cd shlok-frontend
npm install
```

### Run in Development (with auto-reload)
```powershell
npm run dev
```
- App runs at [http://localhost:5173](http://localhost:5173)
- API requests are proxied to backend (see `vite.config.js`)

### Build for Production
```powershell
npm run build
```
- Serve the static files in `dist/` with any static server (e.g. `npx serve dist` or Nginx)

---

## 3. Switching Between User and Admin UI
- In `shlok-frontend/src/main.jsx`, swap between `<App />` (user) and `<AdminApp />` (admin) as needed.

---

## 4. Environment Variables
- Backend: Copy `.env.example` to `.env` and set credentials, CORS, etc.
- Frontend: No .env needed unless customizing Vite config.

---

## 5. API Documentation
- Swagger UI: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- OpenAPI spec: `shlok-backend/src/swagger.yaml`
- Postman: Import `shlok-backend/src/postman_collection.json`

---

## 6. Common Issues
- **CORS errors:** Ensure `CORS_ORIGINS` in backend `.env` includes your frontend URL.
- **Port conflicts:** Change `PORT` in backend `.env` or Vite config if needed.
- **API not reachable:** Make sure backend is running before starting frontend.

---

## 7. Flutter/Mobile Integration
- See `shlok-backend/README.md` for API endpoints and usage.
- Use `/api/emotions` and `/api/emotions/random/:emotion` for live data.

---

## 8. Contact
- For more, see the backend and frontend README files in their respective folders.
