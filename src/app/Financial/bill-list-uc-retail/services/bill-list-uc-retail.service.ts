import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  BillListUCRetail, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BillListUCRetailService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) { }

    getBillListUC(reqData): Observable<BillListUCRetail[]> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', reqData)
        // return this.httpclient.get<ContactItemList[]>(this.config.MockingAPIEndPoint + 'ContactItemList', {
        //     params: reqParam
        // });
        return this.httpclient.get<BillListUCRetail[]>('assets/fakeDB/billListUCRetail.json', {
            headers: header, params: reqParam
        });
    }

}
