import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
    APP_CONFIG, IAppConfig,
    ContactAddressType, State, Country, PostCodeSearchResult,
    ContactAddressUsage,
    ContactAddressUsageUpdate, ContactAddressHistory, ContactAddressMandatoryRules, TokenInterface, Token_config,
} from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AddressifyService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    ContactAddressTypes(): Observable<ContactAddressType[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactAddressType[]>(this.config.NewAPIEndPoint + '/ContactAddresses/Types', {
            headers: header, params: param
        });
    }

    States(CountryCode): Observable<State[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactAddressType[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/Country/' + CountryCode + '/States', {
            headers: header, params: param
        });
    }

    ContactAddressMandatoryRules(ContactCode): Observable<ContactAddressMandatoryRules[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactAddressMandatoryRules[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/MandatoryRules/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

    ContactAddressUsage(ContactCode): Observable<ContactAddressUsage> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('IncludeTypes', 'true')
            .append('IncludeMandatoryRules', 'true');

        return this.httpclient.get<ContactAddressUsage>(this.config.NewAPIEndPoint + '/Contacts/Addresses/Usage/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

    ContactAddressUsageUpdate(reqData: ContactAddressUsageUpdate): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Contacts/Addresses/UsageUpdate', reqData, {
            headers: header, params: param
        });
    }

    ContactAddressUsageHistory(ContactCode): Observable<ContactAddressHistory[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactAddressHistory[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/UsageHistory/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

    StreetTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactAddressType[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/streetTypes', {
            headers: header, params: param
        });
    }

    Countries(): Observable<Country[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<Country[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/countries', {
            headers: header, params: param
        });
    }

    PostalLocalities(PostCode, CountryCode): Observable<PostCodeSearchResult[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<PostCodeSearchResult[]>(this.config.NewAPIEndPoint + '/Contacts/Addresses/postallocalities/Country/' +
            CountryCode + '/PostCode/' + PostCode, {
            headers: header, params: param
        });
    }

    getAustraliaAddressList(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('Term', reqData.Term)
            .append('CloseMatches', 'true')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            '/AddressDatabases/AutocompleteAustralian', {
            headers: header, params: param
        });
    }

    getAustraliaAddressDetail(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('Term', reqData.Term);

        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            '/AddressDatabases/ParseAustralian', {
            headers: header, params: param
        });
    }



}
