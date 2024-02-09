import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APP_CONFIG, IAppConfig, ContactBillContect, TokenInterface, Token_config } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class BillHistoryService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    ContactBills(contactCode, reqData): Observable<ContactBillContect> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.0')

        return this.httpclient.get<ContactBillContect>(this.config.NewAPIEndPoint + '/Bills/ContactCode/' + contactCode, { headers, params });
    }

    getPDFData() {
        return this.httpclient.get('assets/byte.txt', { responseType: 'arraybuffer' });
    }

    ContactBillsPDF(billID): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            '/Bills/BillImage/Id/' + billID, {
            headers: header, params: param
        });
    }

    ContactBillsExcel(billID): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            '/Bills/BillExcel/Id/' + billID, {
            headers: header, params: param
        });
    }

    deleteBill(billID): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        return this.httpclient.delete<any>(this.config.NewAPIEndPoint +
            '/Bills/Id/' + billID, {
            headers: header, params: param
        });
    }
}
