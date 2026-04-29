import { describe, it, expect } from 'vitest';
import { PoiCategoryOptionsFactory } from './poi-category-options-factory.helper';
import { POI_CATEGORIES } from '../constants/poi-categories.const';

describe('PoiCategoryOptionsFactory', () => {
  const factory = new PoiCategoryOptionsFactory();

  it('returns one option per POI_CATEGORY', () => {
    expect(factory.build()).toHaveLength(POI_CATEGORIES.length);
  });

  it('each option value matches the category string', () => {
    const options = factory.build();
    POI_CATEGORIES.forEach((cat, i) => {
      expect(options[i].value).toBe(cat);
    });
  });

  it('capitalises the first letter of each label', () => {
    const options = factory.build();
    for (const option of options) {
      expect(option.label[0]).toBe(option.label[0].toUpperCase());
    }
  });

  it('label for "landmark" is "Landmark"', () => {
    const option = factory.build().find((o) => o.value === 'landmark');
    expect(option?.label).toBe('Landmark');
  });
});
