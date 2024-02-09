import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, DiscountNewItem, IAppConfig, Paging, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';
import { CreateDiscountInstanceRequest, DiscountDefinitionResponse } from '../discount-new.component.type';

@Injectable({
    providedIn: 'root'
})

export class DiscountNewService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getDiscountDefinitionList(serviceReferenceId: number, reqData: Paging): Observable<DiscountDefinitionResponse> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('CurrentOnly', 'true')
            .append('api-version', '1.2');

        return this.httpclient.get<DiscountDefinitionResponse>(this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Discounts/Definitons`, {
            headers: header, params: reqParam
        });
    }

    addNewDiscount(serviceReferenceId: number, reqData: CreateDiscountInstanceRequest): Observable<{ Id: number }> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .append('api-version', '1.2');

        return this.httpclient.post<{ Id: number }>(this.config.NewAPIEndPoint + `/Services/${serviceReferenceId}/Discounts/Instances`, reqData, {
            headers: header, params: reqParam
        });
    }

}
