import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, RoleListItem, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RoleService {

    roleList = ['first', 'second', 'third', 'fourth', 'fifth'];

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    roleSelect(roleData): Observable<string> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('UserAccountId', this.tokens.UserCode)
            .append('RoleId', roleData);
        return this.httpclient.get<string>(this.config.MockingAPIEndPoint + 'RoleChange', {
            params: reqParam
        });
    }

    getRolList(): Observable<RoleListItem[]> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('UserAccountId', this.tokens.UserCode)
        return this.httpclient.get<RoleListItem[]>(this.config.MockingAPIEndPoint + 'RoleList', {
            params: reqParam
        });
    }
}
