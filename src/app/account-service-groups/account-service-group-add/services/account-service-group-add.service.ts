import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AccountServiceGroupAddService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    ServiceGroupAdd(controls): Observable<any> {


        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        const reqParam = {
            "name": controls.Name,
            "ContactCode": controls.ContactCode,
            "code": controls.Code,
            "additionalInformation1": controls.AdditionalInformation1,
            "additionalInformation2": controls.AdditionalInformation2,
            "additionalInformation3": controls.AdditionalInformation3,
            "email": controls.Email
        }

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/ServiceGroups/ServiceGroup', reqParam, {
            headers: header, params: param
        });
    }

}
