import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenInterface, Token_config } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class TerminationChangeDateService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getTerminateReverse(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        return this.httpClient.get<any>('assets/fakeDB/Terminations/TerminationDetail.json', {
            headers: header,
        });
    }
}