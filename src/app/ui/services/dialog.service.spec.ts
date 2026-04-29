import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DialogService } from './dialog.service';
import { Component } from '@angular/core';

@Component({ selector: 'app-stub', template: '', standalone: true })
class StubComponent {}

describe('DialogService', () => {
  let service: DialogService;
  let mockDialogRef: Partial<MatDialogRef<unknown, unknown>>;
  let openSpy: ReturnType<typeof vi.fn>;
  let closeAllSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDialogRef = { afterClosed: vi.fn().mockReturnValue(of('result')) };
    openSpy = vi.fn().mockReturnValue(mockDialogRef);
    closeAllSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        { provide: MatDialog, useValue: { open: openSpy, closeAll: closeAllSpy } },
      ],
    });
    service = TestBed.inject(DialogService);
  });

  it('opens a dialog and returns the afterClosed observable', () => {
    let result: unknown;
    service.open({ component: StubComponent, data: null }).subscribe((r) => { result = r; });
    expect(result).toBe('result');
    expect(openSpy).toHaveBeenCalledOnce();
  });

  it('passes component and data to MatDialog', () => {
    const data = { foo: 'bar' };
    service.open({ component: StubComponent, data });
    expect(openSpy).toHaveBeenCalledWith(StubComponent, expect.objectContaining({ data }));
  });

  it('uses the default width of 420px when not specified', () => {
    service.open({ component: StubComponent, data: null });
    expect(openSpy).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ width: '420px' }));
  });

  it('uses the custom width when specified', () => {
    service.open({ component: StubComponent, data: null, width: '600px' });
    expect(openSpy).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ width: '600px' }));
  });

  it('closeAll delegates to MatDialog.closeAll', () => {
    service.closeAll();
    expect(closeAllSpy).toHaveBeenCalledOnce();
  });
});
