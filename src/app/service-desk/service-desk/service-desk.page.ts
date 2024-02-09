import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, Inject, OnDestroy } from '@angular/core';
import { NavController, IonContent, MenuController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { NewContactSearch, APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';

import * as $ from 'jquery';
import { GlobalService } from 'src/services/global-service.service';
import { SignInService } from 'src/app/auth/signin/services/signin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-desk',
  templateUrl: './service-desk.page.html',
  styleUrls: ['./service-desk.page.scss'],
})
export class ServiceDeskPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  pageTitle: string = '';
  pageId: string = '';

  selectedServiceDeskIndex: number = 0;
  advancedState: boolean = false;
  advancedSearchResult: NewContactSearch = {
    statuscode: null,
    recordcount: null,
    errormessage: null,
    items: []
  }

  tabList: {
    Result: string; 
    avail: boolean; 
    ContactCode: string; 
    Type: string;
  }[] = [];
  SelectedServiceDesk: string = '';
  mainCtrl: string = '';

  invoiceInput: any;
  usageDetailInput: any;
  portalMenuState: string = 'mainMenu';
  portalMenuValue: any;
  currentUser: string = '';

  financialId: string;

  pagingParam: any = {
    pageRowNumber: 1,
    rowStep: '10',
    SkipRecords: 0,
  };

  usageDetail: any;

  menuList: any;
  currentMenu: any = {};

  currentScrollDepth: any;
  triggerDepth: any;

  currentComponent: any;

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private toast: ToastService,

    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
    private signinService: SignInService,
    private router: Router,
    private cdr: ChangeDetectorRef,

    public globService: GlobalService,
    private loading: LoadingService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('service_desk').subscribe(value => { this.pageTitle = value; });
    this.currentUser = this.tokens.ContactCode;
    this.globService.globSubject.subscribe((result: any) => {
      if (result === 'load_end') {
        this.enableTabSelectable();
      } else if (result.includes('Index&&')) {
        // this.processNavigation(result);
        this.tabList[this.selectedServiceDeskIndex - 1].Result = result;
      }
    });
  }

  processMenuBack(index, type) {
    if (type === 'home') {
      if (this.portalMenuState !== 'mainMenu') {
        this.portalMenuState = 'mainMenu';
        this.currentMenu['index'] = index + 1;
        this.currentMenu['type'] = type;
      } else {
        const menuItem = {
          dynamicSubmenuHistory: [],
          dynamicStaticSubmenuHistory: [],
          index: index + 1,
          type: type,
        };
        this.globService.portalMenuSubject.next(menuItem);
      }
    } else {
      if (index === this.menuList.dynamicStaticSubmenuHistory.length - 1 || index === this.menuList.dynamicSubmenuHistory.length - 1) {
        if (this.portalMenuState !== 'mainMenu') {
          const menuItem = {
            dynamicSubmenuHistory: this.menuList.dynamicSubmenuHistory,
            dynamicStaticSubmenuHistory: this.menuList.dynamicStaticSubmenuHistory,
            index: index + 1,
            type: type,
          };
          this.globService.portalMenuSubject.next(menuItem);
        } else {
        }
      } else {
        if (this.portalMenuState !== 'mainMenu') {
          this.portalMenuState = 'mainMenu';
          this.currentMenu['index'] = index + 1;
          this.currentMenu['type'] = type;
        } else {
          const menuItem = {
            dynamicSubmenuHistory: this.menuList.dynamicSubmenuHistory,
            dynamicStaticSubmenuHistory: this.menuList.dynamicStaticSubmenuHistory,
            index: index + 1,
            type: type,
          };
          this.globService.portalMenuSubject.next(menuItem);
        }
      }
    }
  }

  async ngOnInit() {
    await this.loading.present();
    localStorage.removeItem('ContactCode');
    this.convertText();
    this.setPortalTab();
    this.globService.globSubject.subscribe((result: any) => {
      if (result === 'language_change') {
        this.setPortalTab();
      } else if (result === 'load_end') {
        this.enableTabSelectable();
      }
    });

    this.globService.currentComponent.subscribe((result) => {
      this.currentComponent = result;
    });
    await this.loading.dismiss();
  }

  async scrollEventEnd(event) {
    if (this.currentScrollDepth > this.triggerDepth) {
      switch (this.currentComponent) {
        case 'ContactMessage':
          this.globService.globSubject.next('callMessagesLists');
          break;
        default:
          break;
      }
    }
  }

  async scrollEvent(event) {
    const scrollElement = await event.target.getScrollElement();
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    this.currentScrollDepth = event.detail.scrollTop;
    const targetPercent = 90;
    this.triggerDepth = ((scrollHeight / 100) * targetPercent);
  }

  ngOnDestroy() {
    localStorage.removeItem('ContactCode');
  }

  enableTabSelectable() {
    for (let list of this.tabList) {
      list.avail = true;
    }
  }

  disableTabSelectable() {
    for (let list of this.tabList) {
      list.avail = false;
    }
  }

  setPortalTab() {
    let portal = document.getElementById('customer-portal-tab');
    if (!portal) {
      setTimeout(() => {
        this.setPortalTab();
      }, 200);
    } else {
      if (this.globService.getDirValue() === 'ltr') {
        $('#customer-portal-tab').parent().parent().css({ 'margin-left': 'auto' });
        $('#customer-portal-tab').parent().parent().css({ 'margin-right': 'unset' });
      } else {
        $('#customer-portal-tab').parent().parent().css({ 'margin-right': 'auto' });
        $('#customer-portal-tab').parent().parent().css({ 'margin-left': 'unset' });
      }
    }
  }
  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  convertText() {
    this.tranService.convertText('account').subscribe(result => {
      this.mainCtrl = result;
    });
  }

  selectTabs(event) {
    this.selectedServiceDeskIndex = event.index;
    if (this.selectedServiceDeskIndex === 0 || this.selectedServiceDeskIndex === this.tabList.length + 1) {
      this.enableTabSelectable();
    }

    this.currentComponent = '';
  }

  focusChange(event) {
    this.disableTabSelectable();
  }

  processCareSearch(event) {
    if (event === 'SwitchContactSearch') {
      this.advancedState = true;
    } else if (event === 'backAdvanced') {
      this.advancedState = false;
    } else if (event === 'close') {
      this.navCtrl.pop();
    } else if (typeof (event) !== 'object' && event.includes('SelectServiceDesk')) {
      this.SelectedServiceDesk = event.replace('SelectServiceDesk', '');
      if (this.tabList.length < 4) {
        let availPush = true;
        for (let i = 0; i < this.tabList.length; i++) {
          if (this.tabList[i].ContactCode === this.SelectedServiceDesk) {
            availPush = false;
            this.selectedServiceDeskIndex = i + 1;
          }
        }
        if (availPush) {
          let tabItem = {
            Title: 'account',
            Type: 'ServiceDeskDetail',
            Value: '',
            ContactCode: this.SelectedServiceDesk,
            avail: false,
            Result: ''
          }
          this.tabList.push(tabItem);
          this.selectedServiceDeskIndex = this.tabList.length;
        }
      } else {
        let availPush = true;
        for (let i = 0; i < this.tabList.length; i++) {
          if (this.SelectedServiceDesk === this.tabList[i].ContactCode) {
            availPush = false;
            this.selectedServiceDeskIndex = i + 1;
          }
        }
        if (availPush) {
          this.tranService.convertText('limit_tab_close_old').subscribe(value => {
            this.toast.present(value);
          });
        }
      }
      this.setContactCode();
    }
  }

  setContactCode() {
    if (this.tabList.length > 0) {
      localStorage.setItem('ContactCode', this.tabList[0].ContactCode);
    } else {
      localStorage.removeItem('ContactCode');
    }
  }

  advancedSearch(newSearchResult) {
    this.advancedState = false;
    this.advancedSearchResult = newSearchResult;
  }

  closeTab(index) {
    this.tabList.splice(index, 1);
    if (index === this.tabList.length) {
      this.selectedServiceDeskIndex = index;
    } else {
      // this.selectedServiceDeskIndex = index + 1;
    }
    // if (index === 0) {
    //   this.selectedServiceDeskIndex = 0;
    // } else {
    //   this.selectedServiceDeskIndex = index;
    // }
    this.setContactCode();
  }

  availPushCustomerTab(type) {
    let avail = true;
    for (let i = 0; i < this.tabList.length; i++) {
      if (this.tabList[i].Type === type) {
        avail = false;
        this.selectedServiceDeskIndex = i + 1;
      }
    }
    return avail;
  }

  loadEnd(event) {
  }

  ScrollToTop(topValue) {
    this.content.scrollToPoint(0, topValue, 500);
  }

  ProcessCustomer(event, index) {
    switch (event.type) {
      case 'content-scroll':
        let scrollTop = parseInt(event.data, 10);
        this.ScrollToTop(scrollTop);
        break;
      case 'closeTab':
        this.tabList[index].Result = null;
        break;

      default:
        break;
    }
  }

  processMenu(event) {
    if (event.includes('portalmenu')) {
      this.menuList = [];

      const menuResult = event.split('&&&');
      const navigation = menuResult[2];
      this.menuList = JSON.parse(menuResult[1]);
      if (navigation !== '') {
        this.portalMenuState = navigation;
      }
      this.cdr.detectChanges();

    } else {
      this.portalMenuState = event;
    }
  }

  removeLastMenu() {
    if (this.menuList.dynamicStaticSubmenuHistory.length > 0) {
      this.currentMenu['index'] = this.menuList.dynamicStaticSubmenuHistory.length - 1;
      this.currentMenu['type'] = 'static';
    }
    if (this.menuList.dynamicSubmenuHistory.length > 0) {
      this.currentMenu['index'] = this.menuList.dynamicSubmenuHistory.length - 1;
      this.currentMenu['type'] = 'dynamic';
    }
  }

  async processTab(event) {
    if (!event?.type) {
      if (event === 'close') {
        this.removeLastMenu();
        this.portalMenuState = 'mainMenu';
      } else if (event === 'main') {
        this.removeLastMenu();
        this.portalMenuState = 'mainMenu';
      } else if (event === 'setMinHeight') {
      } else if (event.includes('usage-detail')) {
        this.usageDetail = JSON.parse(event.split('&&')[1]);
        this.portalMenuState = 'usage-detail';
      } else if (event.toLowerCase().includes('height')) {
      } else if (event === 'updateBillOptions') {
      } else if (event.includes('changePassword')) {
        const password = event.split('&&')[1];
        const reqData = {
          'UserId': this.tokens.UserCode,
          'Password': password,
          'SiteId': localStorage.getItem('SiteId'),
          'signType': null
        };

        this.signinService.getRefreshToken(reqData).subscribe(async (result: any) => {

          this.tokens.RefreshToken = result.credentials;
          this.tokens.Type = result.type;
          await this.loading.dismiss();
          this.getAccessToken();
        }, async (error: any) => {
          await this.loading.dismiss();
          if (error.status.toString() === '404') {
            this.navCtrl.navigateForward(['Registration', reqData.UserId]);
          } else {
            await this.loading.forceDismiss();
            this.tranService.errorMessage(error.error.status.toString());
          }
        });
      }
      else {
        if (event?.type === 'close') {
          this.removeLastMenu();
          this.portalMenuState = 'mainMenu';
        } else {
          this.portalMenuState = event;
        }
      }
    }
    else {
      if (event?.type === 'close') {
        this.removeLastMenu();
        this.portalMenuState = 'mainMenu';
      }
    }
  }

  async getAccessToken() {
    await this.loading.present();
    this.signinService.getAccessToken().subscribe(async (result: any) => {
      this.tokens.AccessToken = result.type + ' ' + result.credentials;
      this.globService.increaseCounter();
      this.globService.getAccessToken();
      this.portalMenuState = 'mainMenu';
      this.removeLastMenu();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      // await this.loading.forceDismiss();
      this.tranService.errorMessage(error);
    });
  }

  financialTransaction(event) {
    if (!event.includes('&')) {
      if (event === 'close') {
        this.portalMenuState = 'mainMenu';
        this.removeLastMenu();
        this.pagingParam.pageRowNumber = 1;
        this.pagingParam.rowStep = '10';
        this.pagingParam.SkipRecords = 0;
      } else if (event === 'financials') {
        this.portalMenuState = 'financials';
      } else if (event === 'newInvoice') {
        this.portalMenuState = 'financial-invoice';
      } else if (event === 'receipts') {
        this.portalMenuState = 'receipts';
      } else if (event === 'financial-credit-adjustment') {        
        this.portalMenuState = 'financial-credit-adjustment';
      } else if (event === 'financial-debit-adjustment') {        
        this.portalMenuState = 'financial-debit-adjustment';
      }
    } else {
      let data = event.split('&');
      if (data[0] === 'finantialDetail') {
        this.financialId = data[1];
        this.portalMenuState = 'financial-detail';
        this.pagingParam.pageRowNumber = parseInt(data[2], 10);
        this.pagingParam.rowStep = data[3];
        this.pagingParam.SkipRecords = parseInt(data[4], 10);
      }
    }
  }

}
