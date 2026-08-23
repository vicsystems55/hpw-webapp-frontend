# Hope Pathway Portal

A new Vue 3 frontend for Hope Pathway's internal care-management portal.

## Stack

- Vue 3 and Vite
- Vue Router with permission-aware route guards
- Pinia authentication state
- Tailwind CSS
- Lucide icons via `@lucide/vue`
- Axios API client

## Local setup

```bash
npm install
npm run dev
```

The development server uses `http://127.0.0.1:5174` by default. Set the Laravel API URL in `.env`:

```env
VITE_API_URL=http://localhost:6600/api
```

## Authentication

The login screen supports separate staff and administrator portals:

- `POST /api/staff/login`
- `POST /api/admin/login`

The frontend stores the Sanctum bearer token, user summary, and permission list in local storage. Protected navigation is derived from permissions returned by the backend. The current session is refreshed through `GET /api/me` and revoked through `POST /api/logout`.

## Design palette

- Hope Pathway blue: `#087fc3`
- Hope Pathway orange: `#f55b00`
- Deep navy: `#102a43`
- Care mint: `#22b8a7`
- Soft sky: `#eaf7ff`
- Warm cream: `#fff8ed`

The original logo is copied into `public/hope-pathway-logo.png`.

## Production build

```bash
npm run build
```

Deploy the generated `dist` directory and configure the host to serve `index.html` as the fallback for Vue Router history routes.

## Netlify deployment

The repository includes `netlify.toml`, a Vue Router fallback, and a Node 22 runtime declaration. Production builds use:

```env
VITE_API_URL=https://api.hopepathway.co.uk/api
```

Netlify should use the repository root as its base directory, `npm run build` as the build command, and `dist` as the publish directory.
