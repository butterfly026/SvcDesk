import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';
import { LoadingService, TranService } from 'src/services';
import { AccountNewService } from './services/new-account.service';
import { AccountDetailsComponent } from './new-account-components/account-details/account-details.component';
import { AccountOptionsComponent } from './new-account-components/account-options/account-options.component';
import { onMainContentChange, onPageReady, onSideNavChange } from 'src/app/Services/service-new/animations/service-new-nav-animations';
import { MatSidenav } from '@angular/material/sidenav';
import { NavMenuItem } from 'src/app/Services/service-new/models';
import { SidenavService } from 'src/app/Services/service-new/services/sidenav.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { CreateNewAccountRequestBody } from './new-account.types';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss'],
  animations: [onSideNavChange, onPageReady, onMainContentChange]
})
export class NewAccountComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('NewAccountComponent') NewAccountComponent: EventEmitter<string> = new EventEmitter<string>();
  @Output('ScrollNewAccountComponent') ScrollNewAccountComponent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(AccountDetailsComponent) detailsComponent;
  @ViewChild(AccountOptionsComponent) optionsComponent;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChildren(MatExpansionPanel) expansionPanels: QueryList<MatExpansionPanel>;
  accountDetailSubItems: any = null;
  currenciesList: any[] = [];

  curMenu: string = '';
  isSideNavOver: boolean = false;
  public sideNavState: boolean;

  menuList: NavMenuItem[] = [
    { id: 'Details', name: 'details', icon: 'details', enabled: true },
    { id: 'Options', name: 'options', icon: 'settings_suggest', enabled: false },
    { id: 'Identification', name: 'identification', icon: 'password', enabled: false },
    { id: 'Attibutes', name: 'attibutes', icon: 'attribution', enabled: false },
    { id: 'Plans', name: 'plans', icon: 'schema', enabled: false },
    { id: 'Contracts', name: 'contracts', icon: 'assignment', enabled: false },
    { id: 'Charges', name: 'charges', icon: 'post_add', enabled: false },
    { id: 'Documents', name: 'documents', icon: 'file_present', enabled: false },
    { id: 'PaymentMethods', name: 'paymentmethods', icon: 'payment', enabled: false },
    { id: 'Authentication', name: 'authentication', icon: 'login', enabled: false },
    { id: 'Sites', name: 'sites', icon: 'web_stories', enabled: false },
    { id: 'RelatedContacts', name: 'relatedcontacts', icon: 'contacts', enabled: false },
    { id: 'ServiceGroups', name: 'service_groups', icon: 'group', enabled: false },
    { id: 'CostCenters', name: 'cost_centers', icon: 'center_focus_strong', enabled: false },
  ];

  currentComponent: string = '';
  formsValues: any = {};
  isAccountTypeSelected: boolean = false;
  constructor(
    private elementRef: ElementRef,
    public globService: GlobalService,
    private accountSvc: AccountNewService,
    private loading: LoadingService,
    private tranService: TranService,
    private _sidenavService: SidenavService,
  ) {
    for (let list of this.menuList) {
      list['selected'] = false;
      list['order'] = this.menuList.indexOf(list);
    }

    this._sidenavService.sideNavListener.subscribe(res => {
      this.sideNavState = res;
    })
  }

  ngOnInit() {
    this.currentComponent = 'Details';
    // this.getOperation('/Accounts/OnBoarding/Configuration/Default#get');
    this.getPermission('/Accounts/OnBoarding/Configuration/Default');
  }

  async getPermission(api): Promise<void> {
    await this.loading.present();
    this.accountSvc.getNewAccountAuthorization(api).subscribe(async (_result) => {
      await this.loading.dismiss();
      this.refreshTab(_result);
      this.curMenu = 'details';
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
      this.NewAccountComponent.emit('close');
    });
  }

  private refreshTab(_result): void {
    const menuResult = _result;
    let tmpMenuList = [];
    this.accountDetailSubItems = [];
    Object.keys(menuResult).forEach(element => {
      const index = this.menuList.findIndex(item => item.id === element);
      if (index != -1) {
        const oldMenuItem = this.menuList[index];
        let configMenu = menuResult[element];
        if (!configMenu)
          return;
        else if (!configMenu && element == 'Details')
          configMenu = { id: 'Details', name: 'details', enabled: false, order: 0 };
        else if (element == 'Details') {
          configMenu.enabled = true;
          configMenu.order = -1;
        } else {
          configMenu.enabled = configMenu.Enabled;
          configMenu.order = configMenu.Order;
        }
        configMenu.id = element;
        configMenu.name = element;
        configMenu.icon = oldMenuItem.icon;

        tmpMenuList.push(configMenu);
        if (element === 'Details') {
          Object.keys(menuResult[element]).forEach(subElement => {
            if (menuResult[element][subElement] && typeof menuResult[element][subElement] == 'object') {
              this.accountDetailSubItems.push({
                elementName: subElement,
                data: menuResult[element][subElement]
              });
            }
          })

        }
      }

    });
    tmpMenuList.sort((a, b) => (a.order - b.order));
    this.menuList = tmpMenuList;
    this.accountDetailSubItems.sort((a, b) => (a.data.order - b.data.order));
    if (this.detailsComponent)
      this.detailsComponent.AccountDetailOptions = this.accountDetailSubItems;
  }

  selectComponent(index): void {
    for (let list of this.menuList) {
      list['selected'] = false;
    }    
    this.currentComponent = this.menuList[index].id;
    if (index > 0) {
      //array index should be index-1, because nav contains details, and details is not expansion panel.      
      const expansionIndex = this.expansionPanels.toArray().findIndex(item => item._body.nativeElement.parentElement.attributes.getNamedItem('expansionId').value === this.currentComponent);
      if(expansionIndex >= 0){
        //array index should be index-1, because nav contains details, and details is not expansion panel.
        const scrollTop = this.expansionPanels.toArray()[expansionIndex]?._body.nativeElement.parentElement.offsetTop;
        this.ScrollNewAccountComponent.emit({
          type: 'content-scroll',
          data: scrollTop
        });
        this.expansionPanels.get(expansionIndex)?.open();
      }
    } else if(index == 0) {
      this.ScrollNewAccountComponent.emit({
        type: 'content-scroll',
        data: 0
      });
    }
  }

  returnIndexFromName(value): number {
    return this.menuList.findIndex(item => item.id === value);
  }

  processComponents(event, componentName): void {
    const currentIndex = this.returnIndexFromName(componentName);
    if (componentName === 'Details') {
      if (typeof event === 'object' && event.type === 'AccountTypeSelected') {
        this.isAccountTypeSelected = true;
        this.refreshTab(event.data);
        return;
      } else if (event === 'AccountTypeNull') {
        this.isAccountTypeSelected = false;
        return;
      } else if (typeof event === 'object' && event.type === 'CurrencySelected') {
        this.optionsComponent.CurrenciesList = event.data;
        return;
      } else if (typeof event === 'object' && event.type === 'BillCycleSelected') {
        this.optionsComponent.BillCycleList = event.data;
        return;
      }
    } else if (componentName === 'LeftNavMenu') {
      if (event.type == 'menu_selected') {
        //     this.curMenu = cmd.data;
        const menuId = event.data;
        const index = this.menuList.findIndex(item => item.id === menuId);
        this.selectComponent(index);
      }
      return;
    }

    if (event === 'before') {
      this.selectComponent(currentIndex - 1);
    } else {
      this.formsValues[componentName] = event;
      if (currentIndex < this.menuList.length - 1) {
        this.selectComponent(currentIndex + 1);
      }
    }


    if (currentIndex < this.menuList.length - 1) {
      if (this.checkAvailablePost()) {
      }
    }
  }

  checkAvailablePost(): boolean {
    let availableFormsCount = 0;
    for (let list of this.menuList) {
      if (list.enabled) {
        availableFormsCount++;
      } else {
        this.menuList
      }
    }

    if (availableFormsCount === this.menuList.length) {
      return true;
    } else {
      return false;
    }
  }

  getMenuListState(): boolean {
    if (!this.menuList || this.menuList.length == 0)
      return false;
    let bRet = false;
    this.menuList.forEach(menu => {
      if (menu.enabled)
        bRet = true;
    });
    return bRet;
  }

  saveNewAccount(): void {
   
  }


}
