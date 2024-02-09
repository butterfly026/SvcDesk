import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";
import { CreateServiceEventInstanceRequest, GetServiceEventInstancesRequest, GetServiceEventInstancesResponse } from "../models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ServiceEventInstanceService {
  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) public tokens: TokenInterface,
    @Inject(APP_CONFIG) private config: IAppConfig,
  ) {}

  getEventList(reqData: GetServiceEventInstancesRequest, serviceReferenceId: number): Observable<GetServiceEventInstancesResponse> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken);
    
    const params = new HttpParams({ fromObject: { ...reqData }})
        .append('api-version', '1.0')
        .append('ExcludeNoteEvents', true);
    
    return this.httpClient.get<GetServiceEventInstancesResponse>(this.config.NewAPIEndPoint + '/Events/Instances/Services/' + serviceReferenceId, {
      headers, params
    })
  }

  createEvent(reqData: CreateServiceEventInstanceRequest, serviceReferenceId: number): Observable<{ Id: number }>{
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams() 
      .set('api-version', '1.0'); 

    return this.httpClient.post<{ Id: number }>(this.config.NewAPIEndPoint + '/Events/Instances/Services/' + serviceReferenceId, reqData, {
      headers, params
    });
  }

  getDefinitions(reqData: GetServiceEventInstancesRequest, serviceReferenceId: number): Observable<GetServiceEventInstancesResponse> {      
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken);  

    const query = new HttpParams({ fromObject: { ...reqData } })            
        .append('api-version', '1.0'); 

    return this.httpClient.get<GetServiceEventInstancesResponse>(this.config.NewAPIEndPoint + '/Events/Definitions/Services/' + serviceReferenceId, { headers: headers, params: query });
  }
}