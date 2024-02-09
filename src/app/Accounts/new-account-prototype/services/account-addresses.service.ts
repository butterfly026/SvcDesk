import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import {
    AddressConfiguration, 
    AddressDetail, 
    AccountAddressMandatoryRule,
    AccountAddressStateType, 
    AccountAddressType, 
    CountryDetail, 
    PostCodeDetail
} from '../models';

@Injectable({
    providedIn: 'root'
})

export class AccountAddressesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getAccountAddressTypes(): Observable<AccountAddressType[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<AccountAddressType[]>(
            this.config.NewAPIEndPoint + '/Contacts/Addresses/Types', 
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

    getAddressStates(countryCode): Observable<AccountAddressStateType[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<AccountAddressStateType[]>(
            this.config.NewAPIEndPoint + `/Contacts/Addresses/Country/${countryCode}/States`,
            { headers, params }
        );
    }

    getAccountAddressMandatoryRules(accountType: string): Observable<AccountAddressMandatoryRule[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<AccountAddressMandatoryRule[]>(
            this.config.NewAPIEndPoint + `/Contacts/ContactTypes/${accountType}/Addresses/MandatoryRules/`,
            { headers, params }
        );
    }

    getCountries(): Observable<CountryDetail[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<CountryDetail[]>(
            this.config.NewAPIEndPoint + '/Contacts/Addresses/countries',
            { headers, params }
        );
    }

    getPostalLocalities(postCode, countryCode): Observable<PostCodeDetail[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<PostCodeDetail[]>(
            this.config.NewAPIEndPoint + `/Contacts/Addresses/postallocalities/Country/${countryCode}/PostCode/${postCode}`,
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
