import { InjectionToken } from '@angular/core';
import { StorageDriver } from '../interfaces/storage-driver.interface';

export const STORAGE_DRIVER = new InjectionToken<StorageDriver>('STORAGE_DRIVER');
