import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { Observable } from 'rxjs';
import { CreateNewAccountRequestBody, ValidationResponse } from "../new-account.types";

@Injectable({
    providedIn: 'root'
})

export class AccountNewService {
    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getValidIdx(arr: any[]) {
        let idx = arr.length;
        let bExist = true;
        while (bExist) {
            var nCnt = 0;
            arr.forEach(function (item) {
                if (idx == item.idx) {
                    nCnt++;
                }
            });
            if (nCnt == 0) {
                bExist = false;
            } else {
                idx++;
            }
        }
        return idx;
    }

    getNewAccountAuthorization(api): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + api, {
            headers: header,
            params: reqParam
        });
    }

    getStatusList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Accounts/Statuses", {
            headers: header,
            params: reqParam
        });
    }

    getSubTypeList(Id: string): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + `/Contacts/SubTypes/${Id}`, {
            headers, params
        });
    }

    getNextAccountId(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.post<any>(this.config.NewAPIEndPoint + "/Accounts/NextId", {}, {
            headers: header,
            params: reqParam
        });
    }

    getCurrenyList(bsnsUnitCode) {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Accounts/Currencies/BusinessUnitCode/" + bsnsUnitCode, {
            headers: header,
            params: reqParam
        });

    }

    getTimeZoneList(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1')
            .append('TakeRecords', 50)
            .append('SearchString', reqData.SearchString)
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Timezones/Search', {
            headers: header,
            params: reqParam
        });

    }
    getDefaultTimeZone(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Contacts/Timezones/Default", {
            headers: header,
            params: reqParam
        });
    }

    getCreditTerms(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Accounts/Terms", {
            headers: header,
            params: reqParam
        });
    }

    getTaxesList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Accounts/Taxes", {
            headers: header,
            params: reqParam
        });
    }

    getAvailableBillCylce(bsnsCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Accounts/BillCycles/Available/BusinessUnitCode/" + bsnsCode, {
            headers: header,
            params: reqParam
        });
    }
    getDefaultTaxId() {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Accounts/Currencies", {
            headers: header,
            params: reqParam
        });

    }

    getCreditStatusList() {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Accounts/CreditStatuses", {
            headers: header,
            params: reqParam
        });
    }
    getBillFormatList() {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Accounts/BillFormats", {
            headers: header,
            params: reqParam
        });
    }

    getChannelPartnerList(SearchString: string) {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.2')
            .append('TakeRecords', 50)
            .append('SkipRecords', 0)
            .append('CountRecords', 'Y')
            .append('SearchString', SearchString);

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/ChannelPartners", {
            headers: header,
            params: reqParam
        });
    }

    getSalesPersonList(Id: string, SearchString: string) {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.2')
            .append('TakeRecords', 50)
            .append('SkipRecords', 0)
            .append('CountRecords', 'Y')
            .append('SearchString', SearchString);
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/ChannelPartners/" + Id + "/Salespersons", {
            headers: header,
            params: reqParam
        });
    }

    getContactSalesPersonList(SearchString: string) {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1')
            .append('TakeRecords', 50)
            .append('SkipRecords', 0)
            .append('CountRecords', 'Y')
            .append('SearchString', SearchString);
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + "/Contacts/Salespersons", {
            headers: header,
            params: reqParam
        });
    }

    saveNewAccountForPerson(reqData: CreateNewAccountRequestBody): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0');
            
        return this.httpclient.post<void>(
            this.config.NewAPIEndPoint + "/Accounts/Person", 
            reqData, 
            {headers, params}
        );
    }

    saveNewAccountForCorporation(reqData: CreateNewAccountRequestBody): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0');
            
        return this.httpclient.post<void>(
            this.config.NewAPIEndPoint + "/Accounts/Corporate", 
            reqData, 
            {headers, params}
        );
    }

    checkValidation(AttributeName: string, value: string): Observable<ValidationResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<ValidationResponse>(this.config.NewAPIEndPoint + `/Configurations/Validations/Standard/${AttributeName}/Value/${value}`, {
            headers, params
        });
    }
}