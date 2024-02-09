import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";

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

    addNewCharge(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        return this.httpClient.get<any>('assets/fakeDB/Charges/', {
            headers: header
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

    updateCharge(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        return this.httpClient.get<any>('assets/fakeDB/Charges/', {
            headers: header
        });
    }
}