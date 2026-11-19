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

## Completed supervision archive

Administrators can open **Supervision archive** from the sidebar or **Supervision → Completed archive** at `/supervision/archive`.

The viewer shows private historical staff snapshots and completed supervision sessions. Choose a source archive and staff member, then open a session to read its original saved responses. Multiple responses and uncertain question wording remain flagged. **Print session** prints only the selected historical record.

To import prepared records, choose **Import archive**, select `archive.json`, review the source, staff and counts, and confirm. The original SQL backup, ZIP, manifest and standalone HTML viewer are not import files. Imported records stay separate from current staff and supervision IDs.

The Laravel backend supplies the protected archive endpoints and private file storage. Deploy the frontend and backend together and clear old Laravel route caches. No database migration is needed for this feature. Confidential archive files are transferred through the admin importer or backend console; they are never included in frontend source files or the Netlify build.
