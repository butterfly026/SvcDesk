import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ChargeDefinitionFormService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getChargeDetail(Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/Definitions/' + Id, {
            headers: header,
            params: reqParam
        });
    }

    getServiceTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.2')
            .append('IncludePseudo', 'true')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Services/ServiceTypes/Select', {
            headers: header,
            params: reqParam
        });
    }

    getAnniversaryTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/AnniversaryTypes', {
            headers: header,
            params: reqParam
        });
    }

    getGroups(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/Groups', {
            headers: header,
            params: reqParam
        });
    }

    getDisplayGroups(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/DisplayGroups', {
            headers: header,
            params: reqParam
        });
    }

    getFrequencies(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.3')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Charges/Frequencies', {
            headers: header,
            params: reqParam
        });
    }

    getGeneralLedgerAccounts(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')
            .append('TypeId', reqData.TypeId)
            .append('SearchString', '*' + reqData.SearchString + '*')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/GeneralLedger/Accounts', {
            headers: header,
            params: reqParam
        });
    }
}