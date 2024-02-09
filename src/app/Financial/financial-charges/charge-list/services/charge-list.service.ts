import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { GetChargeInstancesResponse } from "../charge-list.component.type";

@Injectable({
    providedIn: 'root'
})

export class ChargeListService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    FinancialChargeList(FinancialId, reqData): Observable<GetChargeInstancesResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.0')

        return this.httpClient.get<GetChargeInstancesResponse>(this.config.NewAPIEndPoint + '/FinancialTransactions/Invoices/Charges/' + FinancialId, { headers, params });
    }
}