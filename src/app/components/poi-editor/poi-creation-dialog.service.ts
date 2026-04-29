import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Coordinates } from '../../core/types/coordinates.type';
import { PoiCreationInput } from '../../core/interfaces/poi-creation-input.interface';
import { PoiUpdateInput } from '../../core/interfaces/poi-update-input.interface';
import { DialogService } from '../../ui/services/dialog.service';
import { PoiEditorComponent } from './poi-editor.component';
import { PoiEditorDialogData } from './poi-editor-dialog-data.interface';

@Injectable({ providedIn: 'root' })
export class PoiCreationDialogService {
  private readonly dialogs = inject(DialogService);

  async open(coordinates: Coordinates): Promise<PoiCreationInput | null> {
    const data: PoiEditorDialogData = {
      coordinates,
      initialName: '',
      initialCategory: '',
      isCreation: true,
    };
    const result = await firstValueFrom(
      this.dialogs.open<PoiEditorDialogData, PoiUpdateInput>({
        component: PoiEditorComponent,
        data,
      })
    );
    if (!result) {
      return null;
    }
    return { coordinates, name: result.name, category: result.category };
  }
}
