import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { AddBankPaymentMethodRequestBody, AddCreditCardPaymentMethodRequestBody, CreditCardValidationMessage, PaymentMethod } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  getPaymentMethods(contactCode: string): Observable<PaymentMethod[]> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.1')
        .append('Open', 'true')
        .append('DefaultOnly', 'false')

    return this.httpclient.get<PaymentMethod[]>(
      this.config.NewAPIEndPoint + `/PaymentMethods/Contacts/${contactCode}`, 
      { headers, params }
    );
  }

  addCreditCardPaymentMethod(reqBody: AddCreditCardPaymentMethodRequestBody, contactCode: string): Observable<void> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.1');

    return this.httpclient.post<void>(
      this.config.NewAPIEndPoint + `/PaymentMethods/Contacts/${contactCode}/CreditCards`, 
      reqBody, 
      { headers, params }
    );
  }

  addBankPaymentMethod(reqBody: AddBankPaymentMethodRequestBody, contactCode: string): Observable<void> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.1');

    return this.httpclient.post<void>(
      this.config.NewAPIEndPoint + `/PaymentMethods/Contacts/${contactCode}/Banks`, 
      reqBody, 
      { headers, params }
    );
  }

  validateCreditCardNumber(creditCardNumber: string): Observable<CreditCardValidationMessage> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.1');

    return this.httpclient.get<CreditCardValidationMessage>(
      this.config.NewAPIEndPoint + `/PaymentMethods/CreditCardNumber/${creditCardNumber}/Validate`, 
      { headers, params }
    );
  }
}
