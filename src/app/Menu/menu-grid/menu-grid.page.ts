import { Component, OnInit, Inject } from '@angular/core';
import { MenuGridService } from './services/menu-grid.service';
import { LoadingService, TranService } from 'src/services';
import { NavController } from '@ionic/angular';
import { MainMenu, MenuItem } from './models';

import { GlobalService } from 'src/services/global-service.service';
import { Token_config, TokenInterface } from 'src/app/model';
// import {IndexedDbService} from 'src/services/indexed-db.service';
// import {CookieService} from 'ngx-cookie-service';


@Component({
    selector: 'app-menu-grid',
    templateUrl: './menu-grid.page.html',
    styleUrls: ['./menu-grid.page.scss'],
})
export class MenuGridPage implements OnInit {


    public menuList: Array<MainMenu | MenuItem> = [];
    public navToMainMenu: boolean | string;

    
    public menuTitle: string;

    private collectionName: string = 'menu-item-collection';
    private storageTimeExpire: number = 4; // in hours

    constructor(
        private menuGridService: MenuGridService,
        private translateService: TranService,
        private loading: LoadingService,
        private navCtrl: NavController,
        
        public globService: GlobalService,
        @Inject(Token_config) public tokens: TokenInterface,
        // private idxDbService: IndexedDbService,
        // private cookieService: CookieService
    ) {

        translateService.translaterService();
        // this.renderMainMenu();       
    }


    async ngOnInit() {

        await this.loading.present();
        this.getMenuItemFromApi();
    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    ionViewDidEnter(): void {
        
    }


    public async renderMainMenu() {

        await this.loading.present();

        this.getMenuItemFromApi();

        // !(this.cookieService.check(this.collectionName)) ?
        // this.getMenuItemFromApi() : this.getMenuItemFromStorage();

    };


    public navigateMenuItem = (menu: MenuItem): void => {

        if (menu.Mode === 'page') {
            this.navCtrl.navigateForward([menu.Command]);
        }

        if (menu.Mode === 'Signout') {
            this.tokens.AccessToken = '';
            // window.location.href = window.location.href.replace(/#.*$/, '');
            window.location.reload();
            // this.navCtrl.navigateRoot(['auth/signin']);
        }

        // this.showSubMenu(menu.Command, `${menu.Caption.toLowerCase() }_menu`);
    };


    private async showSubMenu(apiUrl: string, menu_title: string) {

        await this.loading.present();

        this.menuGridService.getSubMenuList(apiUrl)
            .subscribe(
                async data => {
                    this.menuList = data;
                    this.navToMainMenu = true;
                    this.menuTitle = menu_title;
                    await this.loading.dismiss();
                },
                async error => {
                    await this.loading.dismiss();
                }
            );
    };


    private getMenuItemFromStorage = () => {

        /*this.idxDbService.getAll(this.collectionName)
            .subscribe(
                data => {
                    this.menuList = data;
                    this.menuTitle = 'menu';
                    this.navToMainMenu = false;
                    await this.loading.dismiss();
                },
                error => {
                    await this.loading.dismiss();
                }
            )*/
    };


    private getMenuItemFromApi = () => {

        this.menuGridService.getCustomerMenuList()
            .subscribe(
                async data => {
                    this.menuList = data;
                    this.menuTitle = 'menu';
                    this.navToMainMenu = false;
                    // this.idxDbService.clearCollection(this.collectionName).subscribe();
                    // this.idxDbService.addItem(this.collectionName, data, this.storageTimeExpire).subscribe();
                    await this.loading.dismiss();
                },
                async error => {
                    await this.loading.dismiss();
                }
            );
    }


}
