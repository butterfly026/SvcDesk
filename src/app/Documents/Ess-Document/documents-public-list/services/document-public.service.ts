import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {  APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class DocumentsPublicService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getDocumentPublicList(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)

        // return this.httpClient.post<any[]>('assets/fakeDB/Managers/manager-cost.json', reqData, { headers: header, params: reqParam });
        return this.httpClient.get<any[]>('assets/fakeDB/Documents/document.json', { headers: header, params: reqParams });
    }
}