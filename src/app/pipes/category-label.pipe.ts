import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'categoryLabel', standalone: true })
export class CategoryLabelPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value
      .replace(/[_\-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
