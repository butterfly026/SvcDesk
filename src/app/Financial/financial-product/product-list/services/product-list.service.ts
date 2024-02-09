import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { Product } from "../product-list.componenttype";

@Injectable({
    providedIn: 'root'
})

export class ProductListService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) private tokens: TokenInterface,
    ) {

    }

    FinantialProducts(FinancialId, reqData): Observable<Product[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.0')

        return this.httpClient.get<Product[]>(this.config.NewAPIEndPoint + '/FinancialTransactions/Invoices/Products/' + FinancialId, { headers, params });
    }
}