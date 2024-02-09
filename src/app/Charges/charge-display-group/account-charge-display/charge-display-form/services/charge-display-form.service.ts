import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ChargeGroupDisplayFormService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getChargeDetail(GroupId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/DisplayGroups/' + GroupId, {
            headers: header,
            params: reqParam
        });
    }

    createChargeGroup(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Charges/DisplayGroups', reqData, {
            headers: header,
            params: reqParam
        });
    }

    updateChargeGroup(reqData, GroupId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + '/Charges/DisplayGroups/' + GroupId, reqData, {
            headers: header,
            params: reqParam
        });
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
}