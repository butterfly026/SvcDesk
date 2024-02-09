import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DocumentService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getAllDocuments(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', reqData.CountRecords)
            .append('SearchString', '*' + reqData.SearchString + '*')

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Documents/1.0/Documents', {
            headers: header,
            params: reqParam
        });
    }

    createDocument(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.post<any>(this.config.MockingAPIEndPoint + '/Documents/1.0/Documents', reqData, {
            headers: header
        });
    }

    getDocumentDetail(documentId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Documents/1.0/Documents/' + documentId, {
            headers: header
        });
    }

    updateDocumentDetail(documentId, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.put<any>(this.config.MockingAPIEndPoint + '/Documents/1.0/Documents/' + documentId, reqData, {
            headers: header,
            // params: reqParam
        });
    }

    deleteDocumentDetai(documentId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.delete<any>(this.config.MockingAPIEndPoint + '/Documents/1.0/Documents/' + documentId, {
            headers: header,
        });
    }
}
