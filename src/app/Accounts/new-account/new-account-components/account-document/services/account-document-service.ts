import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AccountDocumentService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getAllDocuments(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));
        console.log('Account code: ', AccountCode)
        console.log('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '2.0'); 
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Documents/Information/Accounts/' + AccountCode, {
            headers: header,
            params: reqParam
        });
    }

    getDocuments(AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1'); 
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Accounts/' + AccountCode + '/Documents', {
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

    createDocument(reqData, AccountCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))

        const reqParam = new HttpParams()
            .set('api-version', '2.0')
        console.log(reqData)
        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Documents/Accounts/' + AccountCode, reqData, {
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
