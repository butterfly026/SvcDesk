import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { ParameterDataItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  getAutoCompleteList(searchString: string, apiPath: string): Observable<ParameterDataItem[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('SearchString', searchString)
      .append('api-version', '1.0'); 

    return this.httpclient.get<ParameterDataItem[]>(this.config.NewAPIEndPoint + apiPath, { headers, params });
  }

  getDataList(apiPath: string): Observable<ParameterDataItem[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0'); 

    return this.httpclient.get<ParameterDataItem[]>(this.config.NewAPIEndPoint + apiPath, { headers, params });
  }
}
