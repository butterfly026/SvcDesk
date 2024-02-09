import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialShareModule } from './materialshare.module';
import { TranslaterModule } from './translater.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuardService } from './auth/signin/services/auth-guard.service';
import { APP_CONFIG, AppConfig, Token, Token_config } from './model';
import { JQWidgetModule } from './jqWidet.module';
import { AlertService } from '../services/alert-service.service';
// import {CookieService} from 'ngx-cookie-service';

// index db configurations


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        // CookieService,
        AuthGuardService,
        AlertService,
        {
            provide: RouteReuseStrategy, useClass: IonicRouteStrategy
        },
        {
            provide: APP_CONFIG, useValue: AppConfig
        },
        {
            provide: Token_config, useValue: Token
        },
    ],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule {
}
