import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfirmDialogComponent } from './app-confirm-dialog.component';
import { ButtonVariant } from '../enums/button-variant.enum';

describe('AppConfirmDialogComponent', () => {
  let fixture: ComponentFixture<AppConfirmDialogComponent>;
  let closeSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    closeSpy = vi.fn();
    await TestBed.configureTestingModule({
      imports: [AppConfirmDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Delete', message: 'Are you sure?', confirmLabel: 'Delete', confirmVariant: ButtonVariant.Danger } },
        { provide: MatDialogRef, useValue: { close: closeSpy } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppConfirmDialogComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('closes with true on confirm', () => {
    (fixture.componentInstance as unknown as { onConfirm: () => void }).onConfirm();
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('closes with false on cancel', () => {
    (fixture.componentInstance as unknown as { onCancel: () => void }).onCancel();
    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('returns the confirmVariant from data', () => {
    const variant = (fixture.componentInstance as unknown as { confirmVariant: ButtonVariant }).confirmVariant;
    expect(variant).toBe(ButtonVariant.Danger);
  });

  it('returns Primary variant when confirmVariant is not set', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AppConfirmDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { title: 'X', message: 'Y', confirmLabel: 'Z' } },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();
    const fix = TestBed.createComponent(AppConfirmDialogComponent);
    fix.detectChanges();
    const variant = (fix.componentInstance as unknown as { confirmVariant: ButtonVariant }).confirmVariant;
    expect(variant).toBe(ButtonVariant.Primary);
  });
});
