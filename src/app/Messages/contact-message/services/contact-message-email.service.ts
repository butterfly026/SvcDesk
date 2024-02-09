import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";
import { ContactMessageEmail, EmailConfiguration, GetAvailableDocumentsResponse, SendEmailRequest } from "../models";

@Injectable({
    providedIn: 'root'
})

export class ContactMessageEmailService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {}

    sendEmail(reqData: SendEmailRequest, contactCode: string): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<void>(this.config.NewAPIEndPoint + `/Messages/Emails/Contacts/${contactCode}`, reqData, { headers, params  });
    }

    getEmailConfiguration(): Observable<EmailConfiguration> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<EmailConfiguration>(this.config.NewAPIEndPoint + '/Messages/Emails/Configuration', { headers, params });
    }

    getEmailAddresses(contactCode: string): Observable<ContactMessageEmail[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0');


        return this.httpClient.get<ContactMessageEmail[]>(this.config.NewAPIEndPoint + `/Messages/Emails/Addresses/Contacts/${contactCode}`, { headers, params });
    }

    getAvailableDocuments(contactCode): Observable<GetAvailableDocumentsResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<GetAvailableDocumentsResponse>(this.config.MockingAPIEndPoint + `/Messages/AvailableDocuments/Contacts/${contactCode}`, { headers, params });
    }
}