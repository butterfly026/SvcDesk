import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APP_CONFIG, IAppConfig, ContactBillContect, TokenInterface, Token_config } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class DisputeFormService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getBillDisputeDetail(Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Bills/Disputes/Id/' + Id, {
            headers: header, params: param
        });
    }

    updateBillDispute(reqBody, BillId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + '/Bills/Disputes/Id/' + BillId, reqBody, {
            headers: header, params: param
        });
    }

    createBillDisputes(reqBody, BillId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Bills/Disputes/BillId/' + BillId, reqBody, {
            headers: header, params: param
        });
    }

    getDisputeBills(ContactCode:string, srchCriteria: string): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '2.0')
            .append('SkipRecords', 0)
            .append('TakeRecords', 20)
            .append('SearchString', srchCriteria);

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + `/Bills/Disputes/Contacts/${ContactCode}/Bills`, {
            headers: header, params: param
        });
    }
}
