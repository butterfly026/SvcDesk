import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Plan } from 'src/app/Shared/models';
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from 'src/app/model';
import { GetAvailablePlansResponse, LifeCyclePhase, ServiceStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServicePlanService {

  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) private tokens: TokenInterface,
    @Inject(APP_CONFIG) private config: IAppConfig,
  ) { }

  getPlan(planId: number): Observable<Plan> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams()
      .set('api-version', '2.0')

    return this.httpClient.get<Plan>(this.config.NewAPIEndPoint + '/Plans/Definitions/' + planId, { headers, params });
  }

  getAvailableServicePlans(ServiceTypeId: string, ContactCode: string, eventParam: Paging): Observable<GetAvailablePlansResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams({ fromObject: { ...eventParam, CurrentOnly: true } })
      .append('api-version', '1.2');

    return this.httpClient.get<GetAvailablePlansResponse>(this.config.NewAPIEndPoint +
      `/Services/ServiceTypes/${ServiceTypeId}/Contacts/${ContactCode}/Plans/Available`, { headers, params });
  }

  getStatuses(ServiceTypeId: string, lifeCyclePhase: LifeCyclePhase): Observable<ServiceStatus[]> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken);

    const params = new HttpParams()
      .set('api-version', '1.2')
      .append('LifeCyclePhase', lifeCyclePhase);

    return this.httpClient.get<ServiceStatus[]>(this.config.NewAPIEndPoint + `/Services/ServiceTypes/${ServiceTypeId}/Statuses`, { headers, params });
  }
}
