import { PoiFeature } from '../interfaces/poi-feature.interface';
import { PoiFilter } from '../interfaces/poi-filter.interface';

export class PoiFilterMatcher {
  matches(feature: PoiFeature, filter: PoiFilter): boolean {
    const query = filter.query.trim().toLowerCase();
    const category = filter.category.trim();
    if (query.length > 0) {
      const name = feature.properties.name.toLowerCase();
      const featureCategory = feature.properties.category.toLowerCase();
      if (!name.includes(query) && !featureCategory.includes(query)) {
        return false;
      }
    }
    if (category.length > 0 && feature.properties.category !== category) {
      return false;
    }
    return true;
  }

  apply(features: readonly PoiFeature[], filter: PoiFilter): readonly PoiFeature[] {
    return features.filter((feature) => this.matches(feature, filter));
  }
}
