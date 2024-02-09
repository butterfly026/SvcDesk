import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";
import { AttributePaging } from "../../service-attribute.types";

@Injectable({
    providedIn: 'root'
})

export class ServiceAttributeListService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getAttributes(ServiceReference: string, reqData: AttributePaging): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);
        let reqParam = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.2');
        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Attributes/Instances', {
            headers: header, params: reqParam
        });
    }

    deleteAttribute(Id: number): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParams = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.delete<void>(this.config.NewAPIEndPoint + `/Services/Attributes/Instances/${Id}`, { headers: headers, params: reqParams });
    }
}