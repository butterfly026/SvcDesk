import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from "src/app/model";
import { Observable } from "rxjs";
import { PenaltyItemDetail } from "../models/penalties.types";

@Injectable({
  providedIn: 'root'
})
export class PenaltiesService {

  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) public tokens: TokenInterface,
    @Inject(APP_CONFIG) private config: IAppConfig,
  ) { }

  getPenaltiesList(): Observable<PenaltyItemDetail[]> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const reqParams = new HttpParams()
        .append('api-version', '1.0');

    return this.httpClient.get<PenaltyItemDetail[]>(this.config.NewAPIEndPoint + '/Contracts/Penalties', {
        headers: header, params: reqParams
    });
  }
}
