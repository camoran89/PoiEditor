export interface SelectOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
}
