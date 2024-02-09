import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class BillNowService {
    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getHotBillPeriods(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            '/Bills/HotBillPeriods/ContactCode/' + ContactCode, {
            headers: header, params: param
        });
    }

    getHotBillCycles(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            '/Accounts/BillCycles/AccountCode/' + ContactCode, {
            headers: header, params: param
        });
    }

    getBillCycle(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            '/accounts/BillCycles/AccountCode/' + ContactCode, {
            headers: header, params: param
        });
    }

    billSearch(url, queryParam): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('SearchString', queryParam.SearchString)
            .append('SkipRecords', queryParam.SkipRecords)
            .append('TakeRecords', queryParam.TakeRecords)

        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            url, {
            headers: header, params: param
        });
    }
}