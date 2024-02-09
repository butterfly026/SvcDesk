import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";
import { ContactMessage, GetMessagesResponse } from "../models";

@Injectable({
    providedIn: 'root'
})

export class ContactMessageService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getMessageList(reqData, ContactCode): Observable<GetMessagesResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)


        const params = new HttpParams({fromObject: { ...reqData }})
            .append('api-version', '1.0')
            .append('ContactOnly', true)

        return this.httpClient.get<GetMessagesResponse>(this.config.NewAPIEndPoint + '/Messages/Contacts/' + ContactCode, { headers, params });
    }

    getMessage(messageId): Observable<ContactMessage> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .append('api-version', '1.0')
            .append('ContactOnly', true)

        return this.httpClient.get<ContactMessage>(this.config.NewAPIEndPoint + `/Messages/${messageId}`, { headers, params });
    }

    deleteMessage(id): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Messages/' + id, { headers, params });
    }
}