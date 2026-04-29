import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PoiEditorComponent } from './poi-editor.component';

const dialogData = {
  coordinates: [-70.6, -33.4] as [number, number],
  initialName: 'My POI',
  initialCategory: 'park',
  isCreation: false,
};

describe('PoiEditorComponent', () => {
  let fixture: ComponentFixture<PoiEditorComponent>;
  let closeSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    closeSpy = vi.fn();
    await TestBed.configureTestingModule({
      imports: [PoiEditorComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: { close: closeSpy } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PoiEditorComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('title is "Edit point" when isCreation=false', () => {
    const title = (fixture.componentInstance as unknown as { title: string }).title;
    expect(title).toBe('Edit point');
  });

  it('title is "New point" when isCreation=true', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PoiEditorComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { ...dialogData, isCreation: true } },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();
    const fix = TestBed.createComponent(PoiEditorComponent);
    fix.detectChanges();
    const title = (fix.componentInstance as unknown as { title: string }).title;
    expect(title).toBe('New point');
  });

  it('canSubmit is true when name and category are filled', () => {
    const comp = fixture.componentInstance as unknown as { canSubmit: () => boolean };
    expect(comp.canSubmit()).toBe(true);
  });

  it('canSubmit is false when name is empty', () => {
    const comp = fixture.componentInstance as unknown as { canSubmit: () => boolean; name: { set: (v: string) => void } };
    comp.name.set('');
    fixture.detectChanges();
    expect(comp.canSubmit()).toBe(false);
  });

  it('canSubmit is false when category is empty', () => {
    const comp = fixture.componentInstance as unknown as { canSubmit: () => boolean; category: { set: (v: string) => void } };
    comp.category.set('');
    fixture.detectChanges();
    expect(comp.canSubmit()).toBe(false);
  });

  it('onSubmit closes the dialog with trimmed name and category', () => {
    const comp = fixture.componentInstance as unknown as {
      onSubmit: () => void;
      name: { set: (v: string) => void };
    };
    comp.name.set('  Park  ');
    fixture.detectChanges();
    comp.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith({ name: 'Park', category: 'park' });
  });

  it('onSubmit does nothing when canSubmit is false', () => {
    const comp = fixture.componentInstance as unknown as {
      onSubmit: () => void;
      name: { set: (v: string) => void };
    };
    comp.name.set('');
    fixture.detectChanges();
    comp.onSubmit();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('onCancel closes the dialog without a value', () => {
    (fixture.componentInstance as unknown as { onCancel: () => void }).onCancel();
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
