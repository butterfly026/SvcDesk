import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";
import { AccountTaskItem, AccountTaskResponse, CategoryItem, CategoryTypeItem, NextNumber, Priority, Requestor, Resolution, Status, TaskDocument, TaskDocumentResponse, TaskGroup } from "../account-task-list.types";

@Injectable({
    providedIn: 'root'
})

export class AccountTasksListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    getTaskCategories(): Observable<CategoryItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<CategoryItem[]>(this.config.NewAPIEndPoint + '/Tasks/Categories', {
            headers: header,
            params: reqParam
        });
    }

    getTypesFromCategories(categoryId: string): Observable<CategoryTypeItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('api-version', '1.0')
            .append('CategoryId', categoryId);

        return this.httpclient.get<CategoryTypeItem[]>(this.config.NewAPIEndPoint + '/Tasks/Types', {
            headers: header,
            params: reqParam
        });
    }

    getStatuses(): Observable<Status[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<Status[]>(this.config.NewAPIEndPoint + '/Tasks/Statuses', {
            headers: header,
            params: reqParam
        });
    }

    getRequestors(ContactCode: string): Observable<Requestor[]>{
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<Requestor[]>(this.config.NewAPIEndPoint + '/Tasks/Requestors/Contacts/' + ContactCode, {
            headers: header,
            params: reqParam
        });
    }

    getResolutions(): Observable<Resolution[]>{
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<Resolution[]>(this.config.NewAPIEndPoint + '/Tasks/Resolutions', {
            headers: header,
            params: reqParam
        });
    }

    getPriorities(): Observable<Priority[]>{
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<Priority[]>(this.config.NewAPIEndPoint + '/Tasks/Priorities', {
            headers: header,
            params: reqParam
        });
    }

    getNextNumber(): Observable<NextNumber>{
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<NextNumber>(this.config.NewAPIEndPoint + '/Tasks/Numbers/Next', {
            headers: header,
            params: reqParam
        });
    }
    

    getTasksList(ContactCode, reqData): Observable<AccountTaskResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let params = new HttpParams({ fromObject: { ...reqData }})
            .set('api-version', '1.0');

        return this.httpclient.get<AccountTaskResponse>(this.config.NewAPIEndPoint + '/Tasks/Contacts/' + ContactCode, {
            headers,
            params
        });
    }

    deleteTask(Id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Tasks/' + Id, {
            headers: header,
            params: reqParam
        });
    }

    createTask(ContactCode: string, task: AccountTaskItem): Observable<any>{
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + `/Tasks/Contacts/${ContactCode}`, task, {
            headers, params
        });
        
    }

    updateTask(taskId: string, task: AccountTaskItem): Observable<any>{
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + `/Tasks/Contacts/${taskId}`, task, {
            headers, params
        });
        
    }

    getTaskDetail(taskId: string): Observable<any>{
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + `/Tasks/${taskId}`, {
            headers, params
        });
        
    }

    createDocument(TaskId: string, document: TaskDocument): Observable<any>{
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + `/Documents/Tasks/${TaskId}`, document, {
            headers, params
        });
        
    }

    getTaskGroups(): Observable<TaskGroup[]>{
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<TaskGroup[]>(this.config.NewAPIEndPoint + `/Tasks/Groups`, {
            headers, params
        });
    }

    getAllDocuments(TaskId: string): Observable<TaskDocumentResponse>{
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<TaskDocumentResponse>(this.config.NewAPIEndPoint + `/Documents/Information/Tasks/{TaskId}`, {
            headers, params
        });
    }
}