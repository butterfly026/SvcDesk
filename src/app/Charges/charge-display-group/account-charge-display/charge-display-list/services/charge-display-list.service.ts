import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ChargeGroupDisplayListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getChargeGroupList(ParentChargeGroupId?: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')
            .append('ParentChargeGroupId', ParentChargeGroupId)

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/DisplayGroups', {
            headers: header,
            params: reqParam
        });
    }

    deleteChargeGroup(chargeGroupDisplayId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Charges/DisplayGroups/' + chargeGroupDisplayId, {
            headers: header,
            params: reqParam
        });
    }
}