import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ChargeDefinitionListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getChargeList(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', reqData.CountRecords)
            .append('SearchString', '*' + reqData.SearchString + '*')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/Definitions', {
            headers: header,
            params: reqParam
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
}