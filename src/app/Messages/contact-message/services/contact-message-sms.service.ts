import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";
import { ContactMessageSMSNumber, SendSMSRequest } from "../models";

@Injectable({
    providedIn: 'root'
})

export class ContactMessageSMSService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getSMSNumbersList(contactCode: string): Observable<ContactMessageSMSNumber[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<ContactMessageSMSNumber[]>(this.config.NewAPIEndPoint + `/Messages/SMSs/Numbers/Contacts/${contactCode}`, { headers, params });
    }

    sendSMS(reqData: SendSMSRequest, contactCode: string): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<void>(this.config.NewAPIEndPoint + `/Messages/SMSs/Contacts/${contactCode}`, reqData, { headers, params });
    }

}