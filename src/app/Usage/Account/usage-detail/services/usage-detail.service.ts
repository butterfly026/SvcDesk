import {Injectable, Inject} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable} from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class UsageDetailService {
    
    
    constructor(
        public httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {
    }
    
    
    usageDetailList (usageId: string): Observable<any[]>  {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/UsageTransactions/' + usageId + '/Components', {
            headers: header, params: reqParams
        });
    };
    getTariffList (usageId: string): Observable<any[]>  {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/UsageTransactions/' + usageId + '/Tariffs', {
            headers: header, params: reqParams
        });
    };
    
}
