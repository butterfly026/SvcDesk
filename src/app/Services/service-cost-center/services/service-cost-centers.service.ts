import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config, } from 'src/app/model';
import { 
    GetAllCostCentersResponse, 
    CostCenter, 
    CostCenterConfiguration, 
    CreateCostCenterRequestBody, 
    GeneralLedgerAccount, 
    GetGeneralLedgerRequest, 
    UpdateCostCenterRequestBody } from '../models';

@Injectable({
    providedIn: 'root'
})

export class ServiceCostCentersService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getGeneralLedger(reqData: GetGeneralLedgerRequest): Observable<GeneralLedgerAccount[]> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.0');

        return this.httpclient.get<GeneralLedgerAccount[]>(
            this.config.NewAPIEndPoint + '/GeneralLedger/Accounts', 
            { headers, params }
        );
    }

    getAllCostCenters(reqData: Paging, serviceReference: string): Observable<GetAllCostCentersResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.2');
            
        return this.httpclient.get<GetAllCostCentersResponse>(
            this.config.NewAPIEndPoint + `/CostCenters/Services/${serviceReference}`, 
            { headers, params }
        );
    }

    createCostCenter(reqData: CreateCostCenterRequestBody, serviceReference: string): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.post<void>(
            this.config.NewAPIEndPoint + `/CostCenters/Services/${serviceReference}`, 
            reqData, 
            { headers, params }
        );
    }

    updateCostCenter(reqData: UpdateCostCenterRequestBody, costCenterId: number): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.patch<void>(
            this.config.NewAPIEndPoint + `/CostCenters/${costCenterId}`, 
            reqData, 
            { headers, params }
        );
    }

    deleteCostCenter(costCenterId: number): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.delete<void>(
            this.config.NewAPIEndPoint + `/CostCenters/${costCenterId}`, 
            { headers, params }
        );
    }

    getCostCenterConfiguration(): Observable<CostCenterConfiguration> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<CostCenterConfiguration>(
            this.config.NewAPIEndPoint + '/CostCenters/Configuration', 
            { headers, params }
        );
    }
    getCostCenter(costCenterId: number): Observable<CostCenter> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<CostCenter>(
            this.config.NewAPIEndPoint + `/CostCenters/${costCenterId}`, 
            { headers, params }
        );
    }
    
}
