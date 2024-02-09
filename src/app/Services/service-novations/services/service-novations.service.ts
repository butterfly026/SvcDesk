import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from 'src/app/model';
import { NovateServiceRequestBody, NovateServiceResponse, NovationContact, ReverseRecentOneRequestBody, ServiceNoavtion } from '../models';



@Injectable({
  providedIn: 'root'
})
export class ServiceNovationsService {

  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) private tokens: TokenInterface,
    @Inject(APP_CONFIG) private config: IAppConfig,
  ) { }

  getServiceNovations(serviceReferenceId: string): Observable<ServiceNoavtion[]> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.get<ServiceNoavtion[]>(
      this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Novations`, 
      { headers, params }
    );
  }

  searchServiceNovationAccounts(serviceReferenceId: number, reqData: Paging): Observable<NovationContact[]> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams({ fromObject: { ...reqData }})
      .set('api-version', '1.2');

    return this.httpClient.get<NovationContact[]>(
      this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Novations/Accounts/Search`, 
      { headers, params }
    );
  }

  novateService(reqData: NovateServiceRequestBody, serviceReferenceId: number): Observable<NovateServiceResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.post<NovateServiceResponse>(
      this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Novations`, 
      reqData,
      { headers, params }
    );
  }

  reverseRecentOne(reqData:ReverseRecentOneRequestBody, serviceReferenceId: number): Observable<{Id: number}> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.post<NovateServiceResponse>(
      this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Novations/Cancel`, 
      reqData,
      { headers, params }
    );
  }
}
