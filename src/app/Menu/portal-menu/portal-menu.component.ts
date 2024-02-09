import { Component, OnInit, Inject, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { TranService, LoadingService } from 'src/services';
import { NavController } from '@ionic/angular';
import { MenuItem } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';
import { PortalMenuService } from './services/portal-menu.service';

@Component({
  selector: 'app-portal-menu',
  templateUrl: './portal-menu.component.html',
  styleUrls: ['./portal-menu.component.scss'],
})
export class PortalMenuComponent implements OnInit, OnDestroy {

  @Input() currentMenu: any;
  @Output('PortalMenuComponent') PortalMenuComponent: EventEmitter<string> = new EventEmitter<string>();

  public navToMainMenu: boolean | string;


  public menuTitle: string;
  menuList: any = [];
  dynamicStaticSubMenuList: any = [];
  dynamicStaticSubmenuHistory: any = [];

  menuId: string = '3';
  dynamicMenuList: any;
  dynamicSubMenuList: any = [];

  dynamicSubmenuHistory: any = [];

  currentIndex: number = 0;

  availableMenuList = [
    { path: 'mainMenu' },
    { path: 'change-password' },
    { path: 'change-language' },
    { path: '/ChangeTheme' },
    { path: 'reports' },
    { path: '/Accounts/New' },
    { path: 'documents' },
    { path: 'contact-attributes' },
    { path: 'service-attributes' },
    { path: '/Configurations/Reports/FTP' },
    { path: '/Configurations/SMTP' },
    { path: '/Configurations/Address' },
    { path: '/Configurations/ChangePassword' },
    { path: '/Configurations/PasswordConfigurations' },
    { path: '/Configurations/ResetPassword' },
    { path: '/Configurations/Messages'},
    { path: '/Configurations/Messages/Templates/New'},
    { path: '/Users/PartnerUsers' },
    { path: '/Users/ServiceProviderUsers' },
    { path: 'plans' },
    { path: 'terminations' },
    { path: 'termination-change-date' },
    { path: 'termination-receive' },
    { path: 'termination-reverse' },
    { path: 'account-charges' },
    { path: 'service-charges' },
    { path: 'bar' },
    { path: 'unbar' },
    { path: 'sms' },
    { path: 'sms-send' },
    { path: 'sms-list' },
    { path: 'financials' },
    { path: 'financial-detail' },
    { path: 'receipts' },
    { path: 'financial-invoice' },
    { path: 'email' },
    { path: 'service-events' },
    { path: 'account-events' },
    { path: 'bill-email' },
    { path: 'bills' },
    { path: 'bill-delegation' },
    { path: 'Accounts/BillOptions' },
    { path: 'email-configuration' },
    { path: 'sms-configuration' },
    { path: 'service-provider-user-configuration' },
    { path: 'message-image' },
    { path: 'account-onboarding' },
    { path: 'account-onboarding-configuration' },
    { path: 'commissions' },
    { path: 'charge-definition' },
    { path: 'html-editor' },
    { path: 'account-charge-group' },
    { path: '/Charges/Configurations/Groups' },
    { path: '/Charges/Configurations/Definitions' },
    { path: '/Charges/Configurations/DisplayGroups' },
    { path: '/Tasks/Configurations/Groups' },
    { path: '/tasks' },
    { path: '/Tasks/Configurations/Priorities' },
    { path: '/Services/Configurations/PlanChange' },
    { path: '/Services/Configurations/Terminations' },
    { path: '/Services/Configurations/Onboarding' },
    { path: '/Accounts/Configurations/Onboarding' },
    { path: '/Contracts' },
    { path: '/Contracts/Penalties' },
    // { path: '/Tasks/Configurations/Resoutions' },
  ];

  constructor(
    private translateService: TranService,
    private loading: LoadingService,
    public globService: GlobalService,
    private menuService: PortalMenuService,
  ) {
    this.translateService.translaterService();
  }

  ngOnInit(): void {
    if (localStorage.getItem('menuHistory')) {
      const menuHistory = JSON.parse(localStorage.getItem('menuHistory'));
      this.menuList = menuHistory.menuList;
      this.dynamicSubmenuHistory = menuHistory.dynamicSubmenuHistory;
      this.dynamicMenuList = menuHistory.dynamicMenuList;
      this.dynamicSubMenuList = menuHistory.dynamicSubMenuList;
      this.dynamicStaticSubMenuList = menuHistory.dynamicStaticSubMenuList;
      this.dynamicStaticSubmenuHistory = menuHistory.dynamicStaticSubmenuHistory;
      if (this.currentMenu) {
        this.processMenuBack(this.currentMenu.index, this.currentMenu.type);
      }
    } else {
      this.getMenuList();
      this.getDynamicMenuList();
    }

    this.globService.portalMenuSubject.subscribe((result: any) => {
      if (result.type) {
        this.dynamicSubmenuHistory = result.dynamicSubmenuHistory;
        this.dynamicStaticSubmenuHistory = result.dynamicStaticSubmenuHistory;
        this.currentIndex = result.index;
        this.processMenuBack(result.index, result.type);
      }
    });
  }

  ngOnDestroy() {
    const menuHistory = {
      dynamicSubMenuList: this.dynamicSubMenuList,
      dynamicSubmenuHistory: this.dynamicSubmenuHistory,
      dynamicMenuList: this.dynamicMenuList,
      menuList: this.menuList,
      dynamicStaticSubMenuList: this.dynamicStaticSubMenuList,
      dynamicStaticSubmenuHistory: this.dynamicStaticSubmenuHistory,
    };
    localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
  }

  ionViewDidEnter(): void {

  }

  public async renderMainMenu() {
    await this.loading.present();
  };

  async getMenuList() {
    this.menuService.getMenuList().subscribe(async result => {
      this.menuList = result;
    }, async (error: any) => {
      this.translateService.errorMessage(error.error);
    });
  }


  async getDynamicMenuList() {
    await this.loading.present();
    this.globService.getDynamicMenuList(this.menuId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.dynamicMenuList = result;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.translateService.errorMessage(error.error);
    });
  }

  navigateMenuItem(menu) {
    if (typeof (menu.Command) === 'object' && menu.Command.length > 0) {
      this.dynamicStaticSubMenuList = menu.Command;
      const item = {
        child: menu.Command,
        parent: menu,
      }
      this.dynamicStaticSubmenuHistory.push(item);
      this.setDyamicMenu('');
    } else if (typeof (menu.Command) === 'string') {
      const item = {
        child: [],
        parent: menu,
      }
      if (this.availableMenuList.filter(it => it.path === menu.Command).length > 0) {
        this.dynamicStaticSubmenuHistory.push(item);
        this.setDyamicMenu(menu.Command);
      } else {
        this.notURLAvailable();
      }
    }
  };

  processMenuBack(index, type) {
    switch (type) {
      case 'home':
        this.dynamicStaticSubMenuList = [];
        this.dynamicStaticSubmenuHistory = [];

        this.dynamicSubMenuList = [];
        this.dynamicSubmenuHistory = [];
        console.log("case home");
        break;

      case 'static':
        if (index === 0) {
          this.processMenuBack(index, 'home');
        } else {
          this.dynamicStaticSubMenuList = this.dynamicStaticSubmenuHistory[index - 1].child;
          this.dynamicStaticSubmenuHistory.splice(index, this.dynamicStaticSubmenuHistory.length - index);
        }
        console.log("case static");
        break;

      case 'dynamic':
        if (index === 0) {
          this.processMenuBack(index, 'home');
        } else {
          this.dynamicSubMenuList = this.dynamicSubmenuHistory[index - 1].child;
          this.dynamicSubmenuHistory.splice(index, this.dynamicSubmenuHistory.length - index);
        }
        console.log("case dynamic");
        break;

      default:
        break;
    }
    this.setDyamicMenu('');
  }

  navigateDynamicMenuItem(menu) {
    if (menu.MenuItems.length > 0) {
      this.dynamicSubMenuList = menu.MenuItems;
      const item = {
        child: menu.MenuItems,
        parent: menu,
      }
      this.dynamicSubmenuHistory.push(item);
      this.setDyamicMenu('');
    } else {
      const item = {
        child: [],
        parent: menu,
      }
      if (this.availableMenuList.filter(it => it.path === menu.NavigationURL).length > 0) {
        this.dynamicSubmenuHistory.push(item);
        this.setDyamicMenu(menu.NavigationURL);
      } else {
        this.notURLAvailable();
      }
    }
  }

  setDyamicMenu(navication) {
    const dynamicMenu = {
      dynamicSubmenuHistory: this.dynamicSubmenuHistory,
      dynamicStaticSubmenuHistory: this.dynamicStaticSubmenuHistory,
    }
    this.PortalMenuComponent.emit('portalmenu&&&' + JSON.stringify(dynamicMenu) + '&&&' + navication);
  }

  notURLAvailable() {
    this.translateService.errorToastMessage('url_not_available');
  }
}
