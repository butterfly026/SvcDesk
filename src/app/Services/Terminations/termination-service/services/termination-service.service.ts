import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";
import { TerminationConfiguration } from "../termination-service.component.type";

@Injectable({
    providedIn: 'root'
})

export class TerminationService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) { }

    getTerminationReasons(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<any[]>(this.config.NewAPIEndPoint + '/Services/Terminations/Reasons', { headers: header, params: params });
    }

    getTerminationServiceReference(ServiceReference): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<any[]>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Terminations', { headers: header, params: params });
    }

    getUnbilledUsageTransactionTotals(ServiceReference): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<any[]>(this.config.NewAPIEndPoint + '/UsageTransactions/Services/' + ServiceReference + '/Uninvoiced/Totals', { headers: header, params: params });
    }

    getContractPenaltyMethods(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<any[]>(this.config.NewAPIEndPoint + '/Services/Terminations/ContractPenaltyMethods', { headers: header, params: params });
    }

    postTermination(ServiceReference, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.post<any[]>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Terminations', reqBody, { headers: header, params: params });
    }

    cancelTerminationServiceReference(ServiceReference): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.patch<any[]>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Terminations/Cancel', {}, { headers: header, params: params });
    }

    getTerminationsPenalty(ServiceReference, TerminationDateTime): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2')
            .append('TerminationDateTime', TerminationDateTime);

        return this.httpClient.get<any[]>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Terminations/Penalty', { headers: header, params: params });
    }

    getTerminationsInformation(ServiceReference, TerminationDateTime): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2')
            .append('TerminationDateTime', TerminationDateTime);

        return this.httpClient.get<any[]>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Terminations/Information', { headers: header, params: params });
    }

    getTerminationsConfigurations(ServiceReference): Observable<TerminationConfiguration> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const params = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.get<TerminationConfiguration>(this.config.NewAPIEndPoint + '/Services/ServiceTypes/' + ServiceReference + '/Terminations/Configurations', { headers: header, params: params });
    }
}