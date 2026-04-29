import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppCardComponent } from './app-card.component';
import { AppearanceVariant } from '../enums/appearance-variant.enum';

describe('AppCardComponent', () => {
  let fixture: ComponentFixture<AppCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCardComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppCardComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('materialAppearance is "outlined" for Outlined variant', () => {
    fixture.componentRef.setInput('appearance', AppearanceVariant.Outlined);
    fixture.detectChanges();
    expect((fixture.componentInstance as never as { materialAppearance: () => string }).materialAppearance()).toBe('outlined');
  });

  it('materialAppearance is "raised" for Filled variant', () => {
    fixture.componentRef.setInput('appearance', AppearanceVariant.Filled);
    fixture.detectChanges();
    expect((fixture.componentInstance as never as { materialAppearance: () => string }).materialAppearance()).toBe('raised');
  });
});
