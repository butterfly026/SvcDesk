import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  CustomerEmailItem, CustomerContactPhoneItem, ContactPhoneTypeItem, ContactQuestionsTypeItem, CustomerAddressTypeItem, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CustomerNewService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    SubmitAddress(): Observable<CustomerEmailItem[]> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<CustomerEmailItem[]>('assets/fakeDB/customerEmails.json', {
            headers: header, params: reqParam
        });
    }

    getPhoneList(): Observable<CustomerContactPhoneItem[]> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<CustomerContactPhoneItem[]>('assets/fakeDB/customerContactPhones.json', {
            headers: header, params: reqParam
        });
    }

    getPhoneTypeList(): Observable<ContactPhoneTypeItem[]> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<ContactPhoneTypeItem[]>(this.config.MockingAPIEndPoint + 'ContactPhones/1.0.0/ContactPhoneTypeList', {
            headers: header
        });
    }

    getCustomerInfo(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<CustomerContactPhoneItem[]>('assets/fakeDB/customerAddInfo.json', {
            headers: header, params: reqParam
        });
    }

    getQueList(): Observable<ContactQuestionsTypeItem[]> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<ContactQuestionsTypeItem[]>('assets/fakeDB/customerQuestions.json', {
            headers: header, params: reqParam
        });
    }

    getQueTypeList(): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<any>('assets/fakeDB/customerQueTypeList.json', {
            headers: header, params: reqParam
        });
    }

    getAddressTypeList(): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<any>('assets/fakeDB/CustomerAddressTypeList.json', {
            headers: header, params: reqParam
        });
    }

    getAddressList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<any>('assets/fakeDB/CustomerAddressList.json', {
            headers: header, params: reqParam
        });
    }

    getCountryList() {
        return this.httpclient.get('assets/fakeDB/countryList.json');
    }

    getSuburbState(PostCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('PostCode', PostCode);

        return this.httpclient.get<any>('assets/fakeDB/suburbState.json', {
            headers: header, params: reqParam
        });
    }

    getAssContactList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<any>('assets/fakeDB/CustomerAssContactList.json', {
            headers: header, params: reqParam
        });
    }

}
