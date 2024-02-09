import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { ServiceAttribute, ValidationResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServiceAttributesService {

  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) private tokens: TokenInterface,
    @Inject(APP_CONFIG) private config: IAppConfig,
  ) { }

  getAttributes(ServiceTypeId: string): Observable<ServiceAttribute[]> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.get<ServiceAttribute[]>(
      this.config.NewAPIEndPoint + `/Services/ServiceTypes/${ServiceTypeId}/Attributes/Definitions`,
     { headers, params }
    );
  }

  checkValidation(ServiceTypeId: string, AttributeId: number, Value: string): Observable<ValidationResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.get<ValidationResponse>(
      this.config.NewAPIEndPoint + `/Services/Attributes/ServiceTypes/${ServiceTypeId}/Definitions/${AttributeId}/Validate/${encodeURIComponent(Value)}`, 
      { headers, params }
    );
  }
}
