import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PoiFilterComponent } from './poi-filter.component';

describe('PoiFilterComponent', () => {
  let fixture: ComponentFixture<PoiFilterComponent>;

  function setup(categories: string[] = ['park', 'museum'], category = '', query = '') {
    fixture.componentRef.setInput('categories', categories);
    fixture.componentRef.setInput('category', category);
    fixture.componentRef.setInput('query', query);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiFilterComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(PoiFilterComponent);
  });

  it('creates the component', () => {
    setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('categoriesWithAll prepends the empty string category', () => {
    setup(['park', 'museum']);
    const withAll = (fixture.componentInstance as unknown as { categoriesWithAll: () => string[] }).categoriesWithAll();
    expect(withAll[0]).toBe('');
    expect(withAll).toContain('park');
    expect(withAll).toContain('museum');
  });

  it('labelFor returns "All" for empty string', () => {
    setup();
    const comp = fixture.componentInstance as unknown as { labelFor: (c: string) => string };
    expect(comp.labelFor('')).toBe('All');
  });

  it('labelFor returns the category name for non-empty strings', () => {
    setup();
    const comp = fixture.componentInstance as unknown as { labelFor: (c: string) => string };
    expect(comp.labelFor('park')).toBe('park');
  });

  it('isSelected returns true for the active category', () => {
    setup(['park'], 'park');
    const comp = fixture.componentInstance as unknown as { isSelected: (c: string) => boolean };
    expect(comp.isSelected('park')).toBe(true);
  });

  it('isSelected returns false for a different category', () => {
    setup(['park'], 'museum');
    const comp = fixture.componentInstance as unknown as { isSelected: (c: string) => boolean };
    expect(comp.isSelected('park')).toBe(false);
  });

  it('emits the category when clicking an unselected category', () => {
    setup(['park'], '');
    const emitSpy = vi.fn();
    fixture.componentInstance.categoryChanged.subscribe(emitSpy);
    const comp = fixture.componentInstance as unknown as { onCategoryClicked: (c: string) => void };
    comp.onCategoryClicked('park');
    expect(emitSpy).toHaveBeenCalledWith('park');
  });

  it('emits empty string when clicking the already selected category (deselect)', () => {
    setup(['park'], 'park');
    const emitSpy = vi.fn();
    fixture.componentInstance.categoryChanged.subscribe(emitSpy);
    const comp = fixture.componentInstance as unknown as { onCategoryClicked: (c: string) => void };
    comp.onCategoryClicked('park');
    expect(emitSpy).toHaveBeenCalledWith('');
  });
});
