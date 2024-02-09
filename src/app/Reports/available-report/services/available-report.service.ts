import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/model';
import { Observable } from 'rxjs';
import { AvailableReport } from '../interfaces/available-report';


const GRID_DATA: Array<AvailableReport> = [
    { id: 1, reportName: 'Service Listing', description: 'No description available now!', command: 'Reports/service-listing' }
];


@Injectable({
    providedIn: 'root'
})
export class AvailableReportService {

    private httpHeaders: HttpHeaders = new HttpHeaders();
    private httpParams: HttpParams = new HttpParams();

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {
    }


    public getAvailableReportList = (): Observable<AvailableReport[]> =>
        Observable.create(observer => {
            try {
                observer.next(GRID_DATA);
                observer.complete();
            } catch (e) {
                observer.error(GRID_DATA)
            }

        })
}
