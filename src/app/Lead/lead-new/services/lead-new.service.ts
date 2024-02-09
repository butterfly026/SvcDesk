import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class LeadNewService {


    FAKE_API: string = 'http://localhost:3000';


    constructor(private httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig) {
    }


    public createSalesLead = (payload): Observable<any> =>
        this.httpClient.post(this.FAKE_API + '/sales_leads', payload).pipe(
            map(res => res)
        );
}
