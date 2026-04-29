import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { STORAGE_DRIVER } from './core/tokens/storage-driver.token';
import { LocalStorageDriverService } from './services/local-storage-driver.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    { provide: STORAGE_DRIVER, useExisting: LocalStorageDriverService },
  ],
};
