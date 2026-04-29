import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { MAP_DEFAULT_CENTER } from '../../core/constants/map-default-center.const';
import { MAP_DEFAULT_ZOOM } from '../../core/constants/map-default-zoom.const';
import { Coordinates } from '../../core/types/coordinates.type';
import { FeatureId } from '../../core/types/feature-id.type';
import { PoiFeatureCollection } from '../../core/interfaces/poi-feature-collection.interface';
import { MapStyleProviderService } from '../../services/map-style-provider.service';
import { ClusterZoomer } from './helpers/cluster-zoomer.helper';
import { DeferredCollectionApplier } from './helpers/deferred-collection-applier.helper';
import { MapDragBinder } from './helpers/map-drag-binder.helper';
import { MapDragEvent } from './helpers/map-drag-event.interface';
import { MapClickHandler } from './helpers/map-click-handler.helper';
import { MapClickIntentDispatcher } from './helpers/map-click-intent-dispatcher.helper';
import { MapInitializer } from './helpers/map-initializer.helper';
import { MapInteractionsBinder } from './helpers/map-interactions-binder.helper';
import { MapReleaser } from './helpers/map-releaser.helper';
import { PoiLayerRegistrar } from './helpers/poi-layer-registrar.helper';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  host: { class: 'map-host' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  private readonly styleProvider = inject(MapStyleProviderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  private readonly mapInitializer = new MapInitializer();
  private readonly poiLayerRegistrar = new PoiLayerRegistrar();
  private readonly interactionsBinder = new MapInteractionsBinder();
  private readonly clickHandler = new MapClickHandler();
  private readonly clickDispatcher = new MapClickIntentDispatcher();
  private readonly deferredApplier = new DeferredCollectionApplier();
  private readonly releaser = new MapReleaser();
  private readonly clusterZoomer = new ClusterZoomer();
  private readonly dragBinder = new MapDragBinder();

  readonly collection = input.required<PoiFeatureCollection>();
  readonly addModeEnabled = input<boolean>(false);

  readonly mapClicked = output<Coordinates>();
  readonly featureClicked = output<FeatureId>();
  readonly featureMoved = output<MapDragEvent>();

  private map: MapLibreMap | null = null;
  private readyResolver?: () => void;
  private readonly ready: Promise<void> = new Promise((resolve) => {
    this.readyResolver = resolve;
  });

  constructor() {
    effect(() => {
      const collection = this.collection();
      void this.deferredApplier.apply(this.ready, () => this.map, collection);
    });
    this.destroyRef.onDestroy(() => {
      this.releaser.release(this.map);
      this.map = null;
    });
  }

  ngAfterViewInit(): void {
    const map = this.mapInitializer.initialize(
      this.mapContainer().nativeElement,
      this.styleProvider.build(),
      MAP_DEFAULT_CENTER,
      MAP_DEFAULT_ZOOM
    );
    this.map = map;
    map.on('load', () => {
      this.poiLayerRegistrar.register(map);
      this.dragBinder.bind(map, (event) => this.featureMoved.emit(event));
      this.interactionsBinder.bind(map, (event) => {
        const intent = this.clickHandler.handle(map, event, this.addModeEnabled());
        this.clickDispatcher.dispatch(
          intent,
          (id) => this.featureClicked.emit(id),
          (coordinates) => this.mapClicked.emit(coordinates),
          (coordinates, clusterId) => { void this.clusterZoomer.zoomTo(map, coordinates, clusterId); }
        );
      });
      this.readyResolver?.();
    });
  }
}
