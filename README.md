# POI Editor

Editor de puntos de interés (POIs) sobre un mapa MapLibre, construido con Angular 21 (componentes standalone) y Angular Material. La aplicación importa un `FeatureCollection` GeoJSON de puntos, permite agregar / editar / eliminar puntos, persiste el estado en `localStorage` y exporta el resultado como un archivo `.geojson`.

Este proyecto resuelve el desafío técnico descrito en [docs/Desafíos Técnicos.pdf](docs/Desaf%C3%ADos%20T%C3%A9cnicos.pdf).

## Requisitos

- Node.js 20.x o 22.x (LTS)
- npm 10+ (el proyecto fija `npm@11.11.0` mediante `packageManager`)
- Angular CLI 21 (instalado localmente vía la dependencia `@angular/cli`; usar `npx ng ...`)

## Instalar, ejecutar, compilar y testear

```bash
npm install
npx ng serve              # http://localhost:4200
npx ng build              # build de producción (dist/poi-editor)
npx ng build --configuration=development
npx ng test --watch=false # tests unitarios con Vitest
```

Los datos de ejemplo se sirven desde `public/`:
- `public/pois.sample.geojson` — puntos válidos alrededor de Santiago.
- `public/pois.invalid.geojson` — mezcla de features válidas e inválidas para ejercitar el resumen de descarte.

## Funcionalidades

### Obligatorias (MVP)
- Mapa base MapLibre con tiles raster de OSM y atribución visible.
- Importar un `FeatureCollection` GeoJSON de features `Point` desde un archivo local.
- Renderizar los puntos importados en el mapa y en una lista lateral.
- Agregar un nuevo punto haciendo clic en el mapa (modo "Add" toggleable).
- Editar `name` y `category` de cualquier punto mediante un diálogo.
- Eliminar un punto con un diálogo de confirmación.
- Persistir el `FeatureCollection` actual en `localStorage` bajo la clave `poi_editor_state`.
- Auto‑restore del estado guardado al iniciar la app.
- Exportar el estado actual como un archivo `.geojson` descargable.
- Limpiar el estado local (elimina la clave de `localStorage` y reinicia la app).
- Tolerancia a entradas inválidas: las features no válidas se descartan; un resumen indica cuántas se importaron / descartaron y el motivo de cada descarte.

### Extras (bonus del desafío)
- **Búsqueda y filtrado** — búsqueda textual sobre `name`/`category` más filtro por categoría con chips.
- **Clustering** — clustering nativo de MapLibre con burbujas y conteo; al hacer clic sobre un cluster, el mapa hace zoom.
- **Snapping** — toggle para alinear los nuevos puntos a una grilla de 0.0001°.
- **Accesibilidad básica** — `role`/`aria-label` en toolbar, búsqueda, sidebar y mapa; `aria-pressed` en los botones toggle; foco visible; los diálogos de Material atrapan y restauran el foco.
- **Tests unitarios** — specs Vitest para validadores (`latitude`, `longitude`, `coordinates`, `feature`), helpers (`poi-filter-matcher`, `coordinates-snapper`) y el store `PoiStoreService`.

## Arquitectura

El código aplica una separación estricta de responsabilidades y la regla "un solo export por archivo".

