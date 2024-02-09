import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";
import { Observable } from 'rxjs';
import { GetChargeInstancesResponse } from 'src/app/Financial/financial-charges/charge-list/charge-list.component.type';

@Injectable({
    providedIn: 'root'
})

export class ChargeListService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }


    // public getChargeList = (reqData: any, contactCode: string): Observable<any> => {

    //     // these are the sample variables and methods
    //     const dealerNames = ['Phone 2 Go', 'Select Southern Australia', 'Big City Deal Ltd.', 'Big World Phone', 'Best in Town', 'Little Battler Phone', 'Bush Phone Pvt. Ltd.', 'Phone Urs'];
    //     const amountArr = [0, 128, 512, 468, 147, 5658, 116, 748.54, 256, 4562, 545, 224.69, 18, 1457, 1254, 365, 813.23];
    //     const amount = () => amountArr[Math.floor(Math.random() * amountArr.length)];

    //     let data = [];
    //     let j = 1;

    //     return Observable.create(observer => {
    //         do {
    //             data = [...data, {
    //                 code: 'DL00' + j,
    //                 description: dealerNames[Math.floor(Math.random() * dealerNames.length)],
    //                 quantity: Math.floor(Math.random() * 10),
    //                 unit_price: amount(),
    //                 total_price: amount(),
    //                 discount_type: dealerNames[Math.floor(Math.random() * dealerNames.length)],
    //                 discount: amount(),
    //                 start: new Date().toISOString(),
    //                 end: new Date().toISOString(),
    //                 additional_description: dealerNames[Math.floor(Math.random() * dealerNames.length)],
    //                 cost: amount(),
    //                 instances: 'GDJ16513',
    //                 customer_reference: 'GDJ16513',
    //                 reference: 'GDJ16513',
    //                 other_reference: 'GDJ16513',
    //             }];
    //             j++;
    //         }
    //         while (j < reqData.TakeRecords + 1);

    //         setTimeout(() => {
    //             observer.next({ state: 'success', message: 'commissionListSuccess', data, count: 76 });
    //             observer.complete();
    //         }, 1500);
    //     });

    // };

    getChargeList(financialId, reqData): Observable<GetChargeInstancesResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams({ fromObject: { ...reqData }})
                .append('api-version', '1.0')

        return this.httpClient.get<GetChargeInstancesResponse>(this.config.NewAPIEndPoint + '/FinancialTransactions/Invoices/Charges/' + financialId, { headers, params });
        
    }

}
