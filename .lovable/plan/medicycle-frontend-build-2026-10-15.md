# MediCycle frontend build

Build the MediCycle prototype described in the supplied brief, beginning at `/`, using mock data and no new backend.

## User-facing scope
- Create a striking public landing page with healthcare imagery, feature summaries, steps, and working navigation.
- Add login and role-specific registration screens.
- Add medical-shop and recipient-organization workspaces, preserving the requested distinct navigation and page content: dashboards, inventory, donation entry, request review, medicine browsing/requests, and reports.
- Make prototype forms, search/filter controls, request actions, role selection, and status feedback usable with clearly fictional sample data. Do not imply real authentication, medical certification, or backend connectivity.
- Match the requested premium forest-green, teal, white, and mint direction with consistent typography, whitespace, cards, forms, and responsive layouts.

## Technical approach
- Preserve the TanStack Start stack and existing preview setup. Build route files for the requested screens and share a frontend-only shell/data layer so navigation and presentation stay consistent.
- Keep demo interactions in client-side state; add no database, API, authentication service, or backend architecture.
- Establish semantic color and typography tokens in `src/styles.css`; use the existing shadcn controls and Lucide icons.
- Generate one purpose-made healthcare donation image for the public landing page.
- Add a lean root `roadmap.md` and record the shared-shell architecture decision in `AGENTS.md`.

## Validation
- Run the existing routing tests and any focused interaction tests added for important prototype rules.
- Check the preview build and browser-visible landing/dashboard flows, including a desktop and narrow viewport.
- Ensure each content route has its own specific title and description metadata.
