import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class TasksResolutionFormService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getTaskResolutionDetail(ResolutionId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Tasks/Resolutions/' + ResolutionId, {
            headers: header,
            params: reqParam
        });
    }

    createTaskResolution(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Tasks/Resolutions', reqData, {
            headers: header,
            params: reqParam
        });
    }

    updateTaskResolution(reqData, Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + '/Tasks/Resolutions/' + Id, reqData, {
            headers: header,
            params: reqParam
        });
    }

    getTaskResolutionList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Tasks/Resolutions', {
            headers: header,
            params: reqParam
        });
    }
}