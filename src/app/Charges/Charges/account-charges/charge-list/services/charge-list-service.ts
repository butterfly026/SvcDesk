import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';
import { ChargeReqParam } from '../../charges.types';

@Injectable({
    providedIn: 'root'
})

export class ChargeListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getChargeList(reqData: ChargeReqParam, ContactCode): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);
        let params = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.3');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/Accounts/' + ContactCode, {
            headers,
            params
        });
    }

    deleteCharge(chargeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/' + chargeId, {
            headers: header,
            params: reqParam
        });
    }

    endCharge(chargeId, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/' + chargeId + '/End', reqBody, {
            headers: header,
            params: reqParam
        });
    }

    validateDelete(ChargeId: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + `/Charges/Profiles/${ChargeId}/ValidateDelete`, {
            headers: header,
            params: reqParam
        });
    }

}
