import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, NoteItem, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';
import { GetContactNotes, Note } from '../models';

@Injectable({
    providedIn: 'root'
})

export class ContactsNotesService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    ContactNotes(reqData, contactCode): Observable<GetContactNotes> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.1')

        return this.httpClient.get<GetContactNotes>(this.config.NewAPIEndPoint + '/Contacts/' + contactCode + '/Notes', { headers, params });
    }

    ContactNotesPost(reqData, contactCode): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.post<void>(this.config.NewAPIEndPoint + '/Contacts/' + contactCode + '/Notes', reqData, { headers, params });
    }

    getContactNote(noteId): Observable<Note> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.get<Note>(this.config.NewAPIEndPoint + '/Contacts/Notes/' + noteId, { headers, params });
    }

    deleteContactNotes(noteId): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.delete<void>(this.config.NewAPIEndPoint + '/Contacts/Notes/' + noteId, { headers, params });
    }

    updateContactNotes(reqData, noteId): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.put<void>(this.config.NewAPIEndPoint + '/Contacts/Notes/' + noteId, reqData, { headers, params });
    }
}
