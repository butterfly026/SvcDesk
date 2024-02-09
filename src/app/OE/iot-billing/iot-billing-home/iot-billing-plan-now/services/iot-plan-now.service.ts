import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ContactItemList, ContactSearch, PaymentItem, ContactAdvancedItem, BillNote, PlansItem, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class IOTBillingPlanNowService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) { }

    getPlansDetail(ContactCode, PlanId): Observable<PlansItem[]> {
        let header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);
        let reqParam = new HttpParams()
            .set('ContactCode', ContactCode)
            .append('Id', PlanId);

        return this.httpclient.get<PlansItem[]>('assets/fakeDB/OE/iOTBilling/plans.json', {
            headers: header, params: reqParam
        });
    }

}
