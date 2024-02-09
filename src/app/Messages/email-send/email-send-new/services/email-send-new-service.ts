import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class EmailSendNewService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) { }

    emailSend(reqData, billId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Bills/Emails/' + billId, reqData, {
            headers: header, params: param
        });
    }

    getEmailLists(billId, apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl + billId, {
            headers: header, params: param
        });
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

    gEmailConfiguration(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
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