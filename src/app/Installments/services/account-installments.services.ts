import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from "src/app/model";
import { Observable } from "rxjs";
import { InstallmentItem, InstallmentItemDetail, InstallmentItemResponse, InstallmentStatusReason, PaymentMethodItem, PaymentMethodOption } from "../models/installments.types";

@Injectable({
    providedIn: 'root'
})

export class AccountInstallmentsService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getInstallmentsList(reqData: Paging, ContactCode: string): Observable<InstallmentItemResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.0');

        return this.httpClient.get<InstallmentItemResponse>(this.config.NewAPIEndPoint + '/Accounts/Installments/AccountCode/' + ContactCode, {
            headers: header, params: reqParams
        });
    }
    

    createInstallment(ContactCode: string, reqData: InstallmentItem): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + `/Accounts/Installments/AccountCode/${ContactCode}`, reqData, {
            headers: header, params: reqParams
        });
    }

    getInstallmentDetail(installmentId: number): Observable<InstallmentItemDetail> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.get<InstallmentItemDetail>(this.config.NewAPIEndPoint + `/Accounts/Installments/${installmentId}`, {
            headers: header, params: reqParams
        });
    }

    updateInstallment(installmentId: number, reqData: InstallmentItem): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.patch<any>(this.config.NewAPIEndPoint + `/Accounts/Installments/${installmentId}`, reqData, {
            headers: header, params: reqParams
        });
    }

    deleteInstallment(installmentId: number): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + `/Accounts/Installments/${installmentId}`, {
            headers: header, params: reqParams
        });
    }

    getInstallmentsStatusReasons(): Observable<InstallmentStatusReason[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .append('api-version', '1.0');

        return this.httpClient.get<InstallmentStatusReason[]>(this.config.NewAPIEndPoint + '/Accounts/Installments/Status/Reasons', {
            headers: header, params: reqParams
        });
    }

    getPaymentMethodList(ContactCode: string, reqData: PaymentMethodOption): Observable<PaymentMethodItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1');

        return this.httpClient.get<PaymentMethodItem[]>(this.config.NewAPIEndPoint + `/PaymentMethods/Contacts/${ContactCode}`, {
            headers: header, params: reqParams
        });
    }

}