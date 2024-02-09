import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from "src/app/model";
import { DepositItem, DepositItemDetail, DepositItemResponse, DepositStatusReason, DepositType, DepositTypeResponse, StatusItem } from "../deposits.types";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AccountDepositsService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getDepositsList(reqData: Paging, ContactCode: string): Observable<DepositItemResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.0');

        return this.httpClient.get<DepositItemResponse>(this.config.NewAPIEndPoint + '/Accounts/Deposits/AccountCode/' + ContactCode, {
            headers: header, params: reqParams
        });
    }
    getDepositStatusReasons(): Observable<DepositStatusReason[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.get<DepositStatusReason[]>(this.config.NewAPIEndPoint + '/Accounts/Deposits/Status/Reasons', {
            headers: header, params: reqParams
        });
    }

    getAccountStatuses(): Observable<StatusItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.get<StatusItem[]>(this.config.NewAPIEndPoint + '/Accounts/Statuses', {
            headers: header, params: reqParams
        });
    }
    getDepositTypes(reqData: Paging): Observable<DepositTypeResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.0');

        return this.httpClient.get<DepositTypeResponse>(this.config.NewAPIEndPoint + '/Accounts/Deposits', {
            headers: header, params: reqParams
        });
    }

    createDeposit(ContactCode: string, reqData: DepositItem): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + `/Accounts/Deposits/AccountCode/${ContactCode}`, reqData, {
            headers: header, params: reqParams
        });
    }

    getDepositDetail(depositId: string): Observable<DepositItemDetail> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.get<DepositItemDetail>(this.config.NewAPIEndPoint + `/Accounts/Deposits/${depositId}`, {
            headers: header, params: reqParams
        });
    }

    updateDeposit(depositId: string, reqData: DepositItem): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.patch<any>(this.config.NewAPIEndPoint + `/Accounts/Deposits/${depositId}`, reqData, {
            headers: header, params: reqParams
        });
    }

    deleteDeposit(depositId: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + `/Accounts/Deposits/${depositId}`, {
            headers: header, params: reqParams
        });
    }

}