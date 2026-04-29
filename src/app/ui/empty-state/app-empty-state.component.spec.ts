import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppEmptyStateComponent } from './app-empty-state.component';

describe('AppEmptyStateComponent', () => {
  let fixture: ComponentFixture<AppEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppEmptyStateComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppEmptyStateComponent);
    fixture.componentRef.setInput('message', 'No items found');
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the message', () => {
    expect(fixture.nativeElement.textContent).toContain('No items found');
  });

  it('exposes the icon via the icon input when provided', () => {
    fixture.componentRef.setInput('icon', 'inbox');
    fixture.detectChanges();
    expect(fixture.componentInstance.icon()).toBe('inbox');
  });
});
