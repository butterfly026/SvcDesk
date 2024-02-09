import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ServiceEnquiryPasswordService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getEnquiryPassword(ServiceReference): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/EnquiryPassword', {
            headers: header, params: param
        });
    }

    putEnquiryPassword(ServiceReference, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/EnquiryPassword', reqBody, {
            headers: header, params: param
        });
    }
}