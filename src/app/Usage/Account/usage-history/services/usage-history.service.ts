import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { GetServiceUsageHistory, SourceFile } from 'src/app/Usage/models';


@Injectable({
    providedIn: 'root'
})
export class UsageHistoryService {


    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getUsageHistory(reqData: GetServiceUsageHistory, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/UsageTransactions/Accounts/' + ContactCode, {
            headers: header, params: reqParam
        });
    }

    usageDetailList (usageId: number): Observable<any[]>  {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any[]>(this.config.NewAPIEndPoint + '/UsageTransactions/' + usageId + '/Components', {
            headers: header, params: reqParams
        });
    };

    getSourceFile(usageId: number): Observable<SourceFile> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<SourceFile>(this.config.NewAPIEndPoint + '/UsageTransactions/' + usageId + '/SourceFiles', {
            headers: header, params: reqParams
        });
    }
}
