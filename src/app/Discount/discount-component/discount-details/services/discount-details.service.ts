import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { DiscountInstance } from '../../discount-list/discount-list.component.type';

@Injectable({
  providedIn: 'root'
})
export class DiscountDetailsService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {

  }

  getDiscountDetail(discountId: number): Observable<DiscountInstance> {
    const header = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const reqParam = new HttpParams()
      .set('api-version', '1.2');

    return this.httpclient.get<DiscountInstance>(this.config.NewAPIEndPoint + `/Services/Discounts/Instances/${discountId}`, {
        headers: header, params: reqParam
    });
  }
}
