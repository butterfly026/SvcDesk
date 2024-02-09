import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ChargeInstancesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getChargeInsances(reqData, chargeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams({ fromObject: { ...reqData } })
            .set('api-version', '1.3');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/Instances/Profiles/' + chargeId, {
            headers: header,
            params: reqParam
        });
    }

}
