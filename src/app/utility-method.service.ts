import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class UtilityService {


    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }


    public getUtilityData = (searchString) => {
        const stringArray = searchString.split(' || ');
        const resData = { 'state': '', 'data': [], 'message': '' };
        if (stringArray.length > 0) {
            resData.state = 'success';
            resData.data = stringArray;
            return resData;
        } else {
            resData.state = 'fail';
            resData.data = [];
            return resData;
        }
    };



}
