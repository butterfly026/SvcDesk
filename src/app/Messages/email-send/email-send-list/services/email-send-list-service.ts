import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class EmailSendListService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) { }

    getEmailsSendList(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('SearchString', reqData.SearchString)
            .append('SkipRecords', '*' + reqData.SkipRecords + '*')
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', 'Y')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/Emails/ContactCode/' + reqData.ContactCode, {
            headers: header, params: param
        });
    }
}