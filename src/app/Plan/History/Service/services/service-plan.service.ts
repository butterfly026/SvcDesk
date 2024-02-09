import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetTransactionRatesResponse, Plan, PlanInstance } from 'src/app/Shared/models';
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from 'src/app/model';
import { GetAvailablePlansResponse, PlanChangeConfiguration, PlanChangePeriod, ScheduledPlan, ServiceDetailBasic } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServicePlanService {

  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) private tokens: TokenInterface,
    @Inject(APP_CONFIG) private config: IAppConfig,
  ) { }

  getPlan(serviceReferenceId: number, planId: number): Observable<Plan> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams()
      .set('api-version', '1.2')

    return this.httpClient.get<Plan>(this.config.NewAPIEndPoint + '/Services/' + serviceReferenceId + '/Plans/Definitions/' + planId, { headers, params });
  }

  getPlanHistory(serviceReferenceId: string): Observable<PlanInstance[]> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams()
      .set('api-version', '1.2')

    return this.httpClient.get<PlanInstance[]>(this.config.NewAPIEndPoint + '/Services/' + serviceReferenceId + '/Plans/History', { headers, params });
  }

  getAvailableServicePlans(serviceReferenceId: number, eventParam: Paging): Observable<GetAvailablePlansResponse> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams({ fromObject: {...eventParam} })
        .append('api-version', '1.2');

    return this.httpClient.get<GetAvailablePlansResponse>(this.config.NewAPIEndPoint + '/Services/' + serviceReferenceId + '/Plans/Available', { headers, params });
}


  getPlansTransactionRates(eventParam: Paging, planId: number): Observable<GetTransactionRatesResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams({fromObject: { ...eventParam }})
      .append('api-version', '1.2')

    return this.httpClient.get<GetTransactionRatesResponse>(this.config.NewAPIEndPoint + '/Services/Plans/' + planId + '/TransactionRates', { headers, params });
  }

  getServicePlanNextPeriod(serviceReferenceId): Observable<PlanChangePeriod> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams()
        .set('api-version', '1.2');

    return this.httpClient.get<PlanChangePeriod>(this.config.NewAPIEndPoint + '/Services/' + serviceReferenceId + '/Plans/NextPeriod', { headers, params });
  }

  getServicePlanChangeScheduled(serviceReferenceId): Observable<ScheduledPlan[]> {
      const header = new HttpHeaders()
          .set('Authorization', this.tokens.AccessToken)

      const reqParams = new HttpParams()
          .set('api-version', '1.2');

      return this.httpClient.get<ScheduledPlan[]>(this.config.NewAPIEndPoint + '/Services/' + serviceReferenceId + '/PlanChanges/Scheduled',
          { headers: header, params: reqParams });
  }

  createPlanChangeRequest(serviceReferenceId, reqData): Observable<{ Id: number }> {
      const headers = new HttpHeaders()
          .set('Authorization', this.tokens.AccessToken)

      const params = new HttpParams()
          .set('api-version', '1.2');

      return this.httpClient.post<{ Id: number }>(this.config.NewAPIEndPoint + '/Services/' + serviceReferenceId + '/PlanChanges', reqData, { headers, params });
  }


  deleteScheduledPlanChange(planId): Observable<void> {
      const headers = new HttpHeaders()
          .set('Authorization', this.tokens.AccessToken)

      const params = new HttpParams()
          .set('api-version', '1.2');

      return this.httpClient.delete<void>(this.config.NewAPIEndPoint + '/Services/PlanChanges/' + planId, { headers, params });
  }

  getServiceDetail(serviceReferenceId): Observable<ServiceDetailBasic> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);
    
    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.get<ServiceDetailBasic>(this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Basic`, { headers, params });
  }

  getPlanChangeConfiguration(serviceTypeId): Observable<PlanChangeConfiguration> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);
    
    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.get<PlanChangeConfiguration>(this.config.NewAPIEndPoint + `/Services/ServiceTypes/${serviceTypeId}/PlanChanges/Configurations`, { headers, params });
  }
}
