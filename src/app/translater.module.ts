import { NgModule } from '@angular/core';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranService, LoadingService, ToastService } from 'src/services';
import { CommonModule } from '@angular/common';
import { AuthoriseResourceService } from 'src/services/authorise-resource.service';
import { ConfigureResourceService } from 'src/services/configure-resource.service';
import { UtilityService } from './utility-method.service';

import { TextMaskModule } from 'angular2-text-mask';
import { AlertService } from 'src/services/alert-service.service';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
// import { TestTranService } from 'src/services/test-tran.service';
import { PercentageMaskDirective } from 'src/directives/percentage-mask.directive';


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
    // return new TestTranService(http);
}

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TextMaskModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
    ],
    exports: [
        TranslateModule,
        TextMaskModule,
        PercentageMaskDirective,
    ],
    declarations: [
        PercentageMaskDirective,
    ],
    providers: [
        TranService,
        LoadingService,
        ToastService,
        AuthoriseResourceService,
        ConfigureResourceService,
        UtilityService,
        AlertService,
        ConvertDateFormatService,
    ]
})
export class TranslaterModule {
}
