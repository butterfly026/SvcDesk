import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from 'src/app/model';
import { BillingCycle, CreditStatus, GetChannelPartnersResponse, Tax, TimeZone } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccountOptionsService {

  constructor(
    private httpclient: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(Token_config) private tokens: TokenInterface,
  ) {}
  
  getBillingCycles(businessUnitCode: string): Observable<BillingCycle[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpclient.get<BillingCycle[]>(
      this.config.NewAPIEndPoint + `/Accounts/BillCycles/Available/BusinessUnitCode/${businessUnitCode}`, 
      { headers, params }
    );
  }

  getTaxes(): Observable<Tax[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpclient.get<Tax[]>(
      this.config.NewAPIEndPoint + `/Accounts/Taxes`, 
      { headers, params }
    );
  }

  getDefaultTimeZones(): Observable<TimeZone[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpclient.get<TimeZone[]>(
      this.config.NewAPIEndPoint + `/Timezones/Default`, 
      { headers, params }
    );
  }

  getCreditStatuses(): Observable<CreditStatus[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpclient.get<CreditStatus[]>(
      this.config.NewAPIEndPoint + `/Timezones/Default`, 
      { headers, params }
    );
  }

  getChannelPartners(eventParam: Paging): Observable<GetChannelPartnersResponse> {
    const header = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const reqParam = new HttpParams({ fromObject: { ...eventParam }})
        .append('api-version', '1.2');

    return this.httpclient.get<GetChannelPartnersResponse>(this.config.NewAPIEndPoint + "/ChannelPartners", {
        headers: header,
        params: reqParam
    });
}
}
