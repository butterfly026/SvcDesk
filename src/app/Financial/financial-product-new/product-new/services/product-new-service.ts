import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ProductNewService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    ProductTax(ContactCode, Amount): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Inventory/Taxes/Accounts/' + ContactCode + '/Amount/' + Amount, {
            headers: header,
            params: reqParam
        });
    }

    getProducts(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
            headers: header,
            params: reqParam
        });
    }
}