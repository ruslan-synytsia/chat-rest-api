# Chat REST API

Simple authorization and chat API service built with Express and MongoDB.

## Requirements
- Node.js 20.9.0
- MongoDB connection string

## Install
```bash
npm install
```

## Environment variables
Create a `.env` file or configure environment variables in your host.

Required:
- `DB_MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`

Optional:
- `CLIENT_URL` (for CORS)
- `PORT` (defaults to 3000)

Example:
```bash
DB_MONGO_URI=mongodb+srv://user:pass@cluster/db
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLIENT_URL=https://your-frontend.example
PORT=3000
```

## Run
```bash
npm start
```

## Dev (nodemon)
```bash
npm run dev
```

## Healthcheck
`GET /health` returns:
```json
{ "status": "ok" }
```

## Render notes
- Build: `npm install`
- Start: `npm start`
- Set env vars: `DB_MONGO_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CLIENT_URL`
