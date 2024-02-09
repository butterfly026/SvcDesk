import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class BillOptionsService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getBillOptions(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');


        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillingOptions/AccountCode/' + AccountCode, {
            headers: header, params: param,
        });

    }

    getBillFormats(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');


        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillFormats/AccountCode/' + AccountCode, {
            headers: header, params: param,
        });
    }

    getBillFormatsAvailable(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');


        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillFormats', {
            headers: header, params: param,
        });
    }

    putBillFormats(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');


        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/BillFormats/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param,
        });
    }

    getBillCyclesAccount(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillCycles/AccountCode/' + AccountCode, {
            headers: header, params: param,
        });
    }

    getBillCyclesAvailable(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillCycles/Available/AccountCode/' + AccountCode, {
            headers: header, params: param,
        });
    }

    putBillCycles(AccountCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/BillCycles/AccountCode/' + AccountCode, reqData, {
            headers: header, params: param,
        });
    }

    getInvoiceIntervals(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/InvoiceIntervals/AccountCode/' + AccountCode, {
            headers: header, params: param,
        });
    }

    getInvoiceIntervalsAvailable(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/InvoiceIntervals', {
            headers: header, params: param
        });
    }

    putInvoiceIntervals(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/InvoiceIntervals/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }

    getBillRunExclusions(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillRunExclusions/AccountCode/' + AccountCode, {
            headers: header, params: param,
        });
    }

    billRunExclusions(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
            headers: header, params: param,
        });
    }

    postBillRunExclusions(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Accounts/BillRunExclusions/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param,
        });
    }

    updateBillRunExclusions(AccountCode, billId, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/BillRunExclusions/AccountCode/' + AccountCode + '/Id/' + billId
            , reqBody, {
            headers: header, params: param,
        });
    }

    deleteBillRunExclusions(AccountCode, billId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Accounts/BillRunExclusions/AccountCode/' + AccountCode + '/Id/' + billId, {
            headers: header, params: param,
        });
    }

    getCurrency(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/Currencies/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    getCurrencyAvailable(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/Currencies/Available/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    puttCurrency(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/Currencies/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }

    getTaxes(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/Taxes/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    getTaxesAvailable(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/Taxes', {
            headers: header, params: param
        });
    }

    putTaxes(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/Taxes/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }

    getTaxExemptions(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/TaxExemptions/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    postTaxExemptions(AccountCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Accounts/TaxExemptions/AccountCode/' + AccountCode, reqData, {
            headers: header, params: param
        });
    }

    updateTaxExemptions(taxId, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/TaxExemptions/AccountCode/' + reqData.ContactCode
            + '/Id/' + taxId, reqData, {
            headers: header, params: param
        });
    }

    deleteTaxExemptions(taxId, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Accounts/TaxExemptions/AccountCode/' + ContactCode
            + '/Id/' + taxId, {
            headers: header, params: param
        });
    }

    getTransactionTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/TaxTransactionTypes', {
            headers: header, params: param
        });
    }

    getTaxRates(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/TaxRates', {
            headers: header, params: param
        });
    }

    getTerms(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/Terms', {
            headers: header, params: param
        });
    }

    getTermsAccount(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');
        //
        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/Terms/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    putTermsAccount(AccountCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/Terms/AccountCode/' + AccountCode, reqData, {
            headers: header, params: param
        });
    }

    getBillProofs(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/BillProofs/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    postBillProofs(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Accounts/BillProofs/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }

    putBillProofs(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/BillProofs/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }

    deleteBillProofs(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Accounts/BillProofs/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    getBillReturns(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/ReturnReasons/AccountCode/' + AccountCode, {
            headers: header, params: param
        });
    }

    getBillReturnsAvailable(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/ReturnReasons', {
            headers: header, params: param
        });
    }

    postBillReturns(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Accounts/ReturnReasons/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }

    deleteBillReturns(AccountCode, Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.delete<any>(this.config.MockingAPIEndPoint + '/Accounts/1.0/ReturnReasons/AccountCode/' + AccountCode + '/Id/' + Id, {
            headers: header, params: param
        });
    }

    putBillDeliveryOptions(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/BillDeliveryOptions/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }

    putBillMediaOptions(AccountCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/BillMediaOptions/AccountCode/' + AccountCode, reqBody, {
            headers: header, params: param
        });
    }

}