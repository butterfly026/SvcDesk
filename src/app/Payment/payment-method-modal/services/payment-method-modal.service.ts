import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class NewPaymentMethodModalService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    CustomerPaymentMethodStatusChange(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.1');

        const reqBody = {
            From: reqData.From,
            Status: reqData.Status,
            ReOpen: reqData.ReOpen,
            FollowUp: reqData.FollowUp,
            Note: reqData.Note
        }

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/PaymentMethods/' + reqData.Id + '/StatusChange',
            reqBody, { headers: header, params: query }
        );
    }

    CustomerCreditCardPaymentMethodAdd(ContactCode: string, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Contacts/' + ContactCode + '/CreditCards', reqBody, {
            headers: header, params: param
        });
    }

    CustomerBankPaymentMethodAdd(reqBody, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Contacts/' + ContactCode + '/Banks', reqBody, {
            headers: header, params: param
        });
    }

    ValidateCreditCardNumber(CreditCardNumber): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/PaymentMethods/CreditCardNumber/' + CreditCardNumber + '/Validate'
            , { headers: header, params: query }
        );
    }

    ContactPaymentMethodContactCode(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Contacts/'
            + ContactCode, { headers: header, params: query }
        );
    }

    ContactPaymentMethodBusiness(BusinessCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Configurations/BusinessUnitCode/'
            + BusinessCode, { headers: header, params: query }
        );
    }

    PaymentMethodStatuses(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Statuses',
            { headers: header, params: query }
        );
    }

    PaymentMethods(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.1')
            .append('Open', 'true')
            .append('DefaultOnly', 'false');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Contacts/' + ContactCode,
            { headers: header, params: query }
        );
    }

    MakeDefault(PaymentData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.1');

        const reqBody = {
            'Status': PaymentData.Status,
        }

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/PaymentMethods/' + PaymentData.Id + '/MakeDefault',
            reqBody, { headers: header, params: query }
        );
    }

    getPaymentProvider(ContactCode:string, PayCode: string, PaySource: string): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + `/PaymentMethods/Configuration/Contacts/${ContactCode}/Code/${PayCode}/Source/${PaySource}`,
            { headers, params}
        );
    }
}