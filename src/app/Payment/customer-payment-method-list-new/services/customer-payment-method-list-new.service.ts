import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  CustomerPaymentMethodListItem, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CustomerPaymentMethodListNewService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getMethodList(): Observable<CustomerPaymentMethodListItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)

        return this.httpclient.get<CustomerPaymentMethodListItem[]>(this.config.MockingAPIEndPoint + 'Payments/1.0.0/CustomerPaymentMethodList',
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

}
