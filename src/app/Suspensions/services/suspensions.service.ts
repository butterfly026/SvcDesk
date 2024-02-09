import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { SuspensionRequest, SuspensionResponse, SuspensionType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SuspensionsService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  getSuspensionTypes(serviceReferenceId: string): Observable<SuspensionType[]> {
    const headers = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
        .set('api-version', '1.2'); 

    return this.httpclient.get<SuspensionType[]>(this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/SuspensionTypes`, { headers, params });
  }

  requestSuspension(reqData: SuspensionRequest, serviceReferenceId: string): Observable<SuspensionResponse> {
    const headers = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
        .set('api-version', '1.2'); 

    return this.httpclient.post<SuspensionResponse>(this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Suspensions`, reqData, { headers, params });
  }
}
