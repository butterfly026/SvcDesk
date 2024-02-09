import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CommissionListService {

    leadList = [
        {
            'Id': '11111', 'Status': 'aaaaa', 'Source': 'Mode 1',
            'Name': 'Open', 'ContactNumber': '2019-03-08', 'Details': 'sample details'
        },
        {
            'Id': '22222', 'Status': 'aaaaa', 'Source': 'Mode 2',
            'Name': 'Open', 'ContactNumber': '2019-03-08', 'Details': 'sample details'
        },
        {
            'Id': '33333', 'Status': 'aaaaa', 'Source': 'Mode 3',
            'Name': 'Open', 'ContactNumber': '2019-03-08', 'Details': 'sample details'
        },
        {
            'Id': '44444', 'Status': 'aaaaa', 'Source': 'Mode 4',
            'Name': 'Open', 'ContactNumber': '2019-03-08', 'Details': 'sample details'
        },
        {
            'Id': '44444', 'Status': 'aaaaa', 'Source': 'Mode 5',
            'Name': 'Open', 'ContactNumber': '2019-03-08', 'Details': 'sample details'
        },
        {
            'Id': '55555', 'Status': 'aaaaa', 'Source': 'Mode 3',
            'Name': 'Open', 'ContactNumber': '2019-03-08', 'Details': 'sample details'
        }
    ];

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }


    public getCommissionList = (reqData: any, contactCode: string): Observable<any> => {

        // these are the sample variables and methods
        const dealerNames = ['Phone 2 Go', 'Select Southern Australia', 'Big City Deal Ltd.', 'Big World Phone', 'Best in Town', 'Little Battler Phone', 'Bush Phone Pvt. Ltd.', 'Phone Urs'];
        const amountArr = [0, 128, 512, 468, 147, 5658, 116, 748.54, 256, 4562, 545, 224.69, 18, 1457, 1254, 365, 813.23];
        const amount = () => amountArr[Math.floor(Math.random() * amountArr.length)];

        let data = [];
        let j = 1;

        return Observable.create(observer => {

            if (this.leadList.length) {

                do {
                    data = [...data, {
                        dealer_id: 'DL00' + j,
                        dealer_name: dealerNames[Math.floor(Math.random() * dealerNames.length)],
                        paid_to_date: amount(),
                        tagged: amount(),
                        payble: amount(),
                        pending: amount(),
                        suspended: amount(),
                        last_paid_amount: amount(),
                        last_paid_date: new Date().toISOString(),
                        check_no: 'GDJ16513'
                    }];
                    j++;
                }
                while (j < reqData.TakeRecords + 1);

                observer.next({ state: 'success', message: 'commissionListSuccess', data, count: 76 });
            } else {
                observer.error({ state: 'fail', message: 'commissionListError', data });
            }

            observer.complete();
        });

    };

}
