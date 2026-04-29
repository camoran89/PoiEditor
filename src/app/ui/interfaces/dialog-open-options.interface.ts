import { ComponentType } from '@angular/cdk/portal';

export interface DialogOpenOptions<TData> {
  readonly component: ComponentType<unknown>;
  readonly data?: TData;
  readonly width?: string;
}
