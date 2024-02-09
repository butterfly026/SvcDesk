import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class PortalMenuService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) private config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getMenuList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>('assets/fakeDB/Menu/portalMenu.json', {
            headers: header, params: reqParam
        });
    }
}