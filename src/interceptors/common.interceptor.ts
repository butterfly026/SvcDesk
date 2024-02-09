import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token_config, TokenInterface } from 'src/app/model';
import { TranService } from 'src/services';
import { filter, map, tap } from 'rxjs/operators';
import { GlobalService } from 'src/services/global-service.service';

@Injectable({
    providedIn: 'root'
})
export class CommonInterceptor implements HttpInterceptor {

    constructor(
        @Inject(Token_config) public tokens: TokenInterface,
        private tranService: TranService,
        private globService: GlobalService,
    ) {

    }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.tokens.AccessToken) {
            const httpsReqGet = httpRequest.clone({
                headers: new HttpHeaders({
                    'Authorization': this.tokens.AccessToken,
                    'Content-Type': 'application/json'
                }),
            });
            if (httpRequest.method === 'GET') {
                return next.handle(httpsReqGet).pipe(tap((result: any) => {
                    if (result) {
                        if (result.body) {
                            const convResult = this.globService.ConvertKeysToLowerCase(result.body);
                            if (Array.isArray(convResult) && convResult.length === 0) {
                                this.tranService.errorMessage('no_data');
                            } else {
                                for (var key in convResult) {
                                    if (key.includes('count')) {
                                        if (convResult[key] === 0) {
                                            this.tranService.errorMessage('no_data');
                                        }
                                    }
                                }
                            }
                        } else if (result?.type == 0) {
                        }
                        else {
                            this.tranService.errorMessage('no_data');
                        }
                    } else {
                        this.tranService.errorMessage('no_data');
                    }
                }));
            } else {
                return next.handle(httpsReqGet);
            }
        }
    }

    setToken() {

    }
}