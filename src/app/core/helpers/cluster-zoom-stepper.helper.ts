import { CLUSTER_ZOOM_STEP } from '../constants/cluster-zoom-step.const';
import { CLUSTER_MAX_ZOOM } from '../constants/cluster-max-zoom.const';

export class ClusterZoomStepper {
  next(currentZoom: number): number {
    return Math.min(currentZoom + CLUSTER_ZOOM_STEP, CLUSTER_MAX_ZOOM + CLUSTER_ZOOM_STEP);
  }
}
