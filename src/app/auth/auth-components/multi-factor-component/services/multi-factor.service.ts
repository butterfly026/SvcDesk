import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppConfig, APP_CONFIG, Token_config, TokenInterface } from 'src/app/model';

@Injectable({
  providedIn: 'root'
})

export class MultiFactorService {

  constructor(
    public httpClient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) private tokens: TokenInterface,
  ) {
  }

  getPinConfiguration(ContactCode): Observable<string> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');
    const query = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<string>(this.config.NewAPIEndPoint + '/OTT/Contacts/' + ContactCode + '/PIN/Addresses', {
      headers: headers, params: query
    });
  }

  sendPinRequest(ContactCode, reqData): Observable<string> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const query = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.post<string>(this.config.NewAPIEndPoint + '/OTT/Contacts/' + ContactCode + '/PIN/Send', reqData, {
      headers: headers, params: query
    });
  }

  confirmPinValue(ContactCode, reqData, PIN): Observable<string> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const query = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.patch<string>(this.config.NewAPIEndPoint + '/OTT/Contacts/' + ContactCode + '/Consume/PIN/' + PIN, reqData, {
      headers: headers, params: query
    });
  }

}
