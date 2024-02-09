import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ErrorItems, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BulkDisconnectService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getTerminateService() {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam1 = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

    }

}
