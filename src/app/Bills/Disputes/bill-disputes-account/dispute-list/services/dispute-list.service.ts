import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class DisputesListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getBillDisputes(pagingParam, ContactCode): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams({fromObject: pagingParam})
            .set('api-version', '2.0');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Bills/Disputes/Contacts/' + ContactCode, {
            headers, params
        });
    }

    deleteBillDisputes(Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '2.0')

        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Bills/Disputes/' + Id, {
            headers: header, params: param
        });
    }
}
