export interface PoiProperties {
  readonly name: string;
  readonly category: string;
  readonly [key: string]: unknown;
}
