import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
    APP_CONFIG, IAppConfig,
    ContactAddressUsageUpdate, ContactAddressMandatoryRules, TokenInterface, Token_config
} from 'src/app/model';
import { Observable } from 'rxjs';
import { AddressConfiguration, AddressDetail, ContactAddressStateType, ContactAddressType, ContactAddressUsageHistoryItem, CountryDetail, GetContactAddressUsageResponse, PostCodeDetail } from '../models';

@Injectable({
    providedIn: 'root'
})

export class ContactsAddressService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getContactAddressTypes(): Observable<ContactAddressType[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactAddressType[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/Types', { headers, params });
    }

    getAddressConfiguration(): Observable<AddressConfiguration> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<AddressConfiguration>(this.config.NewAPIEndPoint + '/AddressDatabases/Configuration',{ headers, params });
    }

    getAddressStates(CountryCode): Observable<ContactAddressStateType[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactAddressStateType[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/Country/' + CountryCode + '/States',{ headers, params });
    }

    getContactAddressMandatoryRules(ContactCode): Observable<ContactAddressMandatoryRules[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactAddressMandatoryRules[]>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Addresses/MandatoryRules/',{ headers, params });
    }

    getContactAddressUsage(ContactCode): Observable<GetContactAddressUsageResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1')
            .append('IncludeTypes', 'true')
            .append('IncludeMandatoryRules', 'true');

        return this.httpclient.get<GetContactAddressUsageResponse>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Addresses/Usage/',{ headers, params });
    }

    updateContactAddressUsage(reqData: ContactAddressUsageUpdate, ContactCode: string): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Addresses/UsageUpdate/', reqData,{ headers, params });
    }

    getContactAddressUsageHistory(ContactCode): Observable<ContactAddressUsageHistoryItem[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactAddressUsageHistoryItem[]>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Addresses/UsageHistory/',{ headers, params });
    }

    getCountries(): Observable<CountryDetail[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<CountryDetail[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/countries',{ headers, params });
    }

    getPostalLocalities(PostCode, CountryCode): Observable<PostCodeDetail[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<PostCodeDetail[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/postallocalities/Country/' +
            CountryCode + '/PostCode/' + PostCode,{ headers, params });
    }

    getAustraliaAddressList(reqData): Observable<{ Address: string }[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')
            .append('Term', reqData.Term)
            .append('CloseMatches', 'true')

        return this.httpclient.get<{ Address: string }[]>(this.config.NewAPIEndPoint +
            '/AddressDatabases/AutocompleteAustralian',{ headers, params });
    }

    getAustraliaAddressDetail(reqData): Observable<AddressDetail> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')
            .append('Term', reqData.Term);

        return this.httpclient.get<AddressDetail>(this.config.NewAPIEndPoint +
            '/AddressDatabases/ParseAustralian',{ headers, params });
    }



}
