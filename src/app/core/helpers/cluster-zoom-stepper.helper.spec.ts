import { describe, it, expect } from 'vitest';
import { ClusterZoomStepper } from './cluster-zoom-stepper.helper';
import { CLUSTER_ZOOM_STEP } from '../constants/cluster-zoom-step.const';
import { CLUSTER_MAX_ZOOM } from '../constants/cluster-max-zoom.const';

describe('ClusterZoomStepper', () => {
  const stepper = new ClusterZoomStepper();

  it('adds CLUSTER_ZOOM_STEP to the current zoom', () => {
    expect(stepper.next(5)).toBe(5 + CLUSTER_ZOOM_STEP);
  });

  it('does not exceed CLUSTER_MAX_ZOOM + CLUSTER_ZOOM_STEP', () => {
    expect(stepper.next(CLUSTER_MAX_ZOOM + 10)).toBe(CLUSTER_MAX_ZOOM + CLUSTER_ZOOM_STEP);
  });

  it('returns CLUSTER_MAX_ZOOM + CLUSTER_ZOOM_STEP when at max', () => {
    expect(stepper.next(CLUSTER_MAX_ZOOM)).toBe(CLUSTER_MAX_ZOOM + CLUSTER_ZOOM_STEP);
  });
});
