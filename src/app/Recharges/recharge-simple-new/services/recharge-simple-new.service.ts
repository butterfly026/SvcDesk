import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  RechargeSimpleNewItem, CustomerPaymentMethodListItem, RechargeAddNew, RechargeAdd, DefaultServiceResponse, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RechargeSimpleNewService {


    newRechargeAdd: RechargeAdd;

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getAvailList(CategoryId): Observable<RechargeSimpleNewItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        let realParam;

        const reqParam1 = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('CategoryId', CategoryId);

        const reqParam2 = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)

        if (CategoryId === '1' || CategoryId === '2') {
            realParam = reqParam1;
        } else {
            realParam = reqParam2;
        }

        return this.httpclient.get<RechargeSimpleNewItem[]>(this.config.APIEndPoint + 'Recharges.svc/rest/ContactAvailableRechargeList',
            { headers: header, params: realParam }
        );

    }

    addNewRecharge(reqData): Observable<CustomerPaymentMethodListItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));


        const reqParam1 = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('Open', 'true')

        return this.httpclient.get<CustomerPaymentMethodListItem[]>(this.config.APIEndPoint + 'Payments.svc/rest/CustomerCreditCardPaymentMethodList',
            { headers: header, params: reqParam1 }
        );

    }

    addNewRechargeNew(reqData: RechargeAdd): Observable<RechargeAddNew> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        this.newRechargeAdd = reqData;

        return this.httpclient.post<RechargeAddNew>(this.config.APIEndPoint + 'Recharges.svc/rest/ServiceRechargePaymentWithPaymentMethod',
            this.newRechargeAdd, { headers: header }
        );
    }

    CalculateSurcharge(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/contactpaymentmethods/CalculateSurcharge/'
            + 'ProviderId:' + reqData.ProviderId + '/Code:' + reqData.PaymentMethodCode + '/Amount:' + reqData.PaymentRequestAmount,
            { headers: header, params: query }
        );
    }

    DefaultService(): Observable<DefaultServiceResponse> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam2 = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
        // return this.httpclient.get<DefaultServiceResponse[]>(this.config.MockingAPIEndPoint + 'Services/1.0.0/DefaultService',
        //     { headers: header }
        // );

        return this.httpclient.get<DefaultServiceResponse>(this.config.APIEndPoint + 'Services.svc/rest/DefaultService',
            { headers: header, params: reqParam2 }
        );
    }

}
