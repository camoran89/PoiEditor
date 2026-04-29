import { describe, it, expect, vi } from 'vitest';
import { MapClickIntentDispatcher } from './map-click-intent-dispatcher.helper';
import { MapClickIntentType } from './map-click-intent-type.enum';
import { MapClickIntent } from './map-click-intent.interface';

describe('MapClickIntentDispatcher', () => {
  const dispatcher = new MapClickIntentDispatcher();

  function makeCallbacks() {
    return {
      onFeatureSelected: vi.fn(),
      onAddPointRequested: vi.fn(),
      onClusterClicked: vi.fn(),
    };
  }

  it('calls onFeatureSelected for FeatureSelected intent', () => {
    const { onFeatureSelected, onAddPointRequested, onClusterClicked } = makeCallbacks();
    const intent: MapClickIntent = { type: MapClickIntentType.FeatureSelected, featureId: 'poi-1' };
    dispatcher.dispatch(intent, onFeatureSelected, onAddPointRequested, onClusterClicked);
    expect(onFeatureSelected).toHaveBeenCalledWith('poi-1');
    expect(onAddPointRequested).not.toHaveBeenCalled();
  });

  it('calls onAddPointRequested for AddPointRequested intent', () => {
    const { onFeatureSelected, onAddPointRequested, onClusterClicked } = makeCallbacks();
    const intent: MapClickIntent = { type: MapClickIntentType.AddPointRequested, coordinates: [-70.6, -33.4] };
    dispatcher.dispatch(intent, onFeatureSelected, onAddPointRequested, onClusterClicked);
    expect(onAddPointRequested).toHaveBeenCalledWith([-70.6, -33.4]);
  });

  it('calls onClusterClicked for ClusterClicked intent with clusterId', () => {
    const { onFeatureSelected, onAddPointRequested, onClusterClicked } = makeCallbacks();
    const intent: MapClickIntent = { type: MapClickIntentType.ClusterClicked, coordinates: [-70.6, -33.4], clusterId: 7 };
    dispatcher.dispatch(intent, onFeatureSelected, onAddPointRequested, onClusterClicked);
    expect(onClusterClicked).toHaveBeenCalledWith([-70.6, -33.4], 7);
  });

  it('calls onClusterClicked with undefined clusterId when not set', () => {
    const { onFeatureSelected, onAddPointRequested, onClusterClicked } = makeCallbacks();
    const intent: MapClickIntent = { type: MapClickIntentType.ClusterClicked, coordinates: [-70.6, -33.4] };
    dispatcher.dispatch(intent, onFeatureSelected, onAddPointRequested, onClusterClicked);
    expect(onClusterClicked).toHaveBeenCalledWith([-70.6, -33.4], undefined);
  });

  it('does nothing for None intent', () => {
    const { onFeatureSelected, onAddPointRequested, onClusterClicked } = makeCallbacks();
    const intent: MapClickIntent = { type: MapClickIntentType.None };
    dispatcher.dispatch(intent, onFeatureSelected, onAddPointRequested, onClusterClicked);
    expect(onFeatureSelected).not.toHaveBeenCalled();
    expect(onAddPointRequested).not.toHaveBeenCalled();
    expect(onClusterClicked).not.toHaveBeenCalled();
  });

  it('does not call onFeatureSelected when featureId is undefined', () => {
    const { onFeatureSelected, onAddPointRequested, onClusterClicked } = makeCallbacks();
    const intent: MapClickIntent = { type: MapClickIntentType.FeatureSelected };
    dispatcher.dispatch(intent, onFeatureSelected, onAddPointRequested, onClusterClicked);
    expect(onFeatureSelected).not.toHaveBeenCalled();
  });
});
