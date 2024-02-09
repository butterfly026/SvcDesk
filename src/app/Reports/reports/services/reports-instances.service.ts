
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { DownloadReportInstancesResponse, GetReportInstancesForDefinitionResponse, InstanceParam } from '../models';

@Injectable({
    providedIn: 'root'
})

export class ReportsInstancesService {
    constructor(public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getReportInstancesForDefinition(DefinitionId, reqData: InstanceParam): Observable<GetReportInstancesForDefinitionResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let params = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.0');

        return this.httpclient.get<GetReportInstancesForDefinitionResponse>(this.config.NewAPIEndPoint + '/Reports/Instances/DefinitionId/' + DefinitionId, { headers, params });
    }

    createReportInstance(reqData): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<void>(this.config.NewAPIEndPoint + '/Reports/Instances', reqData, { headers, params });
    }

    deleteReportInstance(DefinitionId): Observable<void> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.delete<void>(this.config.NewAPIEndPoint + '/Reports/Instances/' + DefinitionId, {
            headers: header, params: reqParam
        });
    }

    downloadReportInstance(DefinitionId): Observable<DownloadReportInstancesResponse> {

        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<DownloadReportInstancesResponse>(this.config.NewAPIEndPoint + '/Reports/Download/' + DefinitionId, { headers, params });
    }

}
