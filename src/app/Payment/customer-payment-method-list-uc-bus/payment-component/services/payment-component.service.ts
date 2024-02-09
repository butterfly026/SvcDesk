import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, CustomerPaymentMethodListItem, CountryItem, CustomerPaymentMethodAdd, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PaymentComponentService {
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
            // From: reqData.From,
            // Status: reqData.Status,
            Status: 'CL',
            // ReOpen: reqData.ReOpen,
            // FollowUp: reqData.FollowUp,
            Note: 'Payment method deleted by ' + this.tokens.ContactCode + ' from ServiceDesk'
        }

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/PaymentMethods/' + reqData.Id + '/StatusChange',
            reqBody, { headers: header, params: query }
        );
    }

    CustomerCreditCardPaymentMethodAdd(paramData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        const reqBody = {
            "payCode": paramData.PayCode,
            "accountNumber": paramData.AccountNumber,
            "accountName": paramData.AccountName,
            "expiryDate": paramData.ExpiryDate,
            "cvv": paramData.CVV,
            "customerOwned": true,
            "token": paramData.Token,
            'tokenise': false,
            "exported": false,
            "protectNumber": true,
            "default": paramData.Default,
            "allowExisting": true,
            "checkConfiguration": true,
            "name": paramData.FirstName,
            "companyName": paramData.CompanyName,
            "addressLine1": paramData.AddressLine1,
            "addressLine2": paramData.AddressLine2,
            "city": paramData.City,
            "state": paramData.State,
            "country": paramData.Country,
            "phoneNumber": paramData.PhoneNumber
        }
        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Contacts/' + paramData.ContactCode + '/CreditCards', reqBody, {
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

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/PaymentMethods/CreditCardNumber/' + CreditCardNumber + '/Validate',
            { headers: header, params: query }
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

    getMethodList(): Observable<CustomerPaymentMethodListItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('Open', 'true')

        return this.httpClient.get<CustomerPaymentMethodListItem[]>(this.config.APIEndPoint + 'Payments.svc/rest/CustomerCreditCardPaymentMethodList',
            { headers: header, params: reqParam }
        );
    }

    deleteMethod(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('Id', reqData.id);

        return Observable.create(observer => {
            if (reqData.id !== '') {
                const resData = { 'state': '', 'data': [], 'message': '' };
                resData.state = 'success';
                resData.data = reqData;
                observer.next(resData);
            } else {
                const resData = { 'errorMessage': '', 'DetailedInformation': '', 'successful': '' };
                resData.errorMessage = 'fail';
                resData.successful = '204';
                observer.error(resData);
            }
            observer.complete();
        });
    }

    getCountryList(): Observable<CountryItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)

        return this.httpClient.get<CountryItem[]>('assets/fakeDB/countryList.json',
            { headers: header, params: reqParam }
        );
    }

    makeDefaultPayment(paymentData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('PaymentMethodId', paymentData.id)

        const postParam = {
            'PaymentMethodId': paymentData.id
        }

        return this.httpClient.post<any>(this.config.APIEndPoint + 'Payments.svc/rest/CustomerPaymentMethodMakeDefault',
            postParam, { headers: header, params: reqParam }
        );
    }

}
