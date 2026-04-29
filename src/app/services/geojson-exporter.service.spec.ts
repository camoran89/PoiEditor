import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeoJsonExporterService } from './geojson-exporter.service';
import { FileDownloader } from '../core/helpers/file-downloader.helper';
import { GeoJsonStringifier } from '../core/helpers/geojson-stringifier.helper';
import { DEFAULT_EXPORT_FILENAME } from '../core/constants/default-export-filename.const';
import { GeoJsonType } from '../core/enums/geojson-type.enum';
import { PoiFeatureCollection } from '../core/interfaces/poi-feature-collection.interface';

const collection: PoiFeatureCollection = { type: GeoJsonType.FeatureCollection, features: [] };

describe('GeoJsonExporterService', () => {
  let service: GeoJsonExporterService;
  let downloadSpy: ReturnType<typeof vi.spyOn>;
  let stringifySpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    downloadSpy = vi.spyOn(FileDownloader.prototype, 'download').mockImplementation(() => undefined);
    stringifySpy = vi.spyOn(GeoJsonStringifier.prototype, 'stringify').mockReturnValue('{"type":"FeatureCollection"}');
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoJsonExporterService);
  });

  it('stringifies the collection and passes it to the downloader', () => {
    service.export(collection);
    expect(stringifySpy).toHaveBeenCalledWith(collection);
    expect(downloadSpy).toHaveBeenCalledWith(DEFAULT_EXPORT_FILENAME, '{"type":"FeatureCollection"}');
  });

  it('uses the provided filename when given', () => {
    service.export(collection, 'my-export');
    expect(downloadSpy.mock.calls[0][0]).toBe('my-export');
  });

  it('defaults to the default export filename when none is given', () => {
    service.export(collection);
    expect(downloadSpy.mock.calls[0][0]).toBe(DEFAULT_EXPORT_FILENAME);
  });
});