```
src/app/
├── core/                # capa de dominio, agnóstica al framework
│   ├── constants/       # valores inmutables (ids de capas, rangos, defaults, paso de snap…)
│   ├── enums/           # GeoJsonType, DiscardReason, StorageKey
│   ├── helpers/         # helpers puros (factories, validadores por composición, snapper, filtro…)
│   ├── interfaces/      # PoiFeature, PoiFeatureCollection, ImportSummary, PoiFilter…
│   ├── tokens/          # injection tokens (StorageDriver)
│   ├── types/           # tipos primitivos branded (Latitude, Longitude, Coordinates, FeatureId)
│   └── validators/      # una clase de validador por concern (compuestas vía constructor)
├── services/            # servicios Angular @Injectable
│   ├── geojson-importer.service.ts
│   ├── geojson-exporter.service.ts
│   ├── import-summary.service.ts
│   ├── local-storage-driver.service.ts
│   ├── map-style-provider.service.ts
│   ├── persistence.service.ts
│   └── poi-store.service.ts        # store reactivo basado en signals
├── ui/                  # wrappers sobre Angular Material (capa única de estilo)
│   ├── button, icon-button, text-field, chip, card, alert,
│   ├── empty-state, file-picker, confirm-dialog, dialog-shell,
│   ├── toolbar, icon
│   └── services/        # DialogService, NotificationService, ConfirmDestructiveService
└── components/          # componentes feature — sólo consumen ui/* (nunca Material directo)
    ├── actions-bar/
    ├── import-summary/
    ├── map/             # MapComponent + helpers/ por cada concern privado
    ├── poi-editor/      # PoiEditorComponent + PoiCreationDialogService
    ├── poi-filter/
    └── poi-list/
```

### Dependencias por capa

```
components ──▶ ui ──▶ Angular Material
       │       │
       └──▶ services ──▶ core
                ▲          │
                └──────────┘
```

- `core/` no tiene dependencias de runtime de Angular (sólo tipos / helpers); puede importarse desde cualquier parte.
- `services/` es la única capa con estado de runtime (`PoiStoreService` usa signals).
- `ui/` es la única capa autorizada a importar `@angular/material`. Los componentes feature consumen `ui/*` en su lugar.
- `components/` orquestan; toda lógica privada relevante se extrae a archivos helper / service por concern.

### Single-Responsibility y "un export por archivo"
Cada archivo bajo `core/`, `ui/`, `components/*/helpers` y los services de diálogo exporta exactamente una cosa. Cada vez que un método privado contenía lógica con sentido propio (por ejemplo, zoom de cluster, dispatch de intents de click, snap por valor, conteo de decimales, apertura de diálogos, confirmación destructiva) se extrajo a un archivo dedicado con un único export.

### Manejo de estado
`PoiStoreService` expone signals (`features`, `count`, computed `collection`) y sólo las operaciones de mutación que requieren los casos de uso (`setAll`, `add`, `update`, `move`, `remove`, `clear`, `findById`). El filtrado se aplica en el componente `App` usando el helper `PoiFilterMatcher` para mantener al store libre de lógica de UI.

### Persistencia
`PersistenceService` depende del injection token `STORAGE_DRIVER`. El binding por defecto es `LocalStorageDriverService`, que implementa la interfaz `StorageDriver`. Cambiar a otro backend (IndexedDB, in-memory para tests, API remota) implica únicamente proveer otro binding del token; los consumidores no cambian.

### Integración con MapLibre
La lógica de render del mapa vive en `components/map/helpers/`:
- `MapInitializer`, `MapStyleProviderService` — inicializan el mapa con tiles OSM y atribución.
- `PoiLayerRegistrar` — registra una fuente GeoJSON con cluster habilitado y tres capas (cluster circles, cluster count, puntos individuales).
- `MapInteractionsBinder`, `MapClickHandler`, `MapClickIntentDispatcher` — convierten `MapMouseEvent`s crudos en `MapClickIntent` tipados (`FeatureSelected | AddPointRequested | ClusterClicked | None`) que el componente consume.
- `ClusterZoomer` + `ClusterZoomStepper` — ejecutan el zoom progresivo cuando se hace clic en un cluster.
- `DeferredCollectionApplier` / `MapCollectionApplier` — empujan la colección actual al source en cuanto el mapa está listo.
- `MapReleaser`, `MapDisposer` — teardown limpio en el destroy.

### Snapping
`CoordinatesSnapper` compone:
- `GridValueSnapper` — alinea un valor numérico a un paso arbitrario.
- `StepDecimalsCounter` — calcula los decimales que mantiene el formato del paso.

