import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppToolbarComponent } from './app-toolbar.component';

describe('AppToolbarComponent', () => {
  let fixture: ComponentFixture<AppToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppToolbarComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppToolbarComponent);
  });

  it('creates the component', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the title when provided', () => {
    fixture.componentRef.setInput('title', 'POI Editor');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('POI Editor');
  });

  it('renders without title when title is null', () => {
    fixture.componentRef.setInput('title', null);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
