import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig,  TokenInterface, Token_config, } from 'src/app/model';
import { GetReportsResponse, Report, ReportItemParam } from '../models';

@Injectable({
    providedIn: 'root'
})

export class ReportsListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getReportList(reqData: ReportItemParam): Observable<GetReportsResponse> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);
        let params = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.0');

        return this.httpclient.get<GetReportsResponse>(this.config.NewAPIEndPoint + '/Reports/Definitions', { headers, params });

    }

    getReport(definitionId): Observable<Report> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<Report>(this.config.NewAPIEndPoint + '/Reports/Definitions/' + definitionId, { headers, params });
    }

}
