import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private santitized: DomSanitizer){}
  transform(value: string, option: 'html' | 'resourceUrl' | 'script' | 'style'): SafeHtml | SafeResourceUrl | SafeScript | SafeStyle {
    switch (option) {
      case 'html':
        return this.santitized.bypassSecurityTrustHtml(value);
      case 'resourceUrl':
        return this.santitized.bypassSecurityTrustResourceUrl(value);
      case 'script':
        return this.santitized.bypassSecurityTrustScript(value);
      case 'style':
        return this.santitized.bypassSecurityTrustStyle(value);
      default:
        return null;
    }
  }

}
