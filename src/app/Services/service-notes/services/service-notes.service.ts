import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { GetServiceNotes, Note } from "../models";

@Injectable({
    providedIn: 'root'
})

export class ServiceNotesService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getServiceNotes(reqData, serviceReference): Observable<GetServiceNotes> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.2');

        return this.httpClient.get<GetServiceNotes>(this.config.NewAPIEndPoint + '/Services/' + serviceReference + '/Notes', { headers, params });
    }

    createServiceNote(reqData, serviceReference): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.post<void>(this.config.NewAPIEndPoint + '/Services/' + serviceReference + '/Notes', reqData, { headers, params });
    }

    getServiceNote(EventId): Observable<Note> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<Note>(this.config.NewAPIEndPoint + '/Services/Notes/' + EventId, { headers, params });
    }

    deleteServiceNote(noteId): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.delete<void>(this.config.NewAPIEndPoint + '/Services/Notes/' + noteId, { headers, params });
    }

    updateServiceNote(reqData, noteId): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.put<void>(this.config.NewAPIEndPoint + '/Services/Notes/' + noteId, reqData, { headers, params });
    }
}