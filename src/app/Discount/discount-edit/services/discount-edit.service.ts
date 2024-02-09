import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, DiscountNewItem, DiscountItem, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DiscountEditService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getCurrentDiscount(DiscountId): Observable<DiscountItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('DiscountId', DiscountId);

        return this.httpclient.get<DiscountItem[]>('assets/fakeDB/discountList.json', {
            headers: header, params: reqParam
        });
    }

    updateDiscount(): Observable<DiscountItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<DiscountItem[]>('assets/fakeDB/discountListNew.json', {
            headers: header, params: reqParam
        });
    }

}
