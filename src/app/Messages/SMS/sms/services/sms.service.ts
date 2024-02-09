import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SMSService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    smsSend(SMS): Observable<any> {
        return Observable.create(observer => {
            const resData = { 'state': '', 'data': '', 'message': '' };
            if (Math.random() > 0.1) {
                resData.state = 'success';
                resData.message = 'passwordChangedSuccess';
                observer.next(resData);
            } else {
                resData.state = 'fail';
                resData.message = 'CollectionRunAuthoriseFailed';
                observer.error(resData);
            }
            observer.complete();
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
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Phones/Usage/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

}
