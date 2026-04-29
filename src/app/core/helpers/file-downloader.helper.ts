import { GEOJSON_FILE_EXTENSION } from '../constants/geojson-file-extension.const';
import { GEOJSON_MIME_TYPE } from '../constants/geojson-mime-type.const';

export class FileDownloader {
  download(filename: string, contents: string): void {
    const blob = new Blob([contents], { type: GEOJSON_MIME_TYPE });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename.endsWith(GEOJSON_FILE_EXTENSION)
      ? filename
      : `${filename}${GEOJSON_FILE_EXTENSION}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
}
