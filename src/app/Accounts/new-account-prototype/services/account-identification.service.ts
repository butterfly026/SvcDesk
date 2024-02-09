import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { GetIdentificationMandatoryResponse, IdentificationType, SecurityQuestion } from "../models";

@Injectable({
  providedIn: 'root'
})

export class AccountIdentificationService {

  constructor(
    private httpclient: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(Token_config) private tokens: TokenInterface,
  ) { }

  getIdentificationTypes(): Observable<IdentificationType[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.1');

    return this.httpclient.get<IdentificationType[]>(
      this.config.NewAPIEndPoint + `/Contacts/IdentificationTypes`,
      { headers, params }
    );
  }

  getIdentificationMandatoryRules(contactType: string): Observable<GetIdentificationMandatoryResponse> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.1');

    return this.httpclient.get<GetIdentificationMandatoryResponse>(
      this.config.NewAPIEndPoint + `/Contacts/Identifications/ContactTypes/${contactType}/IdentificationMandatoryRules`,
      { headers, params }
    );
  }

  getSecurityQuestions(): Observable<SecurityQuestion[]> {
    const headers = new HttpHeaders()
      .set('Authorization', (this.tokens.AccessToken));

    const params = new HttpParams()
      .set('api-version', '1.1');

    return this.httpclient.get<SecurityQuestion[]>(
      this.config.NewAPIEndPoint + `/Contacts/Questions`,
      { headers, params }
    );
  }

}