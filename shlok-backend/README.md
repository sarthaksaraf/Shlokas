# Shlokas Emotions Backend

## Overview
This backend is a Node.js/Express API for serving and managing emotion-based content (from `Emotions.json`) and shlokas (from MongoDB). It supports versioning, admin updates, and is designed for use with both web and mobile (Flutter) frontends.

---

## Tech Stack
- **Node.js** + **Express**: HTTP server and routing
- **CORS**: Cross-origin support for web and mobile
- **dotenv**: Environment variable management
- **express-rate-limit**: Rate limiting for security
- **Jest/Supertest**: Automated testing
- **Swagger**: API documentation
- **Docker**: Containerization support
- **MongoDB + Mongoose**: (For shlokas API only)

---

## Folder Structure
```
shlok-backend/
  app.js                # Main Express server (Emotions API)
  Emotions.json         # Main data file for emotions
  Dockerfile            # For containerized deployment
  .env / .env.example   # Environment variables
  README.md             # (This file)
  src/
    emotions.test.js    # Jest/Supertest backend tests
    postman_collection.json # Postman API collection
    swagger.yaml        # OpenAPI/Swagger spec
    config/
      db.js             # MongoDB connection (for shlokas)
    controllers/
      shlokController.js# Shlokas business logic
    models/
      shlokModel.js     # Mongoose schema/model for shlokas
    routes/
      shlokRoutes.js    # Shlokas API routes
```

---

## Emotions API (File-based)

### Main Endpoints
- `GET /api/emotions` — All emotions, grouped by type
- `GET /api/emotions/random/:emotion` — Random entry for a given emotion
- `GET /api/emotions/:id` — By index (legacy)
- `POST /api/emotions/update` — Update emotions file (admin, with backup/versioning)
- `GET /api/emotions/versions` — List backup files
- `GET /api/emotions/version/:filename` — Get a specific backup
- `GET /api/docs` — Swagger UI (API docs)

### Features
- **Versioning:** Every update creates a timestamped backup.
- **Validation:** JSON schema validation for uploads.
- **Security:** Basic Auth + rate limiting on update endpoint.
- **CORS:** Configurable for web and mobile.
- **Error Handling:** Consistent JSON error responses.

---

## Shlokas API (MongoDB-based)

### Main Endpoints
- `GET /api/shloks/random` — Random shlokas for each mood (see `src/controllers/shlokController.js`)

### Features
- **Aggregation:** Efficient random sampling per mood.
- **Flexible Schema:** Mood can be string or array.

---

## File Responsibilities
- `app.js`: Main Express app, all Emotions API logic, CORS, error handling, versioning, Swagger.
- `Emotions.json`: Main data file for all emotions content.
- `src/emotions.test.js`: Automated tests for all main endpoints.
- `src/swagger.yaml`: OpenAPI spec for Emotions API.
- `src/postman_collection.json`: Ready-to-use Postman collection.
- `src/config/db.js`, `src/models/`, `src/controllers/`, `src/routes/`: MongoDB-based shlokas API (not used for emotions).

---

## Environment Variables
- `PORT`: API port (default: 3001)
- `API_USER`, `API_PASS`: Basic Auth credentials
- `DATA_DIR`: Path to JSON storage (default: project root)
- `CORS_ORIGINS`: Comma-separated allowed origins
- `MONGO_URI`: (For shlokas API only)
- `API_BASE_URL`: The base URL for this backend (default: http://localhost:3001). Used for logging and can be referenced by other services or documentation. Change this in your `.env` to match your deployment (e.g., ngrok, production, etc.).

---

## Testing
- Run all backend tests:
  ```powershell
  npm test
  ```
- Uses Jest and Supertest (see `src/emotions.test.js`)

---

## Docker
- Build and run:
  ```powershell
  docker build -t shlokas-backend .
  docker run -p 3001:3001 --env-file .env shlokas-backend
  ```

---

## API Documentation
- Swagger UI: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- OpenAPI spec: `src/swagger.yaml`

---

## Postman
- Import `src/postman_collection.json` for ready-to-test API requests.

---

## Production
- Use Docker or run with `node app.js` (set `NODE_ENV=production` for best performance).

---

## Contact
For questions, see this README or the Swagger docs. For Flutter integration, refer to the Emotions API section above.
