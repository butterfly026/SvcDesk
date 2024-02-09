import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ConfigurationItem, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigureResourceService {

  returnList = [
    { key: 'changePassword', value: '2FA/MANDANTORY' },
    { key: 'changePassword', value: '' },
    { key: 'changePassword', value: '' }
  ]

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  getConfResource(configId): Observable<ConfigurationItem[]> {

    const header = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const reqParam = new HttpParams()
      .set('Id', configId);

    return this.httpclient.get<ConfigurationItem[]>(this.config.MockingAPIEndPoint + 'Selcomm/1.0.0/ResourceConfiguration', {
      headers: header, params: reqParam
    })
  }
}
