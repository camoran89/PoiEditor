import { PoiFeature } from '../interfaces/poi-feature.interface';

export class PoiCategoriesExtractor {
  extract(features: readonly PoiFeature[]): readonly string[] {
    const set = new Set<string>();
    for (const feature of features) {
      set.add(feature.properties.category);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
}
