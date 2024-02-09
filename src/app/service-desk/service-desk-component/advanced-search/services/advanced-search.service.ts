import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
    APP_CONFIG, IAppConfig, ServiceTypeCode,
    ServiceTypes, 
    BillingCycles, BusinessUnits, NewContactSearch, PlanItem, ContactStatuses, TokenInterface, Token_config
} from 'src/app/model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdvancedSearchService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getServiceTypes(): Observable<ServiceTypes[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');
        const param = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<ServiceTypes[]>(this.config.NewAPIEndPoint + '/search/Services/Types', {
            headers: header, params: param
        });
    }

    getBillingCycles(): Observable<BillingCycles[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<BillingCycles[]>(this.config.NewAPIEndPoint + '/search/Billing/Cycles', {
            headers: header, params: param
        });
    }

    getContactSubTypes(): Observable<BillingCycles[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<BillingCycles[]>(this.config.NewAPIEndPoint + '/search/Contacts/SubTypes', {
            headers: header, params: param
        });
    }

    getBusinessUnits(): Observable<BusinessUnits[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<BusinessUnits[]>(this.config.NewAPIEndPoint + '/search/BusinessUnits', {
            headers: header, params: param
        });
    }

    getPlans(): Observable<PlanItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<PlanItem[]>(this.config.NewAPIEndPoint + '/search/Plans', {
            headers: header, params: param
        });
    }

    getContactStatuses(): Observable<ContactStatuses[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactStatuses[]>(this.config.NewAPIEndPoint + '/search/Contacts/Status', {
            headers: header, params: param
        });
    }

    ContactSearchAdvanced(queryData, bodyData): Observable<NewContactSearch> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const query = new HttpParams()
            .set('SkipRecords', queryData.SkipRecords)
            .append('TakeRecords', queryData.TakeRecords)
            .append('countRecords', 'Y')
            .append('api-version', '1.0');

        return this.httpclient.post<NewContactSearch>(this.config.NewAPIEndPoint + '/search/Contacts/Advanced', bodyData, {
            headers: header, params: query
        });
    }

    addressAutocomplete(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('skipRecords', '0')
            .append('takeRecords', '10');

        const bodyData = {
            "searchString": reqData.Term,
            "accountsOnly": true,
            "businessUnitCode": "MN"
        }

        return this.httpclient.post<any>(this.config.NewAPIEndPoint +
            '/search/Contacts/AutoComplete', bodyData, {
            headers: header, params: param
        });
    }

}
