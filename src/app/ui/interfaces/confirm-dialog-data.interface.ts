import { ButtonVariant } from '../enums/button-variant.enum';

export interface ConfirmDialogData {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly confirmVariant?: ButtonVariant;
}
