import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, ErrorItems, IAppConfig, Loyalty, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class LoyaltyService {

    httpHeaders: HttpHeaders = new HttpHeaders();
    httpParams: HttpParams = new HttpParams();

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) private config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getLoyaltyList(reqData): Observable<Loyalty[]> {
        let header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        let reqParam = new HttpParams()
            .set('ContactCode', reqData.ContactCode)

        return this.httpClient.get<Loyalty[]>('assets/fakeDB/Selcomm/Loyalty.json', {
            headers: header, params: reqParam
        });
    }

}
