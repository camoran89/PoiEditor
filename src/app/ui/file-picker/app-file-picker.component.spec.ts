import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppFilePickerComponent } from './app-file-picker.component';

describe('AppFilePickerComponent', () => {
  let fixture: ComponentFixture<AppFilePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFilePickerComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppFilePickerComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits fileSelected when a file is chosen', () => {
    const file = new File(['{}'], 'data.geojson', { type: 'application/json' });
    const emitSpy = vi.fn();
    fixture.componentInstance.fileSelected.subscribe(emitSpy);
    const event = { target: { files: [file], value: '' } } as unknown as Event;
    (fixture.componentInstance as unknown as { onFileSelected: (e: Event) => void }).onFileSelected(event);
    expect(emitSpy).toHaveBeenCalledWith(file);
  });

  it('does not emit when no file is selected', () => {
    const emitSpy = vi.fn();
    fixture.componentInstance.fileSelected.subscribe(emitSpy);
    const event = { target: { files: [], value: '' } } as unknown as Event;
    (fixture.componentInstance as unknown as { onFileSelected: (e: Event) => void }).onFileSelected(event);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('resets the input value after selection', () => {
    const file = new File(['{}'], 'data.geojson');
    fixture.componentInstance.fileSelected.subscribe(() => undefined);
    const target = { files: [file], value: 'something' };
    const event = { target } as unknown as Event;
    (fixture.componentInstance as unknown as { onFileSelected: (e: Event) => void }).onFileSelected(event);
    expect(target.value).toBe('');
  });
});
