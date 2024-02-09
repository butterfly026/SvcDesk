import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, ContactFinancialTransactionId, TokenInterface, Token_config } from 'src/app/model';
import { GetFinancialTransactionsResponse } from '../financial-transaction-list.page.type';
import { FinancialTransactionStatus } from '../../financial-transaction-edit-status/financial-transaction-edit-status.component.type';

@Injectable({
    providedIn: 'root'
})

export class FinancialTransactionListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }
    FinantialTransactionsList(reqData, ContactCode): Observable<GetFinancialTransactionsResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', 'Y');

        return this.httpclient.get<GetFinancialTransactionsResponse>(this.config.NewAPIEndPoint +
            '/financialtransactions/Accounts/' + ContactCode, {
            headers: header, params: param
        });
    }

    FinantialTransactionsById(finantialId): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/financialtransactions/Id::' + finantialId, {
            headers: header, params: param
        });
    }

    getFinancialTransactionsStatuses(): Observable<FinancialTransactionStatus[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<FinancialTransactionStatus[]>(
            this.config.NewAPIEndPoint + '/financialtransactions/Statuses', 
            { headers, params }
        );
    }

    FinantialTransactionsTypes(): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/financialtransactions/Types', {
            headers: header, params: param
        });
    }

    FinantialTransactionsReasons(): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/financialtransactions/Reasons', {
            headers: header, params: param
        });
    }

    FinantialTransactionsCancelReasons(): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/CancelReasons', {
            headers: header, params: param
        });
    }

    FinantialTransactionsDeclineReasons(): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/DeclineReasons', {
            headers: header, params: param
        });
    }

    FinantialTransactionsDeletionReasons(): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/DeletionReasons', {
            headers: header, params: param
        });
    }

    FinantialTransactionsCategories(typeCode): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/Categories/TypeCode:' + typeCode, {
            headers: header, params: param
        });
    }

    FinantialTransactionsNumber(typeCode): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/FinancialTransaction/Number/TypeCode:' + typeCode, {
            headers: header, params: param
        });
    }

    FinantialTransactionsRoleThresholds(typeCode): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/FinancialTransaction/RoleThresholds/TypeCode:' + typeCode, {
            headers: header, params: param
        });
    }

    deleteFinancialTransaction(id: number): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.delete<void>(
            this.config.NewAPIEndPoint + `/FinancialTransactions/${id}`,
            { headers, params}
        );
    }

}
