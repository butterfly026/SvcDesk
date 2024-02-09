import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ContactDocumentService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getAllDocuments(ContactCode: string, pageData: Paging): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams({ fromObject: { ...pageData }})
            .set('api-version', '2.0'); 
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Documents/Information/Contacts/' + ContactCode, {
            headers: header,
            params: reqParam
        });
    }

    getDocuments(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1'); 
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Documents', {
            headers: header,
            params: reqParam
        });
    }    

    getDocument(DocumentId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '2.0'); 

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Documents/' + DocumentId, {
            headers: header,
            params: reqParam
        });
    }

    createDocument(reqData, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))

        const reqParam = new HttpParams()
            .set('api-version', '2.0')
        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Documents/Contacts/' + ContactCode, reqData, {
            headers: header, params: reqParam
        });
    }
    
    deleteDocument(DocumentId): Observable<any>{
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '2.0'); 
        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Documents/' + DocumentId, {
            headers: header,
            params: reqParam
        });
    }
}
