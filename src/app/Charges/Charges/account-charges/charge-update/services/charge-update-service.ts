import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenInterface, Token_config } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ChargeUpdateService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getCurrentCharge(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('Code', reqData.Code);

        return this.httpClient.get<any>('assets/fakeDB/Charges/', {
            headers: header, params: reqParam
        });
    }

    updateCharge(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        return this.httpClient.get<any>('assets/fakeDB/Charges/', {
            headers: header
        });
    }

}