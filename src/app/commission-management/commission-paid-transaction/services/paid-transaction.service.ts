import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CommissionPaidTransactionService {

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


    public getCommissionPaidTransactions(reqBody, ContactCode): Observable<any> {

        // these are the sample variables and methods
        const amountArr = [0, 128, 512, 468, 147, 5658, 116, 748.54, 256, 4562, 545, 224.69, 18, 1457, 1254, 365, 813.23];
        const transTypeArr = ['Receipt', 'Cheque', 'Online', 'Demand Draft', 'Cash'];

        const amount = () => amountArr[Math.floor(Math.random() * amountArr.length)];
        const transType = () => transTypeArr[Math.floor(Math.random() * transTypeArr.length)];


        let data = [];
        let j = 1;

        return Observable.create(observer => {

            if (this.leadList.length) {

                do {
                    data = [...data, {
                        transaction_id: 45770 + j,
                        rule_id: ' - ',
                        account: `${4002151 + j} - SSS Pvt Ltd.`,
                        service: 'Account + All Services',
                        apply_to: 'Unknown',
                        amount: amount(),
                        trans_type: transType(),
                        trans_no: 3007887 + j,
                        due_date: new Date(),
                        rate: ' - ',
                        basis_amount: amount(),
                        source: 'Commissions Generation'
                    }];
                    j++;
                }
                while (j < reqBody.TakeRecords + 1);

                observer.next({ state: 'success', message: 'commissionPaidTransSuccess', data, count: 55 });
            } else {
                observer.error({ state: 'fail', message: 'commissionPaidTransError', data });
            }

            observer.complete();
        });

    };

}
