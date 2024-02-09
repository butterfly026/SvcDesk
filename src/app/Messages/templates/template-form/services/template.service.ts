import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TemplatesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getTemplates(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));
        const reqParam = new HttpParams()
            .set('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', reqData.CountRecords)
            .append('ListOnly',  reqData.isListOnly ) 
            .append('CategoryId', reqData.CategoryId )           
            .append('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Messages/Templates', {
            headers: header,
            params: reqParam
        });
    } 
    getTemplateDetail(templateId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

            const reqParam = new HttpParams()  
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Messages/Templates/' + templateId, {
            headers: header,
            params:reqParam
        });
    }   
    createTemplate(reqData): Observable<any> {
      const header = new HttpHeaders()
          .set('Authorization', (this.tokens.AccessToken));

          const reqParam = new HttpParams()  
          .set('api-version', '1.0')

      return this.httpclient.post<any>(this.config.MockingAPIEndPoint + '/Messages/Templates/' , reqData, {
        headers: header,
        params:reqParam
      });

  }
    deleteTemplate(templateid): Observable<any> {
      const header = new HttpHeaders()
          .set('Authorization', (this.tokens.AccessToken));
          
          const reqParam = new HttpParams()  
          .set('api-version', '1.0')

      return this.httpclient.delete<any>(this.config.MockingAPIEndPoint + '/Messages/Templates/' + templateid,  {
        headers: header,
        params:reqParam
      });
  }

    updateTemplate(reqData, templateId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

            const reqParam = new HttpParams()  
            .set('api-version', '1.0')

        return this.httpclient.put<any>(this.config.MockingAPIEndPoint + '/Messages/Templates/' + templateId, reqData, {
            headers: header,
            params:reqParam
        });

    }
}
