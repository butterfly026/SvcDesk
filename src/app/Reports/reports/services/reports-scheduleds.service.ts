
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { GetShceduledReportsForDefinitionResponse, ScheduleParam } from '../models';

@Injectable({
    providedIn: 'root'
})

export class ReportsScheduledService {
    constructor(public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getScheduleReportList(DefinitionId, reqData: ScheduleParam): Observable<GetShceduledReportsForDefinitionResponse> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let params = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.0');

        return this.httpclient.get<GetShceduledReportsForDefinitionResponse>(this.config.NewAPIEndPoint + '/Reports/Schedules/DefinitionId/' + DefinitionId, { headers, params });

    }

    scheduleReport(reqData): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.post<void>(this.config.NewAPIEndPoint + '/Reports/Schedules', reqData, { headers, params });
    }

    deleteScheduleReport(DefinitionId): Observable<void> {

        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.delete<void>(this.config.NewAPIEndPoint + '/Reports/Schedules/' + DefinitionId, { headers, params });
    }
}
