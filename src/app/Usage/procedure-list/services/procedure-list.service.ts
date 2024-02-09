import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ProcedureList, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ProcedureListService {

    private httpHeaders: HttpHeaders = new HttpHeaders();
    private httpParams: HttpParams = new HttpParams();

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }


    public getProcedureList = (pagingParams: any): Observable<{ data: ProcedureList[], recordCount: number }> => {

        const headers = this.httpHeaders.set('Authorization', this.tokens.AccessToken);
        const params = this.httpParams.set('ContactCode', this.tokens.UserCode)
            .append('SkipRecords', pagingParams.skipRecords)
            .append('TakeRecords', pagingParams.takeRecords);

        return this.httpClient.get<{ data: ProcedureList[], recordCount: number }>(this.config.APIEndPoint + 'API.svc/rest/ContactDeviceProcedureList', {
            headers, params, responseType: 'json', observe: 'response'
        }).pipe(
            map((res: any) => {
                return { data: res.body, recordCount: res.headers.get('RecordCount') };
            })
        );
    };


}
