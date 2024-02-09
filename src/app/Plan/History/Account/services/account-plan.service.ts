import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PlanInstance } from 'src/app/Shared/models';
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from 'src/app/model';
import { PlanChangeRequestBody } from '../models';
import { GetAvailablePlansResponse, PlanChangeConfiguration, PlanChangePeriod, ScheduledPlan, ServiceDetailBasic } from '../../Service/models';

@Injectable({
  providedIn: 'root'
})

export class AccountPlanService {

  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) private tokens: TokenInterface,
    @Inject(APP_CONFIG) private config: IAppConfig,
  ) { }

  getAccountPlans(contactCode: string): Observable<PlanInstance[]> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams()
      .set('api-version', '1.0')

    return this.httpClient.get<PlanInstance[]>(
      this.config.NewAPIEndPoint + `/Accounts/${contactCode}/Plans`, 
      { headers, params }
    );
  }
  
  createPlanChangeRequest(contactCode: string, reqData: PlanChangeRequestBody): Observable<{ Id: number }> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpClient.post<{ Id: number }>(
      this.config.NewAPIEndPoint + `/Accounts/${contactCode}/PlanChanges`, 
      reqData, 
      { headers, params }
    );
  }

  deleteScheduledPlanChange(planId: number): Observable<void> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpClient.delete<void>(
      this.config.NewAPIEndPoint + `/Accounts/PlanChanges/${planId}`, 
      { headers, params }
    );
  }

  getAccountPlanNextPeriod(contactCode: string): Observable<PlanChangePeriod> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpClient.get<PlanChangePeriod>(
      this.config.NewAPIEndPoint + `/Accounts/${contactCode}/Plans/NextPeriod`,
      { headers, params }
    );
  }

  getAccountPlanChangeScheduled(contactCode: string): Observable<ScheduledPlan[]> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const reqParams = new HttpParams()
        .set('api-version', '1.2');

    return this.httpClient.get<ScheduledPlan[]>(
      this.config.NewAPIEndPoint + `/Accounts/${contactCode}/PlanChanges/Scheduled`,
      { headers: header, params: reqParams }
    );
  }

  getAvailableAccountPlans(contactCode: string, eventParam: Paging): Observable<GetAvailablePlansResponse> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams({ fromObject: {...eventParam} })
        .append('api-version', '1.0');

    return this.httpClient.get<GetAvailablePlansResponse>(
      this.config.NewAPIEndPoint + `/Accounts/${contactCode}/Plans/Available`, 
      { headers, params }
    );
  }

  getServiceDetail(contactCode: string): Observable<ServiceDetailBasic> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);
    
    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.get<ServiceDetailBasic>(
      this.config.NewAPIEndPoint + `/Services/${contactCode}/Basic`, 
      { headers, params }
    );
  }

  getPlanChangeConfiguration(serviceTypeId): Observable<PlanChangeConfiguration> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);
    
    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.get<PlanChangeConfiguration>(
      this.config.NewAPIEndPoint + `/Services/ServiceTypes/${serviceTypeId}/PlanChanges/Configurations`, 
      { headers, params }
    );
  }

}