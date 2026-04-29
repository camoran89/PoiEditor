import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageDriverService } from './local-storage-driver.service';

describe('LocalStorageDriverService', () => {
  let service: LocalStorageDriverService;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    const proto = Object.getPrototypeOf(window.localStorage);
    vi.spyOn(proto, 'getItem').mockImplementation((...args: unknown[]) => store[args[0] as string] ?? null);
    vi.spyOn(proto, 'setItem').mockImplementation((...args: unknown[]) => { store[args[0] as string] = args[1] as string; });
    vi.spyOn(proto, 'removeItem').mockImplementation((...args: unknown[]) => { delete store[args[0] as string]; });

    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageDriverService);
  });

  it('returns null when key does not exist', () => {
    expect(service.read('missing')).toBeNull();
  });

  it('writes and reads a value', () => {
    service.write('key', 'value');
    expect(service.read('key')).toBe('value');
  });

  it('removes a key', () => {
    service.write('key', 'value');
    service.remove('key');
    expect(service.read('key')).toBeNull();
  });

  it('does not throw when localStorage throws on read', () => {
    const proto = Object.getPrototypeOf(window.localStorage);
    vi.spyOn(proto, 'getItem').mockImplementation(() => { throw new Error('quota'); });
    expect(() => service.read('key')).not.toThrow();
    expect(service.read('key')).toBeNull();
  });

  it('does not throw when localStorage throws on write', () => {
    const proto = Object.getPrototypeOf(window.localStorage);
    vi.spyOn(proto, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    expect(() => service.write('key', 'val')).not.toThrow();
  });

  it('does not throw when localStorage throws on remove', () => {
    const proto = Object.getPrototypeOf(window.localStorage);
    vi.spyOn(proto, 'removeItem').mockImplementation(() => { throw new Error('quota'); });
    expect(() => service.remove('key')).not.toThrow();
  });
});
