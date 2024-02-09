import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class FinancialUsageHistoryService {


    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }   
    
    public usageDetailList = (): Observable<any[]> => {
        
        return this.httpClient.get<any[]>('assets/fakeDB/usageDetail.json')
            .pipe(
                map(array => array)
            );
    };


}
