import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from "src/app/model";
import { Observable } from "rxjs";
import { AuthorisedAccountItem, AuthorisedAccountItemDetail, AuthorisedAccountsAvailableResponse, AuthorisedAccountsResponse } from "../models/authorised-accounts.types";

@Injectable({
    providedIn: 'root'
})

export class AuthorisedAccountsService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getAuthorisedAccountsList(reqData: Paging, ContactCode: string): Observable<AuthorisedAccountsResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1');

        return this.httpClient.get<AuthorisedAccountsResponse>(this.config.NewAPIEndPoint + `/Contacts/${ContactCode}/AuthorisedAccounts`, {
            headers: header, params: reqParams
        });
    }

    getAuthorisedAccountsAvailable(reqData: any, ContactCode: string): Observable<AuthorisedAccountsAvailableResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1');

        return this.httpClient.get<AuthorisedAccountsAvailableResponse>(this.config.NewAPIEndPoint + `/Contacts/${ContactCode}/AuthorisedAccounts/Available`, {
            headers: header, params: reqParams
        });
    }

    getAuthorisedAccount(AuthorisedAccountId: number): Observable<AuthorisedAccountItemDetail> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.1');

        return this.httpClient.get<AuthorisedAccountItemDetail>(this.config.NewAPIEndPoint + `/Contacts/AuthorisedAccounts/${AuthorisedAccountId}`, {
            headers: header, params: reqParams
        });
    }

    createAuthorisedAccount(ContactCode: string, reqData: AuthorisedAccountItem): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + `/Contacts/${ContactCode}/AuthorisedAccounts`, reqData, {
            headers: header, params: reqParams
        });
    }

    updateAuthorisedAccount(AuthorisedAccountId: number, reqData: AuthorisedAccountItem): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.1');

        return this.httpClient.patch<any>(this.config.NewAPIEndPoint + `/Contacts/AuthorisedAccounts/${AuthorisedAccountId}`, { To: reqData.To }, {
            headers: header, params: reqParams
        });
    }

    deleteAuthorisedAccount(ContactCode: string, AuthorisedAccountId: number): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.1');

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + `/Contacts/AuthorisedAccounts/${AuthorisedAccountId}`, {
            headers: header, params: reqParams
        });
    }
}