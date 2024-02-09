import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ContactItemList, BillNote, NewContactSearch, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceDeskDetailService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getContactItemList(reqData): Observable<ContactItemList[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams()
            // .set('ContactCode', reqData)
            .set('api-version', '1.1');
        return this.httpclient.get<ContactItemList[]>(this.config.NewAPIEndPoint + '/Contacts/' + reqData + '/DisplayDetails', {
            headers: header, params: reqParam
        });
    }

}
