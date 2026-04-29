import { Injectable } from '@angular/core';
import { StorageDriver } from '../core/interfaces/storage-driver.interface';

@Injectable({ providedIn: 'root' })
export class LocalStorageDriverService implements StorageDriver {
  read(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  write(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* swallow quota / privacy errors */
    }
  }

  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* swallow */
    }
  }
}
