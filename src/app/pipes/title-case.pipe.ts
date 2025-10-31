import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  pure: true
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';
    
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}