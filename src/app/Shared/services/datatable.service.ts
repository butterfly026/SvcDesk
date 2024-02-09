import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { DocumentDetail } from 'src/app/Shared/models';

@Injectable({
  providedIn: 'root'
})
export class DatatableService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  saveDocument(fileContent: string, fileName: string, fileType: string): void {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    var downloadUrl = 'data:application/octet-stream;base64,' + fileContent;
    a.href = downloadUrl;
    a.download = `${fileName}.${fileType}`;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  }
}
