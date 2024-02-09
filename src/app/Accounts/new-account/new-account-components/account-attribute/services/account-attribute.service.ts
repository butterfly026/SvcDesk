import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class AccountAttributeService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getUserDefinedDataDetail(ContactCode, Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/UserDefinedDataDefinitions/' + Id, {
            headers: header, params: reqParam
        });
    }

    getAvailableUserDefinedDataTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/UserDefinedDataDefinitions', {
            headers: header, params: reqParam
        });
    }

    addUserDefinedData(ContactCode, Id, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/UserDefinedDataDefinitions/' + Id, reqData, {
            headers: header, params: reqParam
        });
    }

    updateUserDefinedData(ContactCode, Id, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/UserDefinedDataDefinitions/' + Id, reqData, {
            headers: header, params: reqParam
        });
    }
}