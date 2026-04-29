import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActionsBarComponent } from './actions-bar.component';

describe('ActionsBarComponent', () => {
  let fixture: ComponentFixture<ActionsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsBarComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(ActionsBarComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults addModeEnabled to false', () => {
    expect(fixture.componentInstance.addModeEnabled()).toBe(false);
  });

  it('defaults snapEnabled to false', () => {
    expect(fixture.componentInstance.snapEnabled()).toBe(false);
  });

  it('emits exportRequested when triggered', () => {
    const spy = vi.fn();
    fixture.componentInstance.exportRequested.subscribe(spy);
    fixture.componentInstance.exportRequested.emit();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('emits saveRequested when triggered', () => {
    const spy = vi.fn();
    fixture.componentInstance.saveRequested.subscribe(spy);
    fixture.componentInstance.saveRequested.emit();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('emits clearRequested when triggered', () => {
    const spy = vi.fn();
    fixture.componentInstance.clearRequested.subscribe(spy);
    fixture.componentInstance.clearRequested.emit();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('emits addModeToggled when triggered', () => {
    const spy = vi.fn();
    fixture.componentInstance.addModeToggled.subscribe(spy);
    fixture.componentInstance.addModeToggled.emit();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('emits snapToggled when triggered', () => {
    const spy = vi.fn();
    fixture.componentInstance.snapToggled.subscribe(spy);
    fixture.componentInstance.snapToggled.emit();
    expect(spy).toHaveBeenCalledOnce();
  });
});
