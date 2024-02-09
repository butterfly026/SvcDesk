import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, ErrorItems, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import * as utils from '../helpers/utilities';

import { Observable } from 'rxjs';
import { MainMenu, SubMenu, MenuItem } from '../models';
import { catchError, map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class MenuGridService {

    httpHeaders: HttpHeaders = new HttpHeaders();
    httpParams: HttpParams = new HttpParams();

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) private config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }


    public getMenuListApi = (menuId: string): Observable<MainMenu[] | any | ErrorItems> => {

        const headers = this.httpHeaders.set('Authorization', this.tokens.AccessToken);
        const params = this.httpParams.set('MenuId', menuId);

        return this.httpClient.get<MainMenu[] | any | ErrorItems>(this.config.APIEndPoint + 'Menu.svc/rest/MenuItemList', {
            headers, params, responseType: 'json'
        }).pipe(
            map(res => res)
        );
    };


    public getCustomerMenuList = (): Observable<MainMenu[]> =>
        this.httpClient.get<MainMenu[]>('assets/fakeDB/mainMenuCustomer.json').pipe(
            map(res => res)
        );


    public getMenuList = (): Observable<MainMenu[]> =>
        this.httpClient.get<MainMenu[]>('assets/fakeDB/mainMenu.json').pipe(
            map(res => res)
        );


    public getNewMenuListForCustomer = (): Observable<MainMenu[]> =>
        this.httpClient.get<MainMenu[]>('assets/fakeDB/mainMenuCustomer.json').pipe(
            map(res => res)
        );


    public getSubMenuList = (apiUrl: string): Observable<MenuItem[]> => {

        const headers = this.httpHeaders.set('Authorization', this.tokens.AccessToken);

        return this.httpClient.get<SubMenu>(this.config.APIEndPoint + apiUrl, { headers, responseType: 'json' })
            .pipe(
                map(res => res.Items.map(rVal => {
                    return { ...rVal, ...this._reportSubMenuModifier(rVal) }
                })
                )
            );
    };


    TerminateSession(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));
        const reqParam = new HttpParams()
            .set('UserAccountId', this.tokens.UserCode);
        const postParam = {
            'UserAccountId': this.tokens.UserCode
        };

        return this.httpClient.post<any>(this.config.MockingAPIEndPoint + 'Authentication/1.0.0/TerminateSession',
            postParam, { headers: header });
    }

    private _reportSubMenuModifier = (obj: MenuItem): { Caption: string, Command: string, Color: string, Mode: string, ImageURL: string } => {
        return {
            Caption: obj.Name, Color: utils.generateRandomColor(), Command: obj.Command || `Reports/available-report/${obj.Id}`, Mode: obj.Mode || 'page', ImageURL: obj.ImageURL
        }
    };


    private _generateIcon = menuName => 'assets/imgs/' + menuName.replace(/[^\w\s]/gi, '').trim() + '.png';


}
