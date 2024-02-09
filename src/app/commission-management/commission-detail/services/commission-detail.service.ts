import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CommissionDetailService {

    leadList = [
        {
            'Id': '11111', 'Status': 'aaaaa', 'Source': 'Mode 1',
            'Name': 'Open', 'ContactNumber': '2019-03-08', 'Details': 'sample details'
        }
    ];

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }


    public getCommissionDetails = (reqData, ContactCode): Observable<any> => {

        // these are the sample variables and methods
        const dealerNames = ['Phone 2 Go', 'Select Southern Australia', 'Big City Deal Ltd.', 'Big World Phone', 'Best in Town', 'Little Battler Phone', 'Bush Phone Pvt. Ltd.', 'Phone Urs'];
        const amountArr = [0, 128, 512, 468, 147, 5658, 116, 748.54, 256, 4562, 545, 224.69, 18, 1457, 1254, 365, 813.23];
        const statusArr = ['Unpaid Invoice', 'Paid', 'Ready for Payment', 'Tagged Payment', 'Suspended'];

        const amount = () => amountArr[Math.floor(Math.random() * amountArr.length)];
        const status = () => statusArr[Math.floor(Math.random() * statusArr.length)];


        let data = [];
        let j = 1;

        return Observable.create(observer => {

            if (this.leadList.length) {

                do {
                    data = [...data, {
                        pay_id: j,
                        status: status(),
                        calculated_amount: amount(),
                        check_no: 'GDJ16513',
                        comment: ' no comments',
                        paid_amount: amount(),
                        paid_date: new Date(),
                        fin_file: 'FSD152'
                    }];
                    j++;
                }
                while (j < reqData.TakeRecords + 1);

                observer.next({ state: 'success', message: 'commissionDetailSuccess', data, count: 65 });
            } else {
                observer.error({ state: 'fail', message: 'commissionDetailError', data });
            }

            observer.complete();
        });

    };

}
