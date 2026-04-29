import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppButtonComponent } from './app-button.component';
import { ButtonVariant } from '../enums/button-variant.enum';

describe('AppButtonComponent', () => {
  let fixture: ComponentFixture<AppButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppButtonComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppButtonComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults to Primary variant', () => {
    expect(fixture.componentInstance.variant()).toBe(ButtonVariant.Primary);
  });

  it('defaults to disabled=false', () => {
    expect(fixture.componentInstance.disabled()).toBe(false);
  });

  it('emits clicked when the output fires', () => {
    const emitSpy = vi.fn();
    fixture.componentInstance.clicked.subscribe(emitSpy);
    const ev = new MouseEvent('click');
    fixture.componentInstance.clicked.emit(ev);
    expect(emitSpy).toHaveBeenCalledWith(ev);
  });
});
