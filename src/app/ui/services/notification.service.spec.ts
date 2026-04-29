import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        { provide: MatSnackBar, useValue: { open: openSpy } },
      ],
    });
    service = TestBed.inject(NotificationService);
  });

  it('calls snackBar.open with the message and Dismiss action', () => {
    service.notify('Hello');
    expect(openSpy).toHaveBeenCalledWith('Hello', 'Dismiss', expect.objectContaining({ duration: 3500 }));
  });

  it('uses the provided duration when given', () => {
    service.notify('Hello', 5000);
    expect(openSpy).toHaveBeenCalledWith('Hello', 'Dismiss', expect.objectContaining({ duration: 5000 }));
  });

  it('centers the snack bar at the bottom', () => {
    service.notify('Hello');
    expect(openSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ horizontalPosition: 'center', verticalPosition: 'bottom' })
    );
  });
});
