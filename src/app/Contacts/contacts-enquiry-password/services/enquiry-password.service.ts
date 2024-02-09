import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ContactEnquiryPasswordService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getEnquiryPassword(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/EnquiryPassword', {
            headers: header, params: param
        });
    }

    putEnquiryPassword(ContactCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/EnquiryPassword', reqBody, {
            headers: header, params: param
        });
    }
}