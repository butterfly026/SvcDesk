import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

import { CheckPasswordComplexityResponse, SuggestPassword, UniqueStatusResponse, ValidateStatusResponse } from "../models";

@Injectable({
  providedIn: 'root'
})

export class NewAccountAuthenticationService {

  constructor(
    public httpClient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { };

  checkLoginIdUniqueStatus(lgoinId: string): Observable<UniqueStatusResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<UniqueStatusResponse>(
      this.config.NewAPIEndPoint + `/Users/Authentication/LoginId/${lgoinId}/Unique`,
      { headers, params }
    );
  };

  checkEmailUniqueStatus(email: string): Observable<UniqueStatusResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<UniqueStatusResponse>(
      this.config.NewAPIEndPoint + `/Users/Authentication/Email/${email}/Unique`,
      { headers, params }
    );
  };

  checkEmailFormatStatus(email: string): Observable<ValidateStatusResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<ValidateStatusResponse>(
      this.config.NewAPIEndPoint + `/Messages/Emails/ValidateFormat/${email}`,
      { headers, params }
    );
  };

  checkMobileUniqueStatus(mobile: string): Observable<UniqueStatusResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<UniqueStatusResponse>(
      this.config.NewAPIEndPoint + `/Users/Authentication/Mobile/${mobile}/Unique`,
      { headers, params }
    );
  };

  checkMobileFormatStatus(mobile: string): Observable<ValidateStatusResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<ValidateStatusResponse>(
      this.config.NewAPIEndPoint + `/Messages/SMSs/ValidateNumber/${mobile}`,
      { headers, params }
    );
  };

  checkPasswordComplexity(password: string): Observable<CheckPasswordComplexityResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0')
      .append('Password', password);

    return this.httpClient.get<CheckPasswordComplexityResponse>(
      this.config.NewAPIEndPoint + '/Users/Passwords/CheckComplexity',
      { headers, params }
    );
  };

  generatePassword(): Observable<SuggestPassword> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<SuggestPassword>(
      this.config.NewAPIEndPoint + '/Users/Passwords/Suggestion',
      { headers, params }
    );
  };

}