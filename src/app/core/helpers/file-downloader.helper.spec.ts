import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileDownloader } from './file-downloader.helper';
import { GEOJSON_FILE_EXTENSION } from '../constants/geojson-file-extension.const';
import { GEOJSON_MIME_TYPE } from '../constants/geojson-mime-type.const';

describe('FileDownloader', () => {
  let downloader: FileDownloader;
  let anchor: HTMLAnchorElement;
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    downloader = new FileDownloader();
    clickSpy = vi.fn();
    anchor = { href: '', download: '', click: clickSpy } as unknown as HTMLAnchorElement;
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as never);
    vi.spyOn(document.body, 'appendChild').mockImplementation((n) => n as never);
    vi.spyOn(document.body, 'removeChild').mockImplementation((n) => n as never);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  it('creates an anchor and clicks it', () => {
    downloader.download('export', 'content');
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it('appends then removes the anchor from the body', () => {
    downloader.download('export', 'content');
    expect(document.body.appendChild).toHaveBeenCalledWith(anchor);
    expect(document.body.removeChild).toHaveBeenCalledWith(anchor);
  });

  it('revokes the object URL after click', () => {
    downloader.download('export', 'content');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake-url');
  });

  it('appends the GeoJSON extension when not present', () => {
    downloader.download('myfile', 'content');
    expect(anchor.download).toBe(`myfile${GEOJSON_FILE_EXTENSION}`);
  });

  it('does not duplicate the extension when already present', () => {
    downloader.download(`myfile${GEOJSON_FILE_EXTENSION}`, 'content');
    expect(anchor.download).toBe(`myfile${GEOJSON_FILE_EXTENSION}`);
  });

  it('creates the Blob with the correct MIME type', () => {
    let capturedArgs: unknown[] = [];
    const blobSpy = vi.spyOn(globalThis, 'Blob').mockImplementation(
      class {
        constructor(...args: unknown[]) { capturedArgs = args; }
      } as unknown as typeof Blob
    );
    downloader.download('f', 'data');
    expect(capturedArgs[0]).toEqual(['data']);
    expect((capturedArgs[1] as { type: string }).type).toBe(GEOJSON_MIME_TYPE);
    blobSpy.mockRestore();
  });
});
