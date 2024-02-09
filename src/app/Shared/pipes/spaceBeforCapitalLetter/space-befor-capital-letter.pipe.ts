import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceBeforCapitalLetter'
})
export class SpaceBeforCapitalLetterPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/([A-Z])/g, ' $1');
  }

}
