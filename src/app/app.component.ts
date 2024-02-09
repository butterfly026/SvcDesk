import { Component, NgZone, OnInit, ViewChild } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranService } from 'src/services';
import { UtilityService } from './utility-method.service';
import { OnlineOfflineService } from '../services/online-offline.service';
import { Subscription, observable, Subject } from 'rxjs';
import { AlertService } from '../services/alert-service.service';
import { Title } from '@angular/platform-browser';
import { GlobalService } from 'src/services/global-service.service';

import { jqxNavigationBarComponent } from 'jqwidgets-ng/jqxnavigationbar';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    @ViewChild('myNavigationBar') myNavigationBar: jqxNavigationBarComponent;

    public menuTitle: any;

    public onlineOfflineSubscription$: Subscription;
    public alertController: any;
    dirMode: string = '';

    menuList: any;
    subscribeDestory = new Subject();

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private tranService: TranService,
        public navCtrl: NavController,
        private utilService: UtilityService,
        private onlineOfflineService: OnlineOfflineService,
        private alertService: AlertService,
        private title: Title,
        public globService: GlobalService,

    ) {
        this.globService.globSubject.subscribe((result: any) => {
            if (result === 'language_change') {
                this.ionicInit();
            }
        });

        // instead of this, need to use global service observable
        this.initializeApp();
        this.ionicInit();
        this.internetConnectionAlert();

        // this.globService.leftMenuSubject.subscribe(async (result: any) => {
        //     this.menuList = result;
        // });
    }

    async makeMenuItems(menuItems, indexI) {
        let str = '<ul>';
        for (let i = 0; i < menuItems.length; i++) {
            const list = menuItems[i];
            const tranTitle = await this.tranService.convertText(list.caption).toPromise();
            str += '<li class="cursor-point left-menu-child" id="' + indexI + '-' + i + '">' + tranTitle + '</li>';
        }
        str += '</ul>';
        return str;
    }

    goToNavigation(i, j) {
        let returnStr = '';
        const childList = this.menuList.menuitems[i].menuitems[j];
        returnStr = childList.caption + 'Index&&' + j.toString() + 'Index&&'
            + childList.id + 'Index&&' + childList.navigationurl;
        this.globService.getMenuEventSubject.next(returnStr);
    }

    ngOnInit() {
    }


    initializeApp() {
        this.platform.ready().then(() => {
            this.splashScreen.hide();
            this.statusBar.overlaysWebView(false);
            this.statusBar.styleLightContent();
            this.statusBar.styleDefault();
            this.statusBar.backgroundColorByHexString('#0cd1e8');
        });
    }

    ionicInit() {
        this.tranService.translaterService();

        this.tranService.convertText('menu').subscribe(result => {
            this.menuTitle = result;
        });

        // this.emitterService.listenEvent('call-connection-alert')
        //  .subscribe( data => this.testInternetConnection());

        this.tranService.convertText('service_desk').subscribe(result => {
            this.title.setTitle(result);
        });

        this.dirMode = this.globService.getDirValue();
    }


    public testInternetConnection = async () => {

        this.alertController = await this.alertService.createAlertBox(this.testInternetConnection);

        this.onlineOfflineService.retryInternetConnectivity()
            .subscribe(
                async response => {
                    this.alertController.dismiss();
                    this.alertController = await this.alertService.createAlertBox(this.testInternetConnection);
                },
                error1 => {
                    this.alertController.present()
                }
            )
    };


    private internetConnectionAlert = async (): Promise<any> => {

        this.alertController = await this.alertService.createAlertBox(this.testInternetConnection);

        this.onlineOfflineSubscription$ = this.onlineOfflineService.connectionChanged.pipe(takeUntil(this.subscribeDestory)).subscribe(async isOnline => {
            await this.alertController.dismiss();
            this.alertController = await this.alertService.createAlertBox(this.testInternetConnection);

            if (!isOnline) {
                this.alertController.present();
            }
            this.subscribeDestory.next();
        })
    };


}
