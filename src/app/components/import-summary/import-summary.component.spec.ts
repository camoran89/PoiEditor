import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ImportSummaryComponent } from './import-summary.component';
import { AlertSeverity } from '../../ui/enums/alert-severity.enum';
import { DiscardReason } from '../../core/enums/discard-reason.enum';

const baseSummary = {
  importedCount: 5,
  discardedCount: 0,
  discardedByReason: {
    [DiscardReason.NotAFeature]: 0,
    [DiscardReason.GeometryNotPoint]: 0,
    [DiscardReason.InvalidCoordinates]: 0,
    [DiscardReason.CoordinatesOutOfRange]: 0,
    [DiscardReason.MissingProperties]: 0,
    [DiscardReason.InvalidName]: 0,
    [DiscardReason.InvalidCategory]: 0,
  },
};

describe('ImportSummaryComponent', () => {
  let fixture: ComponentFixture<ImportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportSummaryComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(ImportSummaryComponent);
  });

  it('creates the component', () => {
    fixture.componentRef.setInput('summary', baseSummary);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('severity is Success when there are no discards', () => {
    fixture.componentRef.setInput('summary', { ...baseSummary, discardedCount: 0 });
    fixture.detectChanges();
    const comp = fixture.componentInstance as unknown as { severity: () => AlertSeverity };
    expect(comp.severity()).toBe(AlertSeverity.Success);
  });

  it('severity is Warning when there are discards', () => {
    fixture.componentRef.setInput('summary', { ...baseSummary, discardedCount: 2 });
    fixture.detectChanges();
    const comp = fixture.componentInstance as unknown as { severity: () => AlertSeverity };
    expect(comp.severity()).toBe(AlertSeverity.Warning);
  });

  it('breakdown includes only reasons with count > 0', () => {
    const summary = {
      ...baseSummary,
      discardedCount: 3,
      discardedByReason: {
        ...baseSummary.discardedByReason,
        [DiscardReason.InvalidCoordinates]: 3,
      },
    };
    fixture.componentRef.setInput('summary', summary);
    fixture.detectChanges();
    const comp = fixture.componentInstance as unknown as { breakdown: () => { label: string; count: number }[] };
    expect(comp.breakdown().length).toBe(1);
    expect(comp.breakdown()[0].count).toBe(3);
  });

  it('emits dismissed when triggered', () => {
    fixture.componentRef.setInput('summary', baseSummary);
    fixture.detectChanges();
    const emitSpy = vi.fn();
    fixture.componentInstance.dismissed.subscribe(emitSpy);
    fixture.componentInstance.dismissed.emit();
    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
