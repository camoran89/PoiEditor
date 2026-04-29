import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppChipComponent } from './app-chip.component';

describe('AppChipComponent', () => {
  let fixture: ComponentFixture<AppChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppChipComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppChipComponent);
    fixture.componentRef.setInput('label', 'Parks');
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the label text', () => {
    expect(fixture.nativeElement.textContent).toContain('Parks');
  });
});
