import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppAlertComponent } from './app-alert.component';
import { AlertSeverity } from '../enums/alert-severity.enum';

type AlertInstance = {
  severityClass: () => string;
  iconName: () => string;
};

describe('AppAlertComponent', () => {
  let fixture: ComponentFixture<AppAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAlertComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppAlertComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it.each([
    [AlertSeverity.Success, 'check_circle'],
    [AlertSeverity.Warning, 'warning'],
    [AlertSeverity.Error, 'error'],
    [AlertSeverity.Info, 'info'],
  ])('iconName for %s is %s', (severity, expected) => {
    fixture.componentRef.setInput('severity', severity);
    fixture.detectChanges();
    expect((fixture.componentInstance as unknown as AlertInstance).iconName()).toBe(expected);
  });

  it.each([
    [AlertSeverity.Success, 'app-alert--success'],
    [AlertSeverity.Warning, 'app-alert--warning'],
    [AlertSeverity.Error, 'app-alert--error'],
    [AlertSeverity.Info, 'app-alert--info'],
  ])('severityClass for %s is %s', (severity, expected) => {
    fixture.componentRef.setInput('severity', severity);
    fixture.detectChanges();
    expect((fixture.componentInstance as unknown as AlertInstance).severityClass()).toBe(expected);
  });

  it('emits dismissed output when dismiss button is triggered', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();
    const emitSpy = vi.fn();
    fixture.componentInstance.dismissed.subscribe(emitSpy);
    fixture.componentInstance.dismissed.emit();
    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
