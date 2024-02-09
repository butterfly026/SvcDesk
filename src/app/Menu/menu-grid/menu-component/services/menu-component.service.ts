import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, ErrorItems, IAppConfig, MenuItem, TokenInterface, Token_config } from 'src/app/model';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MainMenu, SubMenu } from '../../models';


@Injectable({
    providedIn: 'root'
})
export class MenuComponentService {

    httpHeaders: HttpHeaders = new HttpHeaders();
    httpParams: HttpParams = new HttpParams();

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) private config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    public getCustomerMenuList = (): Observable<MainMenu[]> => this.httpClient.get<MainMenu[]>('assets/fakeDB/mainMenuCustomer.json').pipe(
        map(res => res)
    );

}
