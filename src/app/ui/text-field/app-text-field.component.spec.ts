import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppTextFieldComponent } from './app-text-field.component';

describe('AppTextFieldComponent', () => {
  let fixture: ComponentFixture<AppTextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTextFieldComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppTextFieldComponent);
    fixture.componentRef.setInput('label', 'Name');
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits valueChanged when onInput is called', () => {
    const emitSpy = vi.fn();
    fixture.componentInstance.valueChanged.subscribe(emitSpy);
    const event = { target: { value: 'hello' } } as unknown as Event;
    (fixture.componentInstance as unknown as { onInput: (e: Event) => void }).onInput(event);
    expect(emitSpy).toHaveBeenCalledWith('hello');
  });

  it('emits blurred when blurred output fires', () => {
    const emitSpy = vi.fn();
    fixture.componentInstance.blurred.subscribe(emitSpy);
    fixture.componentInstance.blurred.emit();
    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('defaults to value=""', () => {
    expect(fixture.componentInstance.value()).toBe('');
  });
});
