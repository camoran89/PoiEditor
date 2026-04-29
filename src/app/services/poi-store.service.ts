import { Injectable, computed, signal } from '@angular/core';
import { Coordinates } from '../core/types/coordinates.type';
import { FeatureId } from '../core/types/feature-id.type';
import { PoiFeature } from '../core/interfaces/poi-feature.interface';
import { PoiFeatureCollection } from '../core/interfaces/poi-feature-collection.interface';
import { PoiCreationInput } from '../core/interfaces/poi-creation-input.interface';
import { PoiUpdateInput } from '../core/interfaces/poi-update-input.interface';
import { FeatureCollectionFactory } from '../core/helpers/feature-collection-factory.helper';
import { PoiFeatureFactory } from '../core/helpers/poi-feature-factory.helper';

@Injectable({ providedIn: 'root' })
export class PoiStoreService {
  private readonly featureFactory = new PoiFeatureFactory();
  private readonly collectionFactory = new FeatureCollectionFactory();
  private readonly featuresSignal = signal<readonly PoiFeature[]>([]);

  readonly features = this.featuresSignal.asReadonly();
  readonly collection = computed<PoiFeatureCollection>(() =>
    this.collectionFactory.create(this.featuresSignal())
  );
  readonly count = computed(() => this.featuresSignal().length);

  setAll(features: readonly PoiFeature[]): void {
    this.featuresSignal.set([...features]);
  }

  add(input: PoiCreationInput): PoiFeature {
    const feature = this.featureFactory.create(input);
    this.featuresSignal.update((current) => [...current, feature]);
    return feature;
  }

  update(id: FeatureId, input: PoiUpdateInput): void {
    this.featuresSignal.update((current) =>
      current.map((feature) =>
        this.featureFactory.hasId(feature, id)
          ? this.featureFactory.withUpdatedProperties(feature, input.name, input.category)
          : feature
      )
    );
  }

  move(id: FeatureId, coordinates: Coordinates): void {
    this.featuresSignal.update((current) =>
      current.map((feature) =>
        this.featureFactory.hasId(feature, id)
          ? this.featureFactory.withUpdatedCoordinates(feature, coordinates)
          : feature
      )
    );
  }

  remove(id: FeatureId): void {
    this.featuresSignal.update((current) =>
      current.filter((feature) => !this.featureFactory.hasId(feature, id))
    );
  }

  clear(): void {
    this.featuresSignal.set([]);
  }

  findById(id: FeatureId): PoiFeature | undefined {
    return this.featuresSignal().find((feature) => this.featureFactory.hasId(feature, id));
  }
}
