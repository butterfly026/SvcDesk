import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { GetServiceSummaryResponse } from "../financial-service-summary.component.type";

@Injectable({
    providedIn: 'root'
})

export class FinancialServiceSummaryService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {}

    FinancialServiceSummary(FinancialId, reqData): Observable<GetServiceSummaryResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.0')

        return this.httpClient.get<GetServiceSummaryResponse>(this.config.NewAPIEndPoint + '/FinancialTransactions/Invoices/ServiceSummaries/' + FinancialId, { headers, params });
    }
}