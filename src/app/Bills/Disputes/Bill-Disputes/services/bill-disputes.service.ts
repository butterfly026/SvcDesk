import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { BillDispute, GetBillDisputesResponse, UpdateBillDisputesRequest } from '../models/bill-dispute.model';

@Injectable({
  providedIn: 'root'
})
export class BillDisputesService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
  }

  getBillDisputesForBill(reqData, billId): Observable<GetBillDisputesResponse> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams({ fromObject: { ...reqData} })
        .append('api-version', '1.0')

    return this.httpclient.get<GetBillDisputesResponse>(this.config.NewAPIEndPoint + '/Bills/Disputes/BillId/' + billId, { headers, params });
  }
  
  createBillDisputes(reqBody, BillId): Observable<void> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const param = new HttpParams()
        .set('api-version', '1.0')

    return this.httpclient.post<void>(this.config.NewAPIEndPoint + '/Bills/Disputes/BillId/' + BillId, reqBody, {
        headers: header, params: param
    });
  }

  deleteBillDispute(Id): Observable<void> {
      const header = new HttpHeaders()
          .set('Authorization', this.tokens.AccessToken)
          .append('Content-Type', 'application/json');

      const param = new HttpParams()
          .set('api-version', '1.0')

      return this.httpclient.delete<void>(this.config.NewAPIEndPoint + '/Bills/Disputes/Id/' + Id, {
          headers: header, params: param
      });
  }

  getBillDisputeDetail(Id): Observable<BillDispute> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const param = new HttpParams()
        .set('api-version', '1.0')

    return this.httpclient.get<BillDispute>(this.config.NewAPIEndPoint + '/Bills/Disputes/Id/' + Id, {
        headers: header, params: param
    });
  }

  updateBillDispute(reqBody: UpdateBillDisputesRequest, BillId): Observable<void> {
      const header = new HttpHeaders()
          .set('Authorization', this.tokens.AccessToken)
          .append('Content-Type', 'application/json');

      const param = new HttpParams()
          .set('api-version', '1.0')

      return this.httpclient.patch<void>(this.config.NewAPIEndPoint + '/Bills/Disputes/Id/' + BillId, reqBody, {
          headers: header, params: param
      });
  }

  getBills(ContactCode): Observable<any> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.0')

    return this.httpclient.get<any>(this.config.NewAPIEndPoint + `/Bills/Disputes/Contacts/${ContactCode}/Bills`, { headers, params });
  }

}
