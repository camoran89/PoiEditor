import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { ConfirmDestructiveService } from './confirm-destructive.service';
import { DialogService } from './dialog.service';

describe('ConfirmDestructiveService', () => {
  let service: ConfirmDestructiveService;
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: { open: openSpy } }],
    });
    service = TestBed.inject(ConfirmDestructiveService);
  });

  it('returns true when the dialog resolves to true', async () => {
    openSpy.mockReturnValue(of(true));
    const result = await service.confirm('Title', 'Message', 'Delete');
    expect(result).toBe(true);
  });

  it('returns false when the dialog resolves to false', async () => {
    openSpy.mockReturnValue(of(false));
    const result = await service.confirm('Title', 'Message', 'Delete');
    expect(result).toBe(false);
  });

  it('returns false when the dialog resolves to undefined (dismissed)', async () => {
    openSpy.mockReturnValue(of(undefined));
    const result = await service.confirm('Title', 'Message', 'Delete');
    expect(result).toBe(false);
  });

  it('opens a dialog with the correct title and message', async () => {
    openSpy.mockReturnValue(of(true));
    await service.confirm('My Title', 'My Message', 'Confirm');
    expect(openSpy).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ title: 'My Title', message: 'My Message', confirmLabel: 'Confirm' }),
    }));
  });
});
