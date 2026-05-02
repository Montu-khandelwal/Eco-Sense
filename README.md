# EcoSense Frontend

React + Vite frontend for EcoSense.

## Run

```bash
npm install
npm run dev
```

The frontend expects the backend at:

```text
http://localhost:2000/api
```

To change backend URL, create `.env`:

```text
VITE_API_BASE_URL=http://localhost:2000/api
```

Backend-connected files:

```text
src/services/api.js
src/hooks/useEcoSenseApi.js
```
