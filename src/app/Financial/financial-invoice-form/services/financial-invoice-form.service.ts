import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class FinancialInvoiceFormService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) private tokens: TokenInterface,
    ) {
    }

    FinantialTransactionsTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/Types', {
            headers: header, params: param
        });
    }

    FinantialTransactionsReasons(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/Reasons', {
            headers: header, params: param
        });
    }

    FinantialTransactionsCategories(typeCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/Categories/Types/' + typeCode, {
            headers: header, params: param
        });
    }

    FinantialTransactionsAddInvoice(reqData, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint +
            '/FInancialTransactions/Invoices/Accounts/' + ContactCode, reqData, {
            headers: header, params: param
        });
    }

    getInvoiceNumber(TypeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('Open', 'true')
            .append('DefaultOnly', 'false')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/FinancialTransactions/Numbers/Types/' + TypeId, {
            headers: header, params: param
        });
    }

    getTermsList(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/Terms/AccountCode/' + ContactCode, {
            headers: header, params: param
        });
    }


}