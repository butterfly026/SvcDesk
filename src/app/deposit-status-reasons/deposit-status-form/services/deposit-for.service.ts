import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class DepositStatusFormService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getDepositStatusDetail(GroupId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Accounts/DepositStatusReasons/' + GroupId, {
            headers: header,
            params: reqParam
        });
    }

    createDepositStatus(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Accounts/DepositStatusReasons', reqData, {
            headers: header,
            params: reqParam
        });
    }

    updateDepositStatus(reqData, Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + '/Accounts/DepositStatusReasons/' + Id, reqData, {
            headers: header,
            params: reqParam
        });
    }

    getDepositStatusList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Accounts/DepositStatusReasons', {
            headers: header,
            params: reqParam
        });
    }
}