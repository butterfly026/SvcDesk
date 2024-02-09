import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";
import { ServiceChargeItem, ValidateType } from "../../charges.types";

@Injectable({
    providedIn: 'root'
})

export class ChargeFormService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }

    validateNew(ServiceReference, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.3')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/Services/' + ServiceReference + '/ValidateNew', {
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

    addNewCharge(ServiceReference, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/Services/' + ServiceReference, reqData, {
            headers: header,
            params: reqParam
        });
    }

    updateCharge(ProfileId: string, reqData: ServiceChargeItem): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/' + ProfileId, reqData, {
            headers, params
        });
    }

    getCurrentCharge(chargeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Profiles/' + chargeId, {
            headers: header,
            params: reqParam
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

    getLimitAccountDefinition(ServiceReference, chargeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Limits/Services/' + ServiceReference + '/Definitions/' + chargeId, {
            headers: header,
            params: reqParam
        });
    }

    getSearchAccountCharge(ServiceReference, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')
            .append('SearchString', reqData.SearchString)

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Charges/Definitions/Search/Services/' + ServiceReference, {
            headers: header,
            params: reqParam
        });
    }
}