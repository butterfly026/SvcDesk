import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LeadListService {

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


    public getSalesLeadList = (): Observable<any> => {

        // these are the sample variables and methods
        const userNames = ['Abhishek Yadav', 'Kishore Kumar', 'Rohit Sharma', 'Maria Lastname', 'Gordon Gielis', 'Surrender Yadav', 'Vinay Kumar', 'Indu Singh'];
        const contactNumberGenerator = () => `${Math.floor(100000000 + Math.random() * 900000000)}`;
        let data = [];
        let j = 1;

        return Observable.create(observer => {

            if (this.leadList.length) {

                do {
                    data = [...data, {
                        id: j, status: 'Status ' + j, source: 'Source ' + j, name: userNames[Math.floor(Math.random() * userNames.length)],
                        contact_number: contactNumberGenerator(), details: 'sample details value'
                    }];
                    j++;
                }
                while (j < 77);

                observer.next({ state: 'success', message: 'leadListSuccess', data });
            } else {
                observer.error({ state: 'fail', message: 'leadListError', data });
            }

            observer.complete();
        });

    };

}
