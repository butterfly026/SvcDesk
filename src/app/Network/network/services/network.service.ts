import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, Network, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    httpHeaders: HttpHeaders = new HttpHeaders();
    httpParams: HttpParams = new HttpParams();

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) private config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) {
    }

    getLoyaltyList(reqData): Observable<Network[]> {
        let header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        let reqParam = new HttpParams()
            .set('ContactCode', reqData.ContactCode)

        return this.httpClient.get<Network[]>('assets/fakeDB/Selcomm/Loyalty.json', {
            headers: header, params: reqParam
        });
    }

}
