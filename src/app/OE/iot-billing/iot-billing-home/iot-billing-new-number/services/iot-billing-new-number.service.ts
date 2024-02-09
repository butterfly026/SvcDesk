import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class IOTBillingNewNumberService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) { }

    getNumberList(ContactCode): Observable<string[]> {
        let header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);
        let reqParam = new HttpParams()
            .append('ContactCode', ContactCode);

        return this.httpclient.get<string[]>('assets/fakeDB/OE/iOTBilling/newNumber.json', {
            headers: header, params: reqParam
        });
    }

}
