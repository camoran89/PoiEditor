import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PoiListComponent } from './poi-list.component';
import { GeoJsonType } from '../../core/enums/geojson-type.enum';
import { PoiFeature } from '../../core/interfaces/poi-feature.interface';

const features: PoiFeature[] = [
  {
    type: GeoJsonType.Feature,
    id: 'poi-1',
    geometry: { type: GeoJsonType.Point, coordinates: [-70.6, -33.4] },
    properties: { name: 'Central Park', category: 'park' },
  },
  {
    type: GeoJsonType.Feature,
    id: 'poi-2',
    geometry: { type: GeoJsonType.Point, coordinates: [-70.5, -33.5] },
    properties: { name: 'Museum of Art', category: 'museum' },
  },
];

describe('PoiListComponent', () => {
  let fixture: ComponentFixture<PoiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiListComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(PoiListComponent);
    fixture.componentRef.setInput('features', features);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits editRequested with the feature id', () => {
    const spy = vi.fn();
    fixture.componentInstance.editRequested.subscribe(spy);
    fixture.componentInstance.editRequested.emit('poi-1');
    expect(spy).toHaveBeenCalledWith('poi-1');
  });

  it('emits deleteRequested with the feature id', () => {
    const spy = vi.fn();
    fixture.componentInstance.deleteRequested.subscribe(spy);
    fixture.componentInstance.deleteRequested.emit('poi-2');
    expect(spy).toHaveBeenCalledWith('poi-2');
  });
});
