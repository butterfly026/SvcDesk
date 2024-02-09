import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config, } from 'src/app/model';
import { Account, CostCenter, CostCenterConfiguration, GetCostCenterResponse } from '../models';

@Injectable({
  providedIn: 'root'
})

export class ContactsCostCentersService {

  constructor(
    private httpclient: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(Token_config) private tokens: TokenInterface,
  ) { }

  getGeneralLedger(reqData): Observable<Account[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams({ fromObject: { ...reqData} })
      .append('api-version', '1.0')

    return this.httpclient.get<Account[]>(this.config.NewAPIEndPoint + '/GeneralLedger/Accounts', { headers, params });
  }

  getAllCostCenters(eventParam: Paging, contactCode: string): Observable<GetCostCenterResponse> {

    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams({ fromObject: { ...eventParam }})
      .append('api-version', '1.2')

    return this.httpclient.get<GetCostCenterResponse>(this.config.NewAPIEndPoint + '/CostCenters/Contacts/' + contactCode, { headers, params });
  }

  getCostCenter(CostCenterId): Observable<CostCenter> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpclient.get<CostCenter>(this.config.NewAPIEndPoint + '/CostCenters/' + CostCenterId, { headers, params });
  }

  createCostCenter(reqData: CostCenter, ContactCode: string): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken))

    const params = new HttpParams()
      .set('api-version', '1.2')

    return this.httpclient.post<void>(this.config.NewAPIEndPoint + '/CostCenters/Contacts/' + ContactCode, reqData, { headers, params });
  }

  updateCostCenter(reqData: CostCenter, CostCenterId: number): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken))

    const params = new HttpParams()
      .set('api-version', '1.2')

    return this.httpclient.patch<void>(this.config.NewAPIEndPoint + '/CostCenters/' + CostCenterId, reqData, { headers, params });
  }

  deleteCostCenter(CostCenterId): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.2');
    
    return this.httpclient.delete<void>(this.config.NewAPIEndPoint + '/CostCenters/' + CostCenterId, { headers, params });
  }

  getCostCenterConfiguration(): Observable<CostCenterConfiguration> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.2');
    
    return this.httpclient.get<CostCenterConfiguration>(this.config.NewAPIEndPoint + '/CostCenters/Configuration', { headers, params });
  }
}
