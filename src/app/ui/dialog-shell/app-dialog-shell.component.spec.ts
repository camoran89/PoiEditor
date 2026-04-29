import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { AppDialogShellComponent } from './app-dialog-shell.component';

describe('AppDialogShellComponent', () => {
  let fixture: ComponentFixture<AppDialogShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDialogShellComponent, MatDialogModule],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppDialogShellComponent);
    fixture.componentRef.setInput('title', 'Edit Point');
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the title', () => {
    expect(fixture.nativeElement.textContent).toContain('Edit Point');
  });
});
