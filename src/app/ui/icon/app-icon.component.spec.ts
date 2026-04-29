import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppIconComponent } from './app-icon.component';

describe('AppIconComponent', () => {
  let fixture: ComponentFixture<AppIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIconComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppIconComponent);
    fixture.componentRef.setInput('name', 'home');
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('exposes the icon name via the name input', () => {
    expect(fixture.componentInstance.name()).toBe('home');
  });
});
