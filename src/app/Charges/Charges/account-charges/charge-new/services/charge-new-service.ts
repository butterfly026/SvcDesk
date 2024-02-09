import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";
import { ChargeProfile, ValidateType } from "../../charges.types";

@Injectable({
    providedIn: 'root'
})

export class ChargeNewService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }

    addNewCharge(ContactCode: string, reqData: ChargeProfile): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/Accounts/' + ContactCode, reqData, {
            headers: header,
            params: reqParam
        });
    }

    updateCharge(ProfileId: string, reqData: ChargeProfile): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/' + ProfileId, reqData, {
            headers, params
        });
    }

    getCurrentCharge(chargeId): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/' + chargeId, {
            headers, params
        });
    }

    getDefinitionCharge(chargeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Definitions/' + chargeId, {
            headers: header,
            params: reqParam
        });
    }

    getLimitAccountDefinition(ContactCode, chargeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Limits/Accounts/' + ContactCode + '/Definitions/' + chargeId, {
            headers: header,
            params: reqParam
        });
    }

    getSearchAccountCharge(ContactCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')
            .append('SearchString', reqData.SearchString)

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Definitions/Search/Accounts/' + ContactCode, {
            headers: header,
            params: reqParam
        });
    }

    validateNew(ContactCode: string, reqData: ValidateType): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.3')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/Accounts/' + ContactCode + '/ValidateNew', {
            headers: header,
            params: reqParam
        });
    }

    validateUpdate(ProfileId: string, reqData: ValidateType): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.3')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + `/Charges/Profiles/${ProfileId}/ValidateUpdate`, {
            headers, params
        });
    }

}