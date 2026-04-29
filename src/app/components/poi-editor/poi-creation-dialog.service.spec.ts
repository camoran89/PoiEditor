import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { PoiCreationDialogService } from './poi-creation-dialog.service';
import { DialogService } from '../../ui/services/dialog.service';

describe('PoiCreationDialogService', () => {
  let service: PoiCreationDialogService;
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: { open: openSpy } }],
    });
    service = TestBed.inject(PoiCreationDialogService);
  });

  it('returns a PoiCreationInput when the dialog resolves with an update', async () => {
    openSpy.mockReturnValue(of({ name: 'Park', category: 'park' }));
    const result = await service.open([-70.6, -33.4]);
    expect(result).toEqual({ coordinates: [-70.6, -33.4], name: 'Park', category: 'park' });
  });

  it('returns null when the dialog is dismissed (result is undefined)', async () => {
    openSpy.mockReturnValue(of(undefined));
    const result = await service.open([-70.6, -33.4]);
    expect(result).toBeNull();
  });

  it('opens the dialog with the provided coordinates and creation mode', async () => {
    openSpy.mockReturnValue(of(undefined));
    await service.open([-70.6, -33.4]);
    expect(openSpy).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ coordinates: [-70.6, -33.4], isCreation: true }),
    }));
  });
});
