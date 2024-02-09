import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from "src/app/model";
import { ChargeDefinition, ChargeOverride, PlanDefinition } from "../../charge-overrides.types";

@Injectable({
    providedIn: 'root'
})

export class ServiceChargeOverrideService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }

    getPlanDefinitions(ServiceReference: string, reqData: Paging): Observable<PlanDefinition[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.2');

        return this.httpClient.get<PlanDefinition[]>(this.config.NewAPIEndPoint + `/Services/${ServiceReference}/Plans/Available`, {
            headers: header, params: param
        });
    }

    getChargeDefinitions(ServiceReference: string, reqData: Paging): Observable<ChargeDefinition[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.3');

        return this.httpClient.get<ChargeDefinition[]>(this.config.NewAPIEndPoint + `/Charges/Definitions/Services/${ServiceReference}`, {
            headers: header, params: param
        });
    }

    getChargeOverrides(reqData: Paging, ServiceReference): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.3');

        return this.httpClient.get(this.config.NewAPIEndPoint + '/Charges/PriceOverrides/Services/' + ServiceReference, {
            headers: header, params: param
        });
    }

    endChargeOverrides(chargeId, reqData): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.3');

        return this.httpClient.patch(this.config.NewAPIEndPoint + '/Charges/PriceOverrides/' + chargeId, reqData, {
            headers: header, params: param
        });
    }

    createChargeOverride(ServiceReference, reqData): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.3');

        return this.httpClient.post(this.config.NewAPIEndPoint + '/Charges/PriceOverrides/Services/' + ServiceReference, reqData, {
            headers: header, params: param
        });
    }

    updateChargeOverride(chargeId: string, reqData): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.3');

        return this.httpClient.patch(this.config.NewAPIEndPoint + '/Charges/PriceOverrides/' + chargeId, reqData, {
            headers: header, params: param
        });
    }

    getChargeOverride(chargeId): Observable<ChargeOverride> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.3');

        return this.httpClient.get<ChargeOverride>(this.config.NewAPIEndPoint + '/Charges/PriceOverrides/' + chargeId, {
            headers: header, params: param
        });
    }

    deleteChargeOverrides(chargeId): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.3');

        return this.httpClient.delete(this.config.NewAPIEndPoint + '/Charges/PriceOverrides/' + chargeId, {
            headers: header, params: param
        });
    }
}