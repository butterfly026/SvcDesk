import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class BillEmailService {

    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) { }

    emailSend(reqData, billId): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '2.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + `/Bills/${billId}/Emails/`, JSON.stringify(reqData), { headers, params });
    }

    getEmailLists(billId): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '2.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + `/Bills/${billId}/Emails/Addresses`, { headers, params });
    }

    emailConfiguration(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/Emails/Configuration', {
            headers: header, params: param
        });
    }

    getPhoneList(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('IncludeTypes', 'true')
            .append('IncludeMandatoryRules', 'true');
        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Phones/Usage/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

    getTemplateList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/Emails/Templates', {
            headers: header, params: param
        });
    }

    getTemplateDetail(templateId, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/Emails/Templates/Id/' + templateId + '/ContactCode/' + ContactCode, {
            headers: header, params: param
        });
    }

    getEmailAddresses(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/Emails/Addresses/ContactCode/' + ContactCode, {
            headers: header, params: param
        });
    }

    getAvailableDocuments(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/Emails/AvailableDocuments/ContactCode/' + ContactCode, {
            headers: header, params: param
        });
    }
}