import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, BusinessUnitListItem, TokenInterface, Token_config, } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class BusinessUnitService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    businessUnitSelect(businessUnitId): Observable<any> {
        const params = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('UserAccountId', this.tokens.UserCode)
            .append('BusinessUnitId', businessUnitId);
        return this.httpclient.get<BusinessUnitListItem[]>(this.config.MockingAPIEndPoint + 'BusinessUnitChange', { params });
    }

    getbusinessUnitList(): Observable<BusinessUnitListItem[]> {
        const params = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('UserAccountId', this.tokens.UserCode);
        return this.httpclient.get<BusinessUnitListItem[]>(this.config.MockingAPIEndPoint + 'BusinessUnitList', { params });
    }

}
