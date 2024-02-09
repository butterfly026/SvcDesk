import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class DepositStatusReponseService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

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

    deleteDepositStatus(Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Accounts/DepositStatusReasons/' + Id, {
            headers: header,
            params: reqParam
        });
    }
}