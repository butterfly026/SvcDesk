import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert-service.service';
import { EmitterService } from '../services/emitter.service';


@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {


    constructor(private alertService: AlertService,
        private emitterService: EmitterService) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    // if (evt.body && evt.body.success)
                    // this.toasterService.success(evt.body.success.message, evt.body.success.title, {positionClass: 'toast-bottom-center'});
                }
            }),
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse) {

                    switch (err.status) {

                        // case 0:
                        //     this.emitterService.emitEvent('call-connection-alert', null);
                        //     break;

                        case 500:
                            this.alertService.presentAlert('OOPS!', err.message);
                            break;

                        case 404:
                            this.alertService.presentAlert('OOPS!', err.message);
                            break;

                        default:
                            console.log('HTTP--error : ', err);
                            break;

                    }
                }
                return of(err);
            }));

    }


}
