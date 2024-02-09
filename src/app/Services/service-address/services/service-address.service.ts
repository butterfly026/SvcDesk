import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import {
    AddressConfiguration, 
    AddressDetail, 
    ServiceAddressMandatoryRule,
    ServiceAddressStateType, 
    ServiceAddressType, 
    ServiceAddressUsageHistoryItem, 
    CountryDetail, 
    GetServiceAddressUsageResponse, 
    PostCodeDetail, 
    ServiceAddressUpdateRequestBody
} from '../models';

@Injectable({
    providedIn: 'root'
})

export class ServiceAddressService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServiceAddressTypes(): Observable<ServiceAddressType[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<ServiceAddressType[]>(
            this.config.NewAPIEndPoint + '/Services/Addresses/Types', 
            { headers, params }
        );
    }

    getAddressConfiguration(): Observable<AddressConfiguration> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<AddressConfiguration>(
            this.config.NewAPIEndPoint + '/AddressDatabases/Configuration',
            { headers, params }
        );
    }

    getAddressStates(countryCode): Observable<ServiceAddressStateType[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<ServiceAddressStateType[]>(
            this.config.NewAPIEndPoint + `/Services/Addresses/Country/${countryCode}/States`,
            { headers, params }
        );
    }

    getServiceAddressMandatoryRules(serviceTypeId: number): Observable<ServiceAddressMandatoryRule[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<ServiceAddressMandatoryRule[]>(
            this.config.NewAPIEndPoint + `/Services/ServiceTypes/${serviceTypeId}/Addresses/MandatoryRules/`,
            { headers, params }
        );
    }

    getServiceAddressUsage(serviceReference: number): Observable<GetServiceAddressUsageResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2')
            .append('IncludeTypes', 'true')
            .append('IncludeMandatoryRules', 'true');

        return this.httpclient.get<GetServiceAddressUsageResponse>(
            this.config.NewAPIEndPoint + `/Services/${serviceReference}/Addresses/Usage/`,
            { headers, params }
        );
    }

    updateServiceAddressUsage(reqData: ServiceAddressUpdateRequestBody, serviceReference: number): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.post<void>(
            this.config.NewAPIEndPoint + `/Services/${serviceReference}/Addresses/Usage`, 
            reqData,
            { headers, params }
        );
    }

    getServiceAddressUsageHistory(serviceReference: number): Observable<ServiceAddressUsageHistoryItem[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<ServiceAddressUsageHistoryItem[]>(
            this.config.NewAPIEndPoint + `/Services/${serviceReference}/Addresses/UsageHistory/`,
            { headers, params }
        );
    }

    getCountries(): Observable<CountryDetail[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<CountryDetail[]>(
            this.config.NewAPIEndPoint + '/Services/Addresses/countries',
            { headers, params }
        );
    }

    getPostalLocalities(postCode, countryCode): Observable<PostCodeDetail[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<PostCodeDetail[]>(
            this.config.NewAPIEndPoint + `/Services/Addresses/postallocalities/Country/${countryCode}/PostCode/${postCode}`,
            { headers, params }
        );
    }

    getAustraliaAddressList(reqData): Observable<{ Address: string }[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')
            .append('Term', reqData.Term)
            .append('CloseMatches', 'true')

        return this.httpclient.get<{ Address: string }[]>(
            this.config.NewAPIEndPoint + '/AddressDatabases/AutocompleteAustralian',
            { headers, params }
        );
    }

    getAustraliaAddressDetail(reqData): Observable<AddressDetail> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')
            .append('Term', reqData.Term);

        return this.httpclient.get<AddressDetail>(
            this.config.NewAPIEndPoint + '/AddressDatabases/ParseAustralian',
            { headers, params }
        );
    }

}
