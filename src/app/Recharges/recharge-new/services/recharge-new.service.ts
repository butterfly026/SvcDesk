import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  RechargeListItem } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RechargeNewService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
    ) { }

    addNewRecharge(reqData): Observable<RechargeListItem[]> {
        // const header = new HttpHeaders()
        //     .set('Authorization', (this.tokens.AccessToken));

        // const reqParam = new HttpParams()
        //     .set('CollectMethod', 'DD')
        //     .append('SkipRecords', reqData.pageNumber)
        //     .append('TakeRecords', reqData.rowNumber);

        return this.httpclient.get<RechargeListItem[]>('assets/fakeDB/RechargeList.json');

    }

}
