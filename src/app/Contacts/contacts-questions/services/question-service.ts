import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class QuestionService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getQuestionsListWithContactCode(ContactCode): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Questions', {
            headers: header,
            params: reqParam
        });

    }

    getQuestionsList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Questions', {
            headers: header,
            params: reqParam
        });
    }

    createQuestion(reqData, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));
        
        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Questions', reqData, {
            headers: header,
            params: reqParam
        });
    }

    updateQuestion(questionId, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + '/Contacts/Questions/' + questionId, reqData, {
            headers: header,
            params: reqParam
        });
    }

    deleteQuestion(questionId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Contacts/Questions/' + questionId, {
            headers: header,
            params: reqParam
        });
    }

}
