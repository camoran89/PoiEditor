# POI Editor

Editor of points of interest (POIs) on top of a MapLibre map, built with Angular 21 standalone components and Angular Material. The app imports a GeoJSON `FeatureCollection` of points, lets the user add / edit / delete points, persists state in `localStorage`, and exports the result as a `.geojson` file.

This project answers the technical challenge in [docs/Desafíos Técnicos.pdf](docs/Desaf%C3%ADos%20T%C3%A9cnicos.pdf).

## Requirements

- Node.js 20.x or 22.x (LTS)
- npm 10+ (project pinned to `npm@11.11.0` via `packageManager`)
- Angular CLI 21 (installed locally via the `@angular/cli` dev dependency — use `npx ng ...`)

## Install, run, build, test

```bash
npm install
npx ng serve              # http://localhost:4200
npx ng build              # production build (dist/poi-editor)
npx ng build --configuration=development
npx ng test --watch=false # Vitest unit tests
```

Sample data is served from the `public/` folder:
- `public/pois.sample.geojson` — valid points around Santiago
- `public/pois.invalid.geojson` — mixed valid / invalid features to exercise the discard summary

## Features

### Required (MVP)
- MapLibre base map with OSM raster tiles and visible attribution.
- Import a GeoJSON `FeatureCollection` of `Point` features from a local file.
- Render imported points on the map and in a side list.
- Add a new point by clicking on the map (toggleable "Add" mode).
- Edit `name` and `category` of any point through a dialog.
- Delete a point with a confirmation dialog.
- Persist the current `FeatureCollection` to `localStorage` under key `poi_editor_state`.
- Auto‑restore the saved state on app start.
- Export the current state as a downloadable `.geojson` file.
- Clear the local state (removes the `localStorage` key and resets the app).
- Robust input handling: invalid features are discarded; a summary card shows how many were imported / discarded and the breakdown of reasons.

### Extras (challenge bonus)
- **Search & filter** — text search across `name`/`category` plus per-category chip filter.
- **Clustering** — MapLibre native clustering with cluster bubbles and counts; clicking a cluster zooms in.
- **Snapping** — toggleable snap to a 0.0001° grid when adding new points.
- **A11y basics** — `role`/`aria-label` on toolbar, search, sidebar and map; `aria-pressed` on toggle buttons; visible focus rings; Material dialogs trap focus and restore it on close.
- **Unit tests** — Vitest specs for validators (`latitude`, `longitude`, `coordinates`, `feature`), helpers (`poi-filter-matcher`, `coordinates-snapper`) and the `PoiStoreService` store.

## Architecture

The codebase enforces strict separation of concerns and a "one export per file" rule.

```
src/app/
├── core/                # framework-agnostic domain layer
│   ├── constants/       # immutable values (layer ids, ranges, defaults, snap step…)
│   ├── enums/           # GeoJsonType, DiscardReason, StorageKey
│   ├── helpers/         # pure helpers (factories, validators-by-composition, snapper, filter matcher…)
│   ├── interfaces/      # PoiFeature, PoiFeatureCollection, ImportSummary, PoiFilter…
│   ├── tokens/          # injection tokens (StorageDriver)
│   ├── types/           # branded primitive types (Latitude, Longitude, Coordinates, FeatureId)
│   └── validators/      # one validator class per concern (composed via constructor)
├── services/            # Angular @Injectable services
│   ├── geojson-importer.service.ts
│   ├── geojson-exporter.service.ts
│   ├── import-summary.service.ts
│   ├── local-storage-driver.service.ts
│   ├── map-style-provider.service.ts
│   ├── persistence.service.ts
│   └── poi-store.service.ts        # signals-based reactive store
├── ui/                  # Angular Material wrappers (single styling layer)
│   ├── button, icon-button, text-field, chip, card, alert,
│   ├── empty-state, file-picker, confirm-dialog, dialog-shell,
│   ├── toolbar, icon
│   └── services/        # DialogService, NotificationService, ConfirmDestructiveService
└── components/          # feature components — only consume ui/* (never Material directly)
    ├── actions-bar/
    ├── import-summary/
    ├── map/             # MapComponent + helpers/ for every private concern
    ├── poi-editor/      # PoiEditorComponent + PoiCreationDialogService
    ├── poi-filter/
    └── poi-list/
```

### Layered dependencies

```
components ──▶ ui ──▶ Angular Material
       │       │
       └──▶ services ──▶ core
                ▲          │
                └──────────┘
```

- `core/` has zero Angular runtime dependencies (only types/decorators-free helpers); imported everywhere.
- `services/` are the only place that holds runtime state (`PoiStoreService` uses signals).
- `ui/` is the only layer allowed to import from `@angular/material`. Feature components import `ui/*` instead.
- `components/` orchestrate; their private logic is extracted into per-concern helper / service files.

