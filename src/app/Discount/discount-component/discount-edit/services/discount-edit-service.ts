import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';

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

    updateDiscount(discountId: number, toDate: Date): Observable<void> {
        const header = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .append('api-version', '1.2');

        return this.httpclient.patch<void>(this.config.NewAPIEndPoint + `/Services/Discounts/Instances/${discountId}`, { To: toDate }, {
            headers: header, params: reqParam
        });
    }

}
