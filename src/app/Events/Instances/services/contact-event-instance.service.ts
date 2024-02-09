import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";
import { 
    CreateContactEventInstanceRequest, 
    EventDefinitionDetails, 
    EventDefinitionReason, 
    EventTeam, 
    GetContactEventDefinitionsRequest, 
    GetContactEventDefinitionsResponse, 
    GetContactEventInstancesRequest, 
    GetContactEventInstancesResponse, 
    GetTeamMembersResponse,
    UpdateContactEventInstanceRequest, 
 } from "../models";

@Injectable({
    providedIn: 'root'
})


export class ContactEventInstanceService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getEventList(reqData: GetContactEventInstancesRequest, ContactCode: string): Observable<GetContactEventInstancesResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const reqParams = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.0')
            .append('ExcludeNoteEvents', true)

        return this.httpClient.get<GetContactEventInstancesResponse>(this.config.NewAPIEndPoint + '/Events/Instances/Contacts/' + ContactCode, {
            headers: header, params: reqParams
        });
    }

    getEvent(eventId: number): Observable<any>{
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParams = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Events/' + eventId, {headers: header, params: reqParams});
    }

    createEvent(ContactCode: string, reqData: CreateContactEventInstanceRequest): Observable<{ Id: number }> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

            const query = new HttpParams() 
            .set('api-version', '1.0'); 

        return this.httpClient.post<{ Id: number }>(this.config.NewAPIEndPoint + '/Events/Instances/Contacts/' + ContactCode, reqData, {
            headers: headers, params: query
        });
    }

    updateEvent(eventId: number, reqData: UpdateContactEventInstanceRequest): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams() 
            .set('api-version', '1.0'); 

        return this.httpClient.put<void>(this.config.NewAPIEndPoint + `/Events/${eventId}/Schedule`, reqData, {
            headers: headers, params: query
        });
    }

    deleteEvent(eventId: number): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParams = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.delete<void>(this.config.NewAPIEndPoint + `/Events/${eventId}`, { headers: headers, params: reqParams });
    }

    getDefinitions(ContactCode: string, reqData: GetContactEventDefinitionsRequest): Observable<GetContactEventDefinitionsResponse> {      
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);  

        const query = new HttpParams({ fromObject: { ...reqData } })            
            .append('api-version', '1.0'); 

        return this.httpClient.get<GetContactEventDefinitionsResponse>(this.config.NewAPIEndPoint + '/Events/Definitions/Contacts/' + ContactCode, { headers: headers, params: query });
    }

    getDefinitionDetails(definitionId: number): Observable<EventDefinitionDetails> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);  

        const query = new HttpParams()            
            .append('api-version', '1.0');

        return this.httpClient.get<EventDefinitionDetails>(this.config.NewAPIEndPoint + '/Events/Definitions/' + definitionId, { headers: headers, params: query });
    }

    getReasons(eventDefinitionId: number): Observable<EventDefinitionReason[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

            const query = new HttpParams() 
            .set('api-version', '1.0'); 

        return this.httpClient.get<EventDefinitionReason[]>(this.config.NewAPIEndPoint + '/Events/Reasons/EventDefinitions/' + eventDefinitionId, { headers: headers, params: query });
    }

    getTeams(): Observable<EventTeam[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);
        
        const query = new HttpParams() 
            .set('api-version', '1.0');
        
        return this.httpClient.get<EventTeam[]>(this.config.NewAPIEndPoint + '/Events/Teams', { headers: headers, params: query });
    }
    
    getMembers(eventTeamId: string): Observable<GetTeamMembersResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);
        
        const query = new HttpParams() 
            .set('api-version', '1.0');
        
        return this.httpClient.get<GetTeamMembersResponse>(this.config.NewAPIEndPoint + `/Events/Teams/${eventTeamId}/Members`, { headers: headers, params: query });
    }
}