import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {
    APP_CONFIG, IAppConfig,
    TokenInterface, Token_config
} from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TillService {

  constructor( public httpClient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface) { }

  addPaymentMethod(contactCode:any,reqData:any): Observable<any> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const param = new HttpParams()
        .set('api-version', '1.1');
   
    return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/PaymentMethods/Contacts/' + contactCode + '/CreditCards', reqData, {
        headers: header, params: param
    });
}
}