## Reglas de validación

| Regla                                                  | Motivo de descarte         |
| ------------------------------------------------------ | -------------------------- |
| El objeto no es Feature / `type !== 'Feature'`         | `NotAFeature`              |
| `geometry.type !== 'Point'`                            | `GeometryNotPoint`         |
| Las coordenadas no son una tupla `[lon, lat]`          | `InvalidCoordinates`       |
| Coordenadas fuera de los rangos WGS84                  | `CoordinatesOutOfRange`    |
| `properties` ausente o no es un objeto                 | `MissingProperties`        |
| `properties.name` ausente / no es string               | `InvalidName`              |
| `properties.category` ausente / no es string           | `InvalidCategory`          |

El resumen visible para el usuario muestra los conteos durante la importación (por ejemplo, `Imported 28 / Discarded 3 (2 coordinates out of range, 1 missing name)`).

## Trade-offs

- **Sin NgRx / Redux**: un store basado en signals es suficiente para el alcance actual sin agregar ceremonia. Si la app creciera (múltiples colecciones, undo/redo, sync con servidor) introducir una librería de estado pagaría la cuota.
- **El filtro vive en el componente App**: mantiene puro al store. Si el filtro se vuelve cross-cutting (estado en URL, persistencia) la siguiente refactor sería un `PoiFilterStore` dedicado.
- **El zoom de cluster usa `getClusterExpansionZoom`** de la fuente GeoJSON de MapLibre para expandir al zoom exacto en que el cluster se rompe; si el id no está disponible se usa un paso de +2 como fallback.
- **El paso de snap es 0.0001°** (~11 m). Configurable a través del constructor de `CoordinatesSnapper` o de la constante `SNAP_GRID_STEP`.
- **Sin backend**: el estado vive sólo en `localStorage`. Reemplazar `LocalStorageDriverService` por un driver remoto enlazado a `STORAGE_DRIVER` es un cambio de provider de una línea.

## Limitaciones y posibles mejoras

## Limitaciones y posibles mejoras

- La edición conserva `category` como vocabulario controlado (`POI_CATEGORIES` + tipo `PoiCategory`); el select usa `AppSelectComponent<PoiCategory>` con opciones tipadas.
- **Drag-to-move implementado:** `MapDragBinder` captura `mousedown` en la capa de POIs, rastrea `mousemove` y emite un `MapDragEvent` en `mouseup` si el puntero se movió; `app.ts` delega a `PoiStoreService.move()`. El `dragPan` del mapa se desactiva durante el arrastre para evitar conflictos.
- No hay tests E2E; el proyecto incluye sólo tests unitarios.
- **i18n implementado:** la infraestructura de Angular Localize está activa (`@angular/localize/init` como polyfill). Los textos de la UI están marcados con atributos `i18n` / `i18n-*`. El archivo de mensajes fuente se encuentra en `src/locale/messages.xlf` y la traducción al español en `src/locale/messages.es.xlf`. Para servir en español: `ng serve --configuration=es`.
- El rendimiento se verificó manualmente con el dataset de ejemplo; para colecciones grandes el pipeline de import (`GeoJsonImporterService`) podría moverse a un Web Worker.

## Cómo escalar más allá de puntos

Para LineStrings / Polygons la arquitectura escala limpiamente:
- Agregar nuevos validadores de geometría junto a `point-geometry.validator.ts`.
- Introducir variantes de `PoiFeatureFactory` por geometría (o una factory discriminada).
- Registrar capas MapLibre dedicadas (`line` / `fill`) desde `PoiLayerRegistrar`.
- El store, la persistencia, el importador / exportador y los helpers de filtro son geometry-agnostic y no requieren cambios más allá de ampliar el tipo `PoiGeometry`.

## Tiempo invertido

Aproximadamente 6 horas efectivas, incluyendo los extras (clustering, búsqueda, snapping, a11y, tests unitarios).
