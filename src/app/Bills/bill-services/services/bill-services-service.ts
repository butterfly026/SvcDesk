import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';
import { GetServiceSummaryResponse } from '../bill-services.component.type';

@Injectable({
    providedIn: 'root'
})

export class BillServicesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServicesList(reqData, billId): Observable<GetServiceSummaryResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.0')

        return this.httpclient.get<GetServiceSummaryResponse>(this.config.NewAPIEndPoint + '/Bills/ServiceSummaries/BillId/' + billId, { headers, params });
    }

}
