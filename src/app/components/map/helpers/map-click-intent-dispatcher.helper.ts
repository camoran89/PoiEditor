import { Coordinates } from '../../../core/types/coordinates.type';
import { FeatureId } from '../../../core/types/feature-id.type';
import { MapClickIntent } from './map-click-intent.interface';
import { MapClickIntentType } from './map-click-intent-type.enum';

export class MapClickIntentDispatcher {
  dispatch(
    intent: MapClickIntent,
    onFeatureSelected: (id: FeatureId) => void,
    onAddPointRequested: (coordinates: Coordinates) => void,
    onClusterClicked: (coordinates: Coordinates) => void
  ): void {
    switch (intent.type) {
      case MapClickIntentType.FeatureSelected:
        if (intent.featureId !== undefined) {
          onFeatureSelected(intent.featureId);
        }
        return;
      case MapClickIntentType.AddPointRequested:
        if (intent.coordinates !== undefined) {
          onAddPointRequested(intent.coordinates);
        }
        return;
      case MapClickIntentType.ClusterClicked:
        if (intent.coordinates !== undefined) {
          onClusterClicked(intent.coordinates);
        }
        return;
      case MapClickIntentType.None:
      default:
        return;
    }
  }
}
