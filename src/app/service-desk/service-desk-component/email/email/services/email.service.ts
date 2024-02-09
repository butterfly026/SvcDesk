import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class EmailService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
    ) {

    }

    emailSend(email): Observable<any> {
        return Observable.create(observer => {
            const resData = { 'state': '', 'data': '', 'message': '' };
            if (Math.random() > 0.1) {
                resData.state = 'success';
                resData.message = 'passwordChangedSuccess';
                observer.next(resData);
            } else {
                resData.state = 'fail';
                resData.message = 'CollectionRunAuthoriseFailed';
                observer.error(resData);
            }
            observer.complete();
        });
    }

}
