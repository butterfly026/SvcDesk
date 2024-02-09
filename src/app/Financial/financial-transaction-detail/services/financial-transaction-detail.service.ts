import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {
    APP_CONFIG, IAppConfig, ContactFinancialTransactionId, TokenInterface, Token_config,
} from 'src/app/model';
import { Observable } from 'rxjs';
import { GetFinancialTransactionResponse } from '../financial-transaction-detail.page.type';

@Injectable({
    providedIn: 'root'
})

export class FinancialTransactionDetailService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    FinantialTransactionsById(finantialId): Observable<GetFinancialTransactionResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        // .append('SkipRecords', reqData.SkipRecords)
        // .append('TakeRecords', reqData.TakeRecords)
        // .append('countRecords', 'Y')

        return this.httpclient.get<GetFinancialTransactionResponse>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/' + finantialId, {
            headers: header, params: param
        });
    }

    FinantialTransactionsStatus(): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/Statuses', {
            headers: header, params: param
        });
    }

    FinantialTransactionsTypes(): Observable<ContactFinancialTransactionId[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<ContactFinancialTransactionId[]>(this.config.NewAPIEndPoint +
            '/FinancialTransactions/Types', {
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
            '/FinancialTransactions/Reasons', {
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
            '/FinancialTransactions/Number/TypeCode:' + typeCode, {
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
            '/FinancialTransactions/RoleThresholds/TypeCode:' + typeCode, {
            headers: header, params: param
        });
    }

}
