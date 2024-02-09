import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { AccountConfiguration, AccountStatus, CreateAccountRequestBody } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NewAccountService {

  constructor(
    private httpclient: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(Token_config) private tokens: TokenInterface,
  ) {}

  getConfigrationForPerson(): Observable<AccountConfiguration> {
    const headers = new HttpHeaders()
    .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpclient.get<AccountConfiguration>(
      this.config.NewAPIEndPoint + '/Accounts/OnBoarding/Configuration/Person', 
      { headers, params }
    );
  }

  getConfigrationForCorporate(): Observable<AccountConfiguration> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpclient.get<AccountConfiguration>(
      this.config.NewAPIEndPoint + '/Accounts/OnBoarding/Configuration/Corporate', 
      { headers, params }
    );
  }

  getAccountStatuses(): Observable<AccountStatus[]> {
    const headers = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpclient.get<AccountStatus[]>(
      this.config.NewAPIEndPoint + "/Accounts/Statuses", 
      { headers, params }
    );
  }

  createPersonalAccount(reqData: CreateAccountRequestBody): Observable<void> {
    const headers = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpclient.post<void>(
      this.config.NewAPIEndPoint + "/Accounts/Person", 
      reqData,
      { headers, params }
    );
  }
  
  createCorporateAccount(reqData: CreateAccountRequestBody): Observable<void> {
    const headers = new HttpHeaders()
        .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpclient.post<void>(
      this.config.NewAPIEndPoint + "/Accounts/Corporate", 
      reqData,
      { headers, params }
    );
  }
}
