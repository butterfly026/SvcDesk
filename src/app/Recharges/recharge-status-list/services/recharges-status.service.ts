import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG, IAppConfig} from 'src/app/model';
import {Observable} from 'rxjs';
import {RechargeStatus} from '../models/recharge-status';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class RechargesStatusService {
    
    
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }
    
    
    public getRechargesList = (): Observable<RechargeStatus[]> => {
        
        return this.httpClient.get<RechargeStatus[]>('assets/fakeDB/rechargeStatus.json')
            .pipe(
                map(res => res)
            );
    };
    
}
