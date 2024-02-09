import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APP_CONFIG, IAppConfig, ContactBillContect, TokenInterface, Token_config } from 'src/app/model';
import { BillDelegation } from '../../../bilil-delegation.types';

@Injectable({
    providedIn: 'root'
})

export class DelegationListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getBillDelegations(AccountCode: string): Observable<BillDelegation[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<BillDelegation[]>(this.config.NewAPIEndPoint + '/Accounts/BillDelegations/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    deleteBillDelegations(Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Accounts/BillDelegations/' + Id, {
            headers: header, params: param
        });
    }
}
