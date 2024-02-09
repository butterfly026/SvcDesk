import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { ContactTitles, RelatedContact, RelatedContactDetail, RelationshipType } from "../related-contacts.types";

@Injectable({
    providedIn: 'root'
})

export class RelatedContactsService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getRelationshipTypes(): Observable<RelationshipType[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.get<RelationshipType[]>(this.config.NewAPIEndPoint + '/Contacts/RelationshipTypes', {
            headers: header, params: reqParam
        });
    }
    getTitles(): Observable<ContactTitles[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<ContactTitles[]>(this.config.NewAPIEndPoint + '/Contacts/Titles', {
            headers: header, params: param
        });
    }

    getRelatedContactsList(ContactCode: string){
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.get<RelatedContact[]>(this.config.NewAPIEndPoint + `/Contacts/${ContactCode}/RelatedContacts`, {
            headers: header, params: reqParam
        });
    }
    
    createRelatedContact(ContactCode: string, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));
        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + `/Contacts/${ContactCode}/RelatedContacts`, 
            reqData, {
            headers: header, params: param
        });
    }
    
    updateRelatedContact(ContactCode: string, RelateId: string, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + `/Contacts/${ContactCode}/RelatedContacts/${RelateId}`, 
            reqData, {
            headers: header, params: param
        });
    }
    
    deleteRelatedContact(ContactCode: string, RelateId: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + `/Contacts/${ContactCode}/RelatedContacts/${RelateId}`, {
            headers: header, params: param
        });
    }

    getRelatedContactDetail(ContactCode: string, relatedId: string): Observable<RelatedContactDetail> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.get<RelatedContactDetail>(this.config.NewAPIEndPoint + `/Contacts/${ContactCode}/RelatedContacts/${relatedId}`, {
            headers: header, params: reqParam
        });
    }
}