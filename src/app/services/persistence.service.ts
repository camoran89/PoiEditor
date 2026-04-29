import { Injectable, inject } from '@angular/core';
import { StorageKey } from '../core/enums/storage-key.enum';
import { PoiFeatureCollection } from '../core/interfaces/poi-feature-collection.interface';
import { STORAGE_DRIVER } from '../core/tokens/storage-driver.token';
import { GeoJsonStringifier } from '../core/helpers/geojson-stringifier.helper';
import { JsonParser } from '../core/helpers/json-parser.helper';
import { FeatureCollectionValidator } from '../core/validators/feature-collection.validator';
import { FeatureValidator } from '../core/validators/feature.validator';
import { FeatureCollectionFactory } from '../core/helpers/feature-collection-factory.helper';
import { PoiFeature } from '../core/interfaces/poi-feature.interface';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private readonly storage = inject(STORAGE_DRIVER);
  private readonly stringifier = new GeoJsonStringifier();
  private readonly parser = new JsonParser();
  private readonly collectionValidator = new FeatureCollectionValidator();
  private readonly featureValidator = new FeatureValidator();
  private readonly collectionFactory = new FeatureCollectionFactory();

  save(collection: PoiFeatureCollection): void {
    this.storage.write(StorageKey.EditorState, this.stringifier.stringify(collection));
  }

  load(): PoiFeatureCollection | null {
    const raw = this.storage.read(StorageKey.EditorState);
    if (raw === null) {
      return null;
    }
    try {
      const parsed = this.parser.parse(raw);
      if (!this.collectionValidator.isValid(parsed)) {
        return null;
      }
      const valid: PoiFeature[] = [];
      for (const candidate of parsed.features) {
        const result = this.featureValidator.validate(candidate);
        if (typeof result !== 'string') {
          valid.push(result);
        }
      }
      return this.collectionFactory.create(valid);
    } catch {
      return null;
    }
  }

  clear(): void {
    this.storage.remove(StorageKey.EditorState);
  }
}
