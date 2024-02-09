import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'formatString'
})
export class FormatStringPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    
    return value
      .replace(/(\\r\\n|\\n|\\r)/g, "<br>")
      .replace(/(\\t)/g, "&emsp;")
      .replace(/\\+/g, "\\")
      .replace(/\\"+/g, `"`)
      .replace(/"\\+/g, `"`);
  }

}
