import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class InvoiceDetailService {

    constructor(
        public httpClient: HttpClient
    ) {
    }


    _calculateTotal = (invoice_data) => {

        // invoice_data
    };


    public geInvoiceDetails = (): Observable<any[]> => {

        return this.httpClient.get<any[]>('assets/fakeDB/invoiceDetails.json', { responseType: 'json' })
            .pipe(
                map(array => array)
            );
    };
}
