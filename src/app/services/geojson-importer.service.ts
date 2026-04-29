import { Injectable } from '@angular/core';
import { ImportResult } from '../core/interfaces/import-result.interface';
import { DiscardedFeature } from '../core/interfaces/discarded-feature.interface';
import { PoiFeature } from '../core/interfaces/poi-feature.interface';
import { JsonParser } from '../core/helpers/json-parser.helper';
import { TextFileReader } from '../core/helpers/text-file-reader.helper';
import { FeatureCollectionValidator } from '../core/validators/feature-collection.validator';
import { FeatureValidator } from '../core/validators/feature.validator';
import { DiscardReason } from '../core/enums/discard-reason.enum';

@Injectable({ providedIn: 'root' })
export class GeoJsonImporterService {
  private readonly fileReader = new TextFileReader();
  private readonly parser = new JsonParser();
  private readonly collectionValidator = new FeatureCollectionValidator();
  private readonly featureValidator = new FeatureValidator();

  async importFromFile(file: File): Promise<ImportResult> {
    const text = await this.fileReader.read(file);
    return this.importFromText(text);
  }

  importFromText(raw: string): ImportResult {
    const parsed = this.parser.parse(raw);
    if (!this.collectionValidator.isValid(parsed)) {
      throw new Error('Invalid GeoJSON: expected a FeatureCollection.');
    }
    const imported: PoiFeature[] = [];
    const discarded: DiscardedFeature[] = [];
    parsed.features.forEach((candidate, index) => {
      const result = this.featureValidator.validate(candidate);
      if (typeof result === 'string') {
        discarded.push({ index, reason: result as DiscardReason });
        return;
      }
      imported.push(result);
    });
    return { imported, discarded };
  }
}
