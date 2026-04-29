import { POI_CATEGORIES } from '../constants/poi-categories.const';
import { PoiCategory } from '../types/poi-category.type';
import { SelectOption } from '../../ui/interfaces/select-option.interface';

export class PoiCategoryOptionsFactory {
  build(): readonly SelectOption<PoiCategory>[] {
    return POI_CATEGORIES.map((category) => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
    }));
  }
}
