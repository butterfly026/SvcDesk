import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetTransactionRatesResponse, Plan } from "src/app/Shared/models";
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class PlanDetailService {
  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) private tokens: TokenInterface,
    @Inject(APP_CONFIG) private config: IAppConfig,
  ) { }

  getPlan(planId): Observable<Plan> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams()
      .set('api-version', '2.0')

    return this.httpClient.get<Plan>(this.config.NewAPIEndPoint + '/Plans/Definitions/' + planId, { headers, params });
  }

  getPlansTransactionRates(eventParam: Paging, planId: number): Observable<GetTransactionRatesResponse> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const params = new HttpParams({fromObject: { ...eventParam }})
        .append('api-version', '1.2')

    return this.httpClient.get<GetTransactionRatesResponse>(this.config.NewAPIEndPoint + '/Services/Plans/' + planId + '/TransactionRates', { headers, params });
  }
}