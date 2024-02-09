import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ChargeItem, ChargeProfile, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ChargesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getChargeList(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/Accounts/AccountCode:' + ContactCode, {
            headers: header, params: reqParam
        });
    }

    addNewCharge(ContactCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<ChargeProfile[]>(this.config.NewAPIEndPoint + '/Charges/Accounts/AccountCode:' + ContactCode, reqData, {
            headers: header, params: reqParam
        });
    }

    getCurrentCharge(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams()
            .set('api-version', '1.0')
            .append('ContactCode', reqData.ContactCode)
            .append('Code', reqData.Code)

        return this.httpclient.get<any>('assets/fakeDB/', {
            headers: header, params: reqParam
        });
    }

    updateCharge(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<any>('assets/fakeDB/', {
            headers: header, params: reqParam
        });
    }


}
