import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { APP_CONFIG, IAppConfig, Paging, TokenInterface, Token_config } from "src/app/model";
import { Observable } from "rxjs";
import { ContractItem, ContractItemDetail, ContractOption, ContractsItemResponse } from "../models/contracts.types";

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  constructor(
    private httpClient: HttpClient,
    @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
  ) { }

  getContractsList(reqData: Paging, contractOption: ContractOption): Observable<ContractsItemResponse> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const reqParams = new HttpParams({ fromObject: { ...reqData, ...contractOption } })
        .append('api-version', '1.0');

    return this.httpClient.get<ContractsItemResponse>(this.config.NewAPIEndPoint + '/Contracts', {
        headers: header, params: reqParams
    });
  }

  createContract(reqData: ContractItem): Observable<any> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const reqParams = new HttpParams()
        .append('api-version', '1.0');

    return this.httpClient.put<any>(this.config.NewAPIEndPoint + `/Contracts`, reqData, {
        headers: header, params: reqParams
    });
  }

  getContractDetail(ContractId: string): Observable<ContractItemDetail> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const reqParams = new HttpParams()
        .append('api-version', '1.0');

    return this.httpClient.get<ContractItemDetail>(this.config.NewAPIEndPoint + `/Contracts/${ContractId}`, {
        headers: header, params: reqParams
    });
  }

  deleteContract(ContractId: string): Observable<any> {
    const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)

    const reqParams = new HttpParams()
        .append('api-version', '1.0');

    return this.httpClient.delete<any>(this.config.NewAPIEndPoint + `/Contracts/${ContractId}`, {
        headers: header, params: reqParams
    });
  }
}
