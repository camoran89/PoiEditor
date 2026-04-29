import { describe, it, expect } from 'vitest';
import { ImportSummaryService } from './import-summary.service';
import { DiscardReason } from '../core/enums/discard-reason.enum';
import { ImportResult } from '../core/interfaces/import-result.interface';
import { GeoJsonType } from '../core/enums/geojson-type.enum';

describe('ImportSummaryService', () => {
  const service = new ImportSummaryService();

  const feature = {
    type: GeoJsonType.Feature as const,
    id: 'poi-1',
    geometry: { type: GeoJsonType.Point as const, coordinates: [-70.6, -33.4] as [number, number] },
    properties: { name: 'A', category: 'park' },
  };

  it('counts imported features', () => {
    const result: ImportResult = { imported: [feature], discarded: [] };
    expect(service.summarize(result).importedCount).toBe(1);
  });

  it('counts discarded features', () => {
    const result: ImportResult = {
      imported: [],
      discarded: [{ index: 0, reason: DiscardReason.InvalidName }],
    };
    expect(service.summarize(result).discardedCount).toBe(1);
  });

  it('groups discarded by reason', () => {
    const result: ImportResult = {
      imported: [],
      discarded: [
        { index: 0, reason: DiscardReason.InvalidName },
        { index: 1, reason: DiscardReason.InvalidName },
      ],
    };
    expect(service.summarize(result).discardedByReason[DiscardReason.InvalidName]).toBe(2);
  });
});
