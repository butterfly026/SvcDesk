import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

// const stripe = new Stripe('sk_test_DwIttaOIKjsHHw46zqC37igI', {
//     apiVersion: '2020-08-27',
//     httpAgent: null
// });

@Injectable({
    providedIn: 'root'
})

export class StripeComponentService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    ValidateCreditCardNumber(CreditCardNumber): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/contactpaymentmethods/ValidateCreditCard/CreditCardNumber:'
            + CreditCardNumber, { headers: header, params: query }
        );
    }
    createCustomer(customerEmail): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.post<any>('http://localhost:4242/create-customer', JSON.stringify({ email: customerEmail }),
            { headers: header, params: query }
        );
    }

    createPaymentMethod(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.post<any>('http://localhost:4242/create-payment-method', JSON.stringify(reqData),
            { headers: header, params: query }
        );
    }

    createSubscription(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        const reqBody = {
            customerId: reqData.customerId,
            paymentMethodId: reqData.paymentMethodId,
            priceId: reqData.priceId,
        };

        return this.httpclient.post<any>('http://localhost:4242/create-subscription', JSON.stringify(reqBody),
            { headers: header, params: query }
        );
    }


    getPricesList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<any>('http://localhost:4242/prices-list',
            { headers: header, params: query }
        );
    }


}
