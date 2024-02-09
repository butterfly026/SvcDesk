import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';
import { AuthorisationToken } from 'src/app/model/AuthorisationToken/AuthorisationToken';

@Injectable({
  providedIn: 'root'
})
export class AuthoriseResourceService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
    
  ) { }

  getAuthResource(authId): Observable<AuthorisationToken> {

    const header = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const reqParam = new HttpParams()
      .set('Id', authId);

    return this.httpclient.get<AuthorisationToken>(
      this.config.MockingAPIEndPoint + 'Selcomm/1.0.0/Authorise', {
        headers: header, params: reqParam
      }
    );
  }

  getAuthResourceList(): Observable<AuthorisationToken[]> {
    const header = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    return this.httpclient.get<AuthorisationToken[]>(
      this.config.MockingAPIEndPoint + 'Selcomm/1.0.0/AuthorisationList', {
        headers: header
      }
    );
  }


}
