import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  BulkChangeServiceSelectionItem, PlanDisplayItem, StatusDisplayItem, GroupDisplayItem, CostCentreItem, ServiceTypeItem, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BulkServiceUnbarService {

    private serviceList = [
        {
            'Number': '041561882',
            'Label': 'Gordons Phone',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0409757575',
            'Label': 'Gavins Phone',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '04000240556',
            'Label': 'Test Phone 1',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400012023',
            'Label': 'Test Phone 2',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400110135',
            'Label': 'Test Phone 3',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0409757575',
            'Label': 'Gavins Phone',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '04000240556',
            'Label': 'Test Phone 1',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400012023',
            'Label': 'Test Phone 2',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400110135',
            'Label': 'Test Phone 3',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0409757575',
            'Label': 'Gavins Phone',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '04000240556',
            'Label': 'Test Phone 1',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400012023',
            'Label': 'Test Phone 2',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400110135',
            'Label': 'Test Phone 3',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0409757575',
            'Label': 'Gavins Phone',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '04000240556',
            'Label': 'Test Phone 1',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400012023',
            'Label': 'Test Phone 2',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400110135',
            'Label': 'Test Phone 3',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0409757575',
            'Label': 'Gavins Phone',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '04000240556',
            'Label': 'Test Phone 1',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        },
        {
            'Number': '0400012023',
            'Label': 'Test Phone 2',
            'ServiceStatus': 'Open',
            'Connected': '2018-01-19 00:00:00',
            'ActionStatus': 'Pending'
        }
    ];

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getBulkChangeServiceList(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords);

        // return this.httpclient.get<BulkChangeServiceSelectionItem[]>('assets/fakeDB/bulkChangeServiceSelection.json', {
        //     headers: header, params: reqParam
        // });

        return Observable.create(observer => {
            const resData = {
                'data': [], 'totalLength': this.serviceList.length
            };
            // if (reqData.pageNumber)
            //     if (Math.random() > 0.1) {
            //         observer.next(resData);
            //     } else {
            //         observer.error(resData);
            //     }
            if (reqData.SkipRecords + reqData.TakeRecords < this.serviceList.length) {
                for (let i = reqData.SkipRecords; i < reqData.SkipRecords + reqData.TakeRecords; i++) {
                    resData.data.push(this.serviceList[i]);
                }
            } else {
                for (let i = reqData.SkipRecords; i < this.serviceList.length; i++) {
                    resData.data.push(this.serviceList[i]);
                }
            }
            observer.next(resData);
            observer.complete();
        });
    }

    getPlanList(): Observable<PlanDisplayItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<PlanDisplayItem[]>(this.config.MockingAPIEndPoint + 'Plans/1.0.0/PlanDisplayList', {
            headers: header
        });
    }

    getStatusList(): Observable<StatusDisplayItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<StatusDisplayItem[]>(this.config.MockingAPIEndPoint + 'Services/1.0.0/ServiceStatusDisplayList', {
            headers: header
        });
    }

    getGroupList(): Observable<GroupDisplayItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<GroupDisplayItem[]>(this.config.MockingAPIEndPoint + 'Services/1.0.0/ContactServiceGroupDisplayList', {
            headers: header, params: reqParam
        });
    }

    getCostCentreList(): Observable<CostCentreItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<CostCentreItem[]>(this.config.MockingAPIEndPoint + 'CostCenters/1.0.0/ContactCostCenterDisplayList', {
            headers: header, params: reqParam
        });
    }

    getServiceTypeList(): Observable<ServiceTypeItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ServiceTypeCode', '');

        return this.httpclient.get<ServiceTypeItem[]>(this.config.MockingAPIEndPoint + 'Services/1.0.0/ServiceTypeDisplayList', {
            headers: header, params: reqParam
        });
    }

}
