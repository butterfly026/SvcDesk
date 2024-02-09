import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';
import { ReceiptItem } from 'src/app/model/ReceiptItem/ReceiptItem';
import { ReceiptAllocationItem } from '../models';

@Injectable({
    providedIn: 'root'
})

export class ReceiptPaymentService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,

    ) { }

    getFinancialList(reqData): Observable<ReceiptItem[]> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', reqData)
        // return this.httpclient.get<ContactItemList[]>(this.config.MockingAPIEndPoint + 'ContactItemList', {
        //     params: reqParam
        // });
        return this.httpclient.get<ReceiptItem[]>('assets/fakeDB/receiptList.json', {
            params: reqParam
        });
    }

    getAllocationList(accountCode): Observable<ReceiptAllocationItem[]> {
        const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        
        return this.httpclient.get<ReceiptAllocationItem[]>(this.config.NewAPIEndPoint + '/FinancialTransactions/Allocations/AllocatableTransactions/Accounts/' + accountCode, {
            headers: header, params: param
        });

    }

    getPaymentMethodLists(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1')
            .append('Open', 'true')
            .append('DefaultOnly', 'false')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Contacts/' + ContactCode, {
            headers: header, params: param
        });
    }

    getInvoiceNumber(TypeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('Open', 'true')
            .append('DefaultOnly', 'false')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/FinancialTransactions/Numbers/Types/' + TypeId, {
            headers: header, params: param
        });
    }

    getSurchargeDetail(PaymentMethodId, Amount): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/PaymentMethods/CalculateSurcharge/Code/' + PaymentMethodId + '/Amount/' + Amount, {
            headers: header, params: param
        });
    }

    gSurchargeDetail(PaymentMethodId, Amount, WebService): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint 
            + '/PaymentMethods/CalculateSurcharge/PaymentMethodId/' 
            + PaymentMethodId + '/Amount/' + Amount + '/Source/' + WebService, {
            headers: header, params: param
        });
    }

    addReceipt(ContactCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/FinancialTransactions/Receipts/Accounts/' + ContactCode, reqData, {
            headers: header, params: param
        });
    }

    PollCalculate(requestId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/FinancialTransactions/Receipts/PollRequest/' + requestId, {
            headers: header, params: param
        });
    }

}
