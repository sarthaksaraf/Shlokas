# Shlokas Emotions Frontend (Admin UI)

## Overview
This is a Vite + React admin interface for managing and previewing emotion-based content from the backend Emotions API. It supports file upload, version history, live preview, and responsive UI for all emotion types.

---

## Tech Stack
- **Vite**: Fast React development
- **React**: UI framework
- **Axios**: HTTP client for API calls
- **CSS Grid/Flexbox**: Responsive layout
- **Jest/React Testing Library**: (Optional, for frontend tests)

---

## Folder Structure
```
shlok-frontend/
  src/
    App.jsx            # User-facing app (not admin)
    AdminApp.jsx       # Admin dashboard (main entry for admin)
    main.jsx           # Entry point (swap App/AdminApp)
    components/
      EmotionGrid.jsx  # Grid of emotion tiles, expandable
      EmotionGrid.css  # Styles for grid and tiles
      FileUpload.jsx   # Upload and diff JSON files
      VersionHistory.jsx # List and preview backups
      ...
    services/
      emotionsApi.js   # API service for backend calls
  vite.config.js       # Vite dev server config (API proxy)
  package.json         # Dependencies and scripts
  .env                 # Environment variable for API base URL
  README.md            # (This file)
```

---

## Main Components
- **AdminApp.jsx**: Main admin dashboard, ties together all features
- **EmotionGrid.jsx**: Responsive grid, expandable tiles, fetches random emotion data from backend
- **FileUpload.jsx**: Uploads new JSON, shows diff, confirms update
- **VersionHistory.jsx**: Lists backups, allows previewing old versions
- **emotionsApi.js**: Handles all API calls (fetch, update, versioning)

---

## API Integration
- All data is fetched live from the backend Emotions API:
  - `GET /api/emotions` — All emotions (grouped)
  - `GET /api/emotions/random/:emotion` — Random entry for a given emotion
  - `POST /api/emotions/update` — Upload new JSON (admin only)
  - `GET /api/emotions/versions` — List backups
  - `GET /api/emotions/version/:filename` — Get a specific backup

---

## Dynamic Backend URL (No Hardcoding)
- The backend base URL is set via the `.env` file using the `VITE_API_BASE_URL` variable.
- **Default:** `VITE_API_BASE_URL=http://localhost:3001`
- To change the backend (e.g., for ngrok, production, etc.), just update `.env`:
  ```env
  VITE_API_BASE_URL=https://your-ngrok-url.ngrok.io
  ```
- **No need to touch any code.** All API requests use this base URL automatically.
- You can also override this at build time:
  ```powershell
  VITE_API_BASE_URL=https://prod.example.com npm run build
  ```

---

## How to Run
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Set your backend URL in `.env` if needed.
3. Start the dev server:
   ```powershell
   npm run dev
   ```
   - The app runs at [http://localhost:5173](http://localhost:5173)
   - API requests are proxied to backend (see `vite.config.js`)

---

## Switching Between User and Admin UI
- In `src/main.jsx`, swap between `<App />` (user) and `<AdminApp />` (admin) as needed.

---

## Features
- **Live Data:** Always fetches from backend, no stale data
- **Responsive:** Works on desktop and mobile
- **Versioning:** Preview and restore old JSON backups
- **Secure Upload:** Requires admin credentials for updates
- **Diff Viewer:** Shows changes before confirming upload
- **Animated Tiles:** Expand/collapse with smooth transitions
- **Next Button:** Fetches a new random entry for each emotion without reload

---

## File Responsibilities
- `App.jsx`: (Optional) User-facing app, not used for admin
- `AdminApp.jsx`: Main admin dashboard
- `components/EmotionGrid.jsx`: Grid and tile logic
- `components/FileUpload.jsx`: File upload and diff
- `components/VersionHistory.jsx`: Backup/version history
- `services/emotionsApi.js`: All backend API calls (uses env-based base URL)
- `vite.config.js`: Proxies `/api` to backend for local dev
- `.env`: Set `VITE_API_BASE_URL` for backend URL

---

## Production
- Build for production:
  ```powershell
  npm run build
  ```
- Serve the static files in `dist/` with any static server (e.g. `npx serve dist` or Nginx)
- You can set the backend URL at build time as well.

---

## Testing
- (Optional) Add tests with Jest/React Testing Library as needed

---

## Contact
For integration help, see this README or the backend README for API details.
