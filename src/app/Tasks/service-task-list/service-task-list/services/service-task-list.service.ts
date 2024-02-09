import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ServiceTasksListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getTasksList(ServiceReference, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('api-version', '1.0')
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', reqData.CountRecords);
        if(reqData.SearchString){            
            reqParam = reqParam.append('SearchString', '*' + reqData.SearchString + '*')
        }
        if (reqData.StatusId) {
            reqParam = reqParam.append('StatusId', reqData.StatusId);
        }

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Tasks/Services/' + ServiceReference, {
            headers: header,
            params: reqParam
        });
    }

    deleteTask(Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Tasks/' + Id, {
            headers: header,
            params: reqParam
        });
    }
}