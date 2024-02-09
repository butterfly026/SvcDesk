import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config,  } from 'src/app/model';
import { GetDiscountInstancesResponse } from '../discount-list.component.type';

@Injectable({
    providedIn: 'root'
})

export class DiscountListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getDiscountList(serviceReferenceId: number, reqData: Paging): Observable<GetDiscountInstancesResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams({ fromObject: { SearchString: '', ...reqData } })
            .append('api-version', '1.2');

        return this.httpclient.get<GetDiscountInstancesResponse>(this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Discounts/Instances`, { headers, params });
    }

    deleteDiscount(discountId): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .append('api-version', '1.2')

        return this.httpclient.delete<void>(this.config.NewAPIEndPoint + `/Services/Discounts/Instances/${discountId}`, { headers, params });
    }

}