### Single-Responsibility & "one export per file"
Every file under `core/`, `ui/`, `components/*/helpers` and the dialog services exports exactly one thing. When a method on a component held meaningful logic (e.g. cluster zoom, click-intent dispatch, deferred collection apply, dialog opening, destructive confirmation) it was extracted into a dedicated single-export file.

### State management
`PoiStoreService` exposes signals (`features`, `count`, computed `collection`) and the only mutating operations needed by the use cases (`setAll`, `add`, `update`, `move`, `remove`, `clear`, `findById`). Filtering is applied in the `App` component via a `PoiFilterMatcher` helper to keep the store free of UI concerns.

### Persistence
`PersistenceService` depends on the `STORAGE_DRIVER` injection token. The default binding is `LocalStorageDriverService`, which implements the `StorageDriver` interface. Swapping to a different backend (IndexedDB, in-memory for tests, remote API) is a matter of providing a different token binding — no service consumer changes are needed.

### MapLibre integration
Map render concerns live in `components/map/helpers/`:
- `MapInitializer`, `MapStyleProviderService` — boot the map with OSM tiles and attribution.
- `PoiLayerRegistrar` — registers a clustered GeoJSON source plus three layers (cluster circles, cluster count, individual points).
- `MapInteractionsBinder`, `MapClickHandler`, `MapClickIntentDispatcher` — convert raw `MapMouseEvent`s into typed `MapClickIntent`s (`FeatureSelected | AddPointRequested | ClusterClicked | None`) consumed by the component.
- `DeferredCollectionApplier` / `MapCollectionApplier` — push the latest collection into the source as soon as the map is ready.
- `MapReleaser`, `MapDisposer` — clean teardown on destroy.

## Validation rules

| Rule                                                  | Discard reason            |
| ----------------------------------------------------- | ------------------------- |
| Object is not a Feature / `type !== 'Feature'`        | `NotAFeature`             |
| `geometry.type !== 'Point'`                           | `GeometryNotPoint`        |
| Coordinates are not a `[lon, lat]` tuple              | `InvalidCoordinates`      |
| Coordinates outside WGS84 ranges                      | `CoordinatesOutOfRange`   |
| `properties` missing or not an object                 | `MissingProperties`       |
| `properties.name` missing / not a string              | `InvalidName`             |
| `properties.category` missing / not a string          | `InvalidCategory`         |

The user-facing summary surfaces these counts on import (e.g. `Imported 28 / Discarded 3 (2 coordinates out of range, 1 missing name)`).

## Trade-offs

- **No NgRx / Redux**: a signals store covers the current footprint without ceremony. If the app grew (multiple collections, undo / redo, server sync), introducing a feature-state library would pay off.
- **Filter lives in the App component**: keeps the store pure. If the filter became cross-cutting (URL state, persistence) a dedicated `PoiFilterStore` would be the next refactor.
- **Cluster zoom uses a fixed step**, not `getClusterExpansionZoom`: simpler, avoids the async source query, and works well at the default cluster radius.
- **Snap grid is fixed at 0.0001°** (~11 m). Configurable through `CoordinatesSnapper`'s constructor or the `SNAP_GRID_STEP` constant.
- **No backend**: state lives only in `localStorage`. Replacing `LocalStorageDriverService` with a remote driver bound to `STORAGE_DRIVER` is a one-line provider change.

## Limitations & possible improvements

- Edits keep `category` as a free-text string. A controlled vocabulary (enum or remote taxonomy) would prevent typos.
- Cluster expansion uses a fixed zoom step instead of MapLibre's `getClusterExpansionZoom`.
- Drag-to-move is not implemented; editing coordinates currently happens via re-add. Adding map drag handlers would be straightforward thanks to `PoiStoreService.move()`.
- E2E coverage is missing; the project ships unit tests only.
- Internationalisation is not configured. Strings are English-only.
- Performance has been verified manually with the sample dataset; for large collections the import pipeline (`GeoJsonImporterService`) could be moved to a Web Worker.

## Scaling beyond points

For LineStrings / Polygons the architecture would extend cleanly:
- Add new geometry validators alongside `point-geometry.validator.ts`.
- Introduce per-geometry `PoiFeatureFactory` variants (or a discriminated factory).
- Add dedicated MapLibre layers (`line` / `fill`) registered by `PoiLayerRegistrar`.
- The store, persistence, importer / exporter and filter helpers are geometry-agnostic and need no changes beyond widening the `PoiGeometry` type.

## Time spent

Approximately 6 hours of effective work, including the bonus features (clustering, search, snapping, a11y, unit tests).
