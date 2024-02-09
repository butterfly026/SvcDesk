import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class TerminationDetailService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) { }

    getTerminateService(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        return this.httpClient.get<any>('assets/fakeDB/Terminations/TerminationDetail.json', {
            headers: header,
        });
    }

    getTerminationsPenalty(ServiceReference, TerminationDateTime): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2')
            .append('TerminationDateTime', TerminationDateTime);

        return this.httpClient.get<any[]>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Terminations/Penalty', { headers: header, params: params });
    }
}