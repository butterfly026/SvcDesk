import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';
import { GetServiceProviderUser } from '../model/service-provider-user.model';

@Injectable({
    providedIn: 'root'
})

export class ServiceProviderUserService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    userConfiguration(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/ServiceProviderUsers/Configuration', {
            headers: header,
            params: reqParam
        });
    }

    getNextUserId(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Users/ServiceProviderUsers/NextId', {}, {
            headers: header, params: reqParam
        });
    }

    getAllUsers(reqData: GetServiceProviderUser): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/ServiceProviderUsers', {
            headers: header,
            params: reqParam
        });
    }

    getBusinessLists(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/BusinessUnits', {
            headers: header,
            params: reqParam
        });
    }

    getTeamLists(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/Teams', {
            headers: header,
            params: reqParam
        });
    }

    getRoleLists(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/ServiceProviderUsers/Roles', {
            headers: header,
            params: reqParam
        });
    }

    createUser(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Users/ServiceProviderUsers', reqData, {
            headers: header, params: reqParam
        });
    }

    getUserDetail(userId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/ServiceProviderUsers/Id/' + userId, {
            headers: header, params: reqParam
        });
    }

    updateUser(reqData, userId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.patch<any>(this.config.NewAPIEndPoint + '/Users/ServiceProviderUsers/Id/' + userId, reqData, {
            headers: header, params: reqParam
        });
    }

    deleteUser(userId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Users/Contact/' + userId, {
            headers: header, params: reqParam
        });
    }

    getDefaultTimeZone(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Timezones/Default', {
            headers: header, params: reqParam
        });
    }

    getSearchTimeZone(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1')
            .append('SearchString', reqData?.SearchString)
            .append('SkipRecords', reqData?.SkipRecords)
            .append('TakeRecords', reqData?.TakeRecords)

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Timezones/Search', {
            headers: header, params: reqParam
        });
    }

    unBlockUser(userId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '3.1')

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/Lockout/name:' + userId, {
            headers: header, params: reqParam
        });
    }

    LockoutUser(userId, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))
            .append('Content-Type', 'application/json');

        const reqParam = new HttpParams()
            .set('api-version', '3.1')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/Lockout/name:' + userId, reqBody, {
            headers: header, params: reqParam
        });
    }

    getRefreshTokenContact(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint +
            '/authentication/' + reqData.SiteId + '/Contact/' + reqData.ContactCode + '/Token/Refresh', JSON.stringify(reqData.UserId), {
            headers: header, params: param
        });
    }

    getAccessTokenContact(refreshToken): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', refreshToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Authentication/Contact/Token/Access', {}, {
            headers: header, params: param
        });
    }

    addUserWithAccessToken(reqData, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');
        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Authentication/' + reqData.SiteId + '/SelcommUser/Contact/' +
            + reqData.userId + '/Self', reqBody, {
            headers: header, params: param
        });
    }

    addRole(reqData, additionalPath): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/' + additionalPath + reqData.userId
            + '/Role/' + reqData.roleId, {}, {
            headers: header, params: param
        });
    }

    addUser(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/' + reqData.userId
            + '/Role/' + reqData.roleId, {}, {
            headers: header, params: param
        });
    }

    deleteRole(reqData, additionalPath): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/' + additionalPath + reqData.userId
            + '/Role/' + reqData.roleId, {
            headers: header, params: param
        });
    }

    enableMFA(ContactCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.put<any>(this.config.MockingAPIEndPoint + '/Users/1.0/MFA/Enable/Contact/' + ContactCode, reqBody, {
            headers: header, params: param
        });
    }

    disableMFA(ContactCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.put<any>(this.config.MockingAPIEndPoint + '/Users/1.0/MFA/Disable/Contact/' + ContactCode, reqBody, {
            headers: header, params: param
        });
    }
}
