import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { IdentificationType, ServiceProvider, ValidationResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServiceNewPortingService {

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(Token_config) private tokens: TokenInterface,
  ) { }

  getServiceProviders(): Observable<ServiceProvider[]>  {
    const headers = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
        .set('api-version', '1.2');

    return this.httpClient.get<ServiceProvider[]>(
        this.config.NewAPIEndPoint + '/Services/LCSP', 
        { headers, params }
    );
  }

  getPortingIdentifications(): Observable<IdentificationType[]>  {
    const headers = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
        .set('api-version', '1.1');

    return this.httpClient.get<IdentificationType[]>(
        this.config.NewAPIEndPoint + '/Contacts/IdentificationTypes', 
        { headers, params }
    );
  }

  checkValidationForServiceId(serviceTypeId: string, serviceId: string): Observable<ValidationResponse> {
    const headers = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
        .set('api-version', '1.2');

    return this.httpClient.get<ValidationResponse>(
        this.config.NewAPIEndPoint + `/Services/ServiceTypes/${serviceTypeId}/ServiceId/Validate/${serviceId}`, 
        { headers, params }
    );
  }

}
