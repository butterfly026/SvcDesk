import { Component, OnInit, Inject } from '@angular/core';
import { LoadingService, TranService } from 'src/services';
import { NavController } from '@ionic/angular';

import { GlobalService } from 'src/services/global-service.service';
import { MainMenu, MenuItem } from '../models';
import { MenuComponentService } from './services/menu-component.service';

@Component({
  selector: 'app-menu-component',
  templateUrl: './menu-component.component.html',
  styleUrls: ['./menu-component.component.scss'],
})
export class MenuComponentComponent implements OnInit {



  public menuList: Array<MainMenu | MenuItem> = [];
  public navToMainMenu: boolean | string;

  
  public menuTitle: string;

  constructor(
    private menuService: MenuComponentService,
    private translateService: TranService,
    private loading: LoadingService,
    private navCtrl: NavController,
    
    public globService: GlobalService,
  ) {
    this.translateService.translaterService();
  }

  async ngOnInit() {
    await this.loading.present();
    this.getMenuItemFromApi();
  }

  ionViewDidEnter(): void {
    
  }

  public async renderMainMenu() {
    await this.loading.present();
    this.getMenuItemFromApi();

  };


  public navigateMenuItem = (menu: MenuItem): void => {
    if (menu.Mode === 'page') {
      this.navCtrl.navigateForward([menu.Command]);
    }

    if (menu.Mode === 'Signout') {
      this.globService.forceLogout();
    }

  };

  private getMenuItemFromApi = () => {
    this.menuService.getCustomerMenuList()
      .subscribe(
        async data => {
          this.menuList = data;
          this.menuTitle = 'menu';
          this.navToMainMenu = false;
          await this.loading.dismiss();
        },
        async error => {
          await this.loading.dismiss();
        }
      );
  }
}
