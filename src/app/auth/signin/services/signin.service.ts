import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IAppConfig, APP_CONFIG, Token_config, TokenInterface } from 'src/app/model';
import { CredentialFailureDetails, CredentialSuccessDetails, LogFailedLoginRequest, LogSuccessLoginRequest, PasswordInformation, PasswordResetConfiguration, RefreshTokenRequest, SiteConfiguration } from '../models';

@Injectable({
  providedIn: 'root'
})

export class SignInService {

  constructor(
    public httpClient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) private tokens: TokenInterface,
  ) {
  }

  loggedIn() {
    return this.tokens.AccessToken !== '';
  }

  getUser() {
    return this.tokens.UserCode;
  }

  getJWT(siteId: string): Observable<string> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    const params = new HttpParams()
      .set('api-version', '1.2');

    return this.httpClient.post<string>(this.config.NewAPIEndPoint + '/authentication/Anonymous/Site:' + siteId, {}, { headers, params });
  }

  getSiteConfigurationDefault(token: string): Observable<SiteConfiguration> {
    const headers = new HttpHeaders()
      .set('Authorization', token)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<SiteConfiguration>(this.config.NewAPIEndPoint + '/Configurations/Sites/Default', { headers, params });
  }

  getRefreshToken(reqData: RefreshTokenRequest): Observable<CredentialSuccessDetails | CredentialFailureDetails> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '3.1');

    if (reqData.signType == 'username') {
      return this.httpClient.post<CredentialSuccessDetails | CredentialFailureDetails>(
        this.config.NewAPIEndPoint + '/Authentication/' + reqData.SiteId + '/SelcommUser/username:' + reqData.UserId + '/Token/Refresh',
        JSON.stringify(reqData.Password),
        { headers, params }
      );
    } else {
      return this.httpClient.post<CredentialSuccessDetails | CredentialFailureDetails>(
        this.config.NewAPIEndPoint + '/Authentication/' + reqData.SiteId + '/SelcommUser/' + reqData.UserId + '/Token/Refresh',
        JSON.stringify(reqData.Password),
        { headers, params }
      );
    }
  }

  getAccessToken(): Observable<CredentialSuccessDetails | CredentialFailureDetails> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.Type + ' ' + this.tokens.RefreshToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '3.1');

    return this.httpClient.post<CredentialSuccessDetails | CredentialFailureDetails>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/Token/Access', {}, { headers, params });
  }

  passwordResetConfiguration(token): Observable<PasswordResetConfiguration> {
    const headers = new HttpHeaders()
      .set('Authorization', token)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<PasswordResetConfiguration>(this.config.NewAPIEndPoint + '/Users/Passwords/Reset/Configuration', { headers, params });
  }

  getPasswordInformation(ContactCode): Observable<PasswordInformation> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.get<PasswordInformation>(this.config.NewAPIEndPoint + '/Users/PasswordInformation/Contact/' + ContactCode, { headers, params });
  }

  logSignInSuccess(reqData: LogSuccessLoginRequest, ContactCode: string): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.post<void>(this.config.NewAPIEndPoint + '/Users/Login/Approved/Contact/' + ContactCode, reqData, { headers, params });
  }

  logSignInFailure(reqData: LogFailedLoginRequest, tempToken: string): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', tempToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0');

    return this.httpClient.post<void>(this.config.NewAPIEndPoint + '/Users/Login/Denied', reqData, { headers, params });
  }

}
