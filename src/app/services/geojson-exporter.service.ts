import { Injectable } from '@angular/core';
import { DEFAULT_EXPORT_FILENAME } from '../core/constants/default-export-filename.const';
import { PoiFeatureCollection } from '../core/interfaces/poi-feature-collection.interface';
import { FileDownloader } from '../core/helpers/file-downloader.helper';
import { GeoJsonStringifier } from '../core/helpers/geojson-stringifier.helper';

@Injectable({ providedIn: 'root' })
export class GeoJsonExporterService {
  private readonly stringifier = new GeoJsonStringifier();
  private readonly downloader = new FileDownloader();

  export(collection: PoiFeatureCollection, filename: string = DEFAULT_EXPORT_FILENAME): void {
    this.downloader.download(filename, this.stringifier.stringify(collection));
  }
}
