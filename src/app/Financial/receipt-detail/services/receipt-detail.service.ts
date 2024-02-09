import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
    APP_CONFIG, IAppConfig, AllocationItem,
    EventListItem, DistributionItem, SplitItem, TokenInterface, Token_config,
} from 'src/app/model';
import { Observable } from 'rxjs';
import { ReceiptItem } from 'src/app/model/ReceiptItem/ReceiptItem';
import { BulkItem } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class ReceiptDetailService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getPaymentData(): Observable<ReceiptItem> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', this.tokens.UserCode)
        // return this.httpclient.get<ContactItemList[]>(this.config.MockingAPIEndPoint + 'ContactItemList', {
        //     params: reqParam
        // });
        return this.httpclient.get<ReceiptItem>('assets/fakeDB/receiptDetail.json', {
            params: reqParam
        });
    }

    getAllocationList(): Observable<AllocationItem[]> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', this.tokens.UserCode)
        // return this.httpclient.get<ContactItemList[]>(this.config.MockingAPIEndPoint + 'ContactItemList', {
        //     params: reqParam
        // });
        return this.httpclient.get<AllocationItem[]>('assets/fakeDB/allocatin.json', {
            params: reqParam
        });
    }

    getDisList(): Observable<DistributionItem[]> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', this.tokens.UserCode)
        // return this.httpclient.get<ContactItemList[]>(this.config.MockingAPIEndPoint + 'ContactItemList', {
        //     params: reqParam
        // });
        return this.httpclient.get<DistributionItem[]>('assets/fakeDB/disList.json', {
            params: reqParam
        });
    }

    getEventList(): Observable<EventListItem[]> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', this.tokens.UserCode)
        // return this.httpclient.get<ContactItemList[]>(this.config.MockingAPIEndPoint + 'ContactItemList', {
        //     params: reqParam
        // });
        return this.httpclient.get<EventListItem[]>('assets/fakeDB/eventListItem.json', {
            params: reqParam
        });
    }

    getSplitList(): Observable<SplitItem[]> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', this.tokens.UserCode)
        // return this.httpclient.get<ContactItemList[]>(this.config.MockingAPIEndPoint + 'ContactItemList', {
        //     params: reqParam
        // });
        return this.httpclient.get<SplitItem[]>('assets/fakeDB/receiptSplit.json', {
            params: reqParam
        });
    }

    getBulkList(): Observable<BulkItem[]> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', this.tokens.UserCode)
        // return this.httpclient.get<ContactItemList[]>(this.config.MockingAPIEndPoint + 'ContactItemList', {
        //     params: reqParam
        // });
        return this.httpclient.get<BulkItem[]>('assets/fakeDB/receiptSplit.json', {
            params: reqParam
        });
    }

}
