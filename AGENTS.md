<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
# General Rules
## 1. Never touch remake-back folder unless I explicitly state it.
- Never edit, commit, or run commands that modify files in `c:\dev\Hilet\remake-back`.
- If backend data or seed coordinates are legacy/outdated, adapt or calibrate them in the frontend (e.g., `lib/mapCalibration.ts`).

## 2. Command Execution on Windows
- `npm.ps1` and `npx.ps1` are blocked by default Windows ExecutionPolicy in PowerShell.
- ALWAYS invoke npm/npx commands via `cmd.exe /c` (e.g., `cmd.exe /c npx tsc --noEmit` or `cmd.exe /c npm run dev`).

## 3. Efficiency & Tool Usage
- Make direct, targeted file edits. Avoid creating heavy intermediate scratch scripts, multi-turn pixel analysis pipelines, or unnecessary verification loops when direct inspection suffices.

# Frontend Architecture & Coding Standards
## 1. State Management & Async Flows
- NEVER use multiple loose boolean or nullable states (e.g., `isA`, `isB`, `itemTo`, `itemFrom`) to track multi-step async workflows.
- ALWAYS use Discriminated Union Finite State Machines (FSMs) or reusable custom hooks (like `useTravelFlow`).
- Cross-component communication MUST go through Zustand stores. NEVER use `window.dispatchEvent` or ad-hoc DOM events.

## 2. Next.js Routing & Layouts
- Persistent UI elements (menus, timers, global HUDs, game-over listeners) MUST live in `layout.tsx`, NEVER duplicated across `page.tsx` files.
- Keep `page.tsx` files minimal: they should solely parse route params and delegate to a screen component.

## 3. Z-Index and Layering Hierarchy
- NEVER use arbitrary z-index numbers like `z-[9999]`, `z-[99999]`, or `z-[999999]`.
- Stacking order strictly follows:
  - Base content / Room background / Interrogation scene: `z-0` to `z-10`
  - Screen controls / top bars: `z-20`
  - HUD / Investigation Menu / Global timers: `z-30`
  - Screen Modals / Dialogs / Dossiers: `z-40`
  - Urgent Overlays (Newspapers / Travel Animation): `z-50`
  - Toasts / Notifications: `z-60`
- Interrogation screens (`DialogBox`, `LocationIntro`) must remain within base content (`z-0`/`z-10`) so the global HUD (`z-30`) remains accessible. NEVER use `-z-10` on images (causes black-screen bugs behind dark parent containers).

## 4. Component Boundaries & Styling
- Any repeated or visually rich item inside `.map()` (e.g., Polaroid cards) MUST be extracted into its own component file under `components/buttons/` or `components/Level/`.
- Screen components must not exceed 250 lines; extract sub-panels (headers, frames, lists) when reached.
- **Scroll & Hover Scaling**: Containers holding cards with `hover:scale-*` MUST use `overflow-y-auto overflow-x-hidden` combined with sufficient padding (`px-3.5` or `p-3+`). NEVER leave `overflow-x` open to prevent horizontal scrollbar flicker on hover.

## 5. Storage & Side Effects
- NEVER perform raw `Object.keys(sessionStorage)` scans in component files. Encapsulate all browser storage in dedicated helper functions (e.g., `lib/briefingStorage.ts`).

## 6. Map & Geography Calibration
- Tactical Detective Room background is `/images/test_composite.webp` (1155x644).
- The tactical monitor bounding box is:
  `left: 19.186%`, `top: 6.510%`, `width: 61.773%`, `height: 74.219%`.
- All national province pin coordinates (`top`, `left`) are calibrated in `lib/mapCalibration.ts` relative to the tactical monitor.
- When triggering full-screen animations like `TravelAnimationOverlay` (`fixed inset-0`), convert monitor coordinates using `monitorCoordToScreen()` so flights originate and terminate precisely on the province pins.

## 7. Audio & SFX Standards
- Play SFX via `audioManager.play(sfx)` or `useAudioStore.getState().playSfx(sfx)`.
- `opencasefile`: Pinned notes, case files, suspect cards, and location polaroid cards on hover.
- `typewriter`: Buttons with textual commands ("CERRAR SESIÓN", "EMITIR ORDEN", dossier physical trait buttons).
- `click`: Back buttons, navigation, and dialog text advance.
- `plane`: Inter-provincial travel.
- `swoosh`: Urban patrol car travel.

## 8. Gameplay & Feature Constraints
- **No Handholding**: Do NOT auto-highlight matching clues when hovering suspects on the Investigation Board.
- **Decommissioned Features**: The Museum has been permanently removed (no museum items, routes, or modals).
