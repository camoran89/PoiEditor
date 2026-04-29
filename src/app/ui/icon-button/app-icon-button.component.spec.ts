import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppIconButtonComponent } from './app-icon-button.component';
import { ButtonType } from '../enums/button-type.enum';

describe('AppIconButtonComponent', () => {
  let fixture: ComponentFixture<AppIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIconButtonComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppIconButtonComponent);
    fixture.componentRef.setInput('icon', 'delete');
    fixture.componentRef.setInput('ariaLabel', 'Delete item');
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults to ButtonType.Button', () => {
    expect(fixture.componentInstance.type()).toBe(ButtonType.Button);
  });

  it('defaults to disabled=false', () => {
    expect(fixture.componentInstance.disabled()).toBe(false);
  });

  it('emits clicked output', () => {
    const emitSpy = vi.fn();
    fixture.componentInstance.clicked.subscribe(emitSpy);
    const ev = new MouseEvent('click');
    fixture.componentInstance.clicked.emit(ev);
    expect(emitSpy).toHaveBeenCalledWith(ev);
  });
});
