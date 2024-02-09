import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonInterceptor } from 'src/interceptors/common.interceptor';


@NgModule({
    imports: [
        HttpClientModule,
    ],
    exports: [],
    declarations: [],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CommonInterceptor, multi: true },
    ]
})
export class CommonInterceptorModule {
}
