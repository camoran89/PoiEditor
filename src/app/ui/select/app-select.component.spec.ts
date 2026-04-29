import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppSelectComponent } from './app-select.component';

describe('AppSelectComponent', () => {
  let fixture: ComponentFixture<AppSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSelectComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppSelectComponent);
    fixture.componentRef.setInput('label', 'Category');
    fixture.componentRef.setInput('options', [
      { label: 'Park', value: 'park' },
      { label: 'Museum', value: 'museum' },
    ]);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults to empty value', () => {
    expect(fixture.componentInstance.value()).toBe('');
  });

  it('emits valueChanged when onSelectionChange is called', () => {
    const emitSpy = vi.fn();
    fixture.componentInstance.valueChanged.subscribe(emitSpy);
    (fixture.componentInstance as unknown as { onSelectionChange: (v: string) => void }).onSelectionChange('park');
    expect(emitSpy).toHaveBeenCalledWith('park');
  });
});
