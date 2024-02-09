import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class DelegationFormService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getBillDelegationReasons(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillDelegationReasons', {
            headers: header, params: param
        });
    }

    getBillPeriods(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillPeriods', {
            headers: header, params: param
        });
    }

    getBilLDelegatees(ContactCode, reqParam): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('SkipRecords', reqParam.SkipRecords)
            .append('TakeRecords', reqParam.TakeRecords)
            .append('SearchString', reqParam.SearchString);

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillDelegations/Accounts/Select/AccountCode/' + ContactCode, {
            headers: header, params: param
        });
    }

    getBillDelegations(Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillDelegations/' + Id, {
            headers: header, params: param
        });
    }

    getBillDelegationDelegators(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillDelegations/Delegators/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    updateBillDelegations(reqBody, Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + '/Accounts/BillDelegations/' + Id, reqBody, {
            headers: header, params: param
        });
    }

    createBillDelegations(reqBody, AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Accounts/BillDelegations/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }
}
