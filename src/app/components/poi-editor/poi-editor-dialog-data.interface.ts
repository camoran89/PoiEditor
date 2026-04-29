import { Coordinates } from '../../core/types/coordinates.type';

export interface PoiEditorDialogData {
  readonly coordinates: Coordinates;
  readonly initialName: string;
  readonly initialCategory: string;
  readonly isCreation: boolean;
}
