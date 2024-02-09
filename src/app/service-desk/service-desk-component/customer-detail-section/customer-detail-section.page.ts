import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ServiceDeskDetailService } from './services/customer-detail.service';
import { MenuController, NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { ContactItemList, ErrorItems, MenuSimpleWebItem } from 'src/app/model';
import { jqxMenuComponent } from 'jqwidgets-ng/jqxmenu';

import { GlobalService } from 'src/services/global-service.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-detail-section',
  templateUrl: './customer-detail-section.page.html',
  styleUrls: ['./customer-detail-section.page.scss'],
})
export class CustomerDetailSectionPage implements OnInit, AfterViewChecked, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() AttributeMode: string = '';
  @Input() updatedEmail: Subject<string> = new Subject<string>();
  @Input() updatedPhone: Subject<string> = new Subject<string>();
  @Input() updateCustomerDetail: Subject<string> = new Subject<string>();
  @Output('getCDLabel') public getCDLabel: EventEmitter<string> = new EventEmitter<string>();


  @ViewChild('jqxCustomerDetailMenu') jqxCustomerDetailMenu: jqxMenuComponent;

  customerDetail: any[] = [];


  contextMenuList = [];

  selectedMenuLink = '';
  attributeMenuList: any;

  getMenuEventSubject: any;

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private detailService: ServiceDeskDetailService,
    private router: Router,

    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
    private menuCtrl: MenuController,
  ) {
    this.tranService.translaterService();

  }

  ngOnInit() {
    this.getCustomerDetail();
    this.updatedEmail.subscribe((result: string) => {
      
      for (let list of this.customerDetail) {
        if (list.data.label.toLowerCase() === 'email') {
          list.data.value = result;
        }
      }
    });

    this.updatedPhone.subscribe((result: string) => {
      
      this.getCustomerDetail();
    });

    this.updateCustomerDetail.subscribe((result: string) => {
      
      this.getCustomerDetail();
    });

    this.getAttributeMenu();

    this.getMenuEventSubject = this.globService.getMenuEventSubject.subscribe((result: any) => {
      this.getCDLabel.emit(result);
      this.menuCtrl.close();
    })

  }

  async getAttributeMenu() {   
    this.globService.getDynamicMenuList('1').subscribe((result: any) => {
      if (result === null) {
        this.tranService.errorToastMessage('no_data');
      } else {
        this.attributeMenuList = this.globService.ConvertKeysToLowerCase(result);
        this.globService.leftMenuSubject.next(this.attributeMenuList);
      }
    }, (error) => {
      this.tranService.errorMessage(error);
    })
  }

  async getCustomerDetail() {
    await this.loading.present();
    this.customerDetail = [];
    this.detailService.getContactItemList(this.ContactCode).subscribe(async (result: ContactItemList[]) => {
      
      await this.loading.dismiss();
      let convertArray = this.globService.ConvertKeysToLowerCase(result);
      for (let i = 0; i < convertArray.length; i++) {
        const list = convertArray[i];
        if (list.datatype === 'Currency') {
          list.value = this.globService.getCurrencyConfiguration(list?.value);
        }
        if (list.key === 'BILL') {
          let val = '';
          let valStr = list.value.split(' ');
          if (valStr.length > 0) {
            valStr[0] = this.globService.getCurrencyConfiguration(valStr[0]);
            for (let item of valStr) {
              val += item + ' ';
            }
          }

          list.value = val.trim();
        }
        let data = {
          data: list,
          tooltip: '',
          selectValue: '--',
          available: false
        };
        if (list.menuitems !== null && typeof (list.menuitems) !== 'undefined' && list.menuitems.length > 0) {
          data.selectValue = list.menuitems[0].id.toString();
        }
        let availPush = true;
        for (let cusList of this.customerDetail) {
          if (cusList.data.menuid !== null && list.menuid !== null) {
            if (cusList.data.menuid.toString() === list.menuid.toString()) {
              availPush = false;
            }
          }
        }
        if (!availPush) {
          data.selectValue = '--';
        }
        if (list.navigationpath) {
          data.available = true;
        }
        this.customerDetail.push(data);
      }

      for (let list of this.customerDetail) {
        if (list.data.label.toLowerCase().includes('password')) {
          list.data.passVal = Array.from(list.data.label).map(it => '*').join('');
        }
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  ngOnDestroy() {
    this.updatedEmail.unsubscribe();
    this.getMenuEventSubject.unsubscribe();
  }

  ngAfterViewChecked() {
  }

  getToolTip(index) {
    let list = this.customerDetail[index];
    let previousTooltip = list.tooltip;
    let changedTooltip = '';
    let element = document.getElementById('valueOfCustomer' + list.data.Key + index);
    if (typeof (element) !== 'undefined' && element !== null) {
      let widthParent = document.getElementById('customer-detail-section-row');
      if (widthParent.clientWidth - 230 > element.clientWidth) {
        if (list.data.tooltip !== '' && list.data.tooltip !== null) {
          list.tooltip = list.data.tooltip;
          changedTooltip = list.data.tooltip;
          if (previousTooltip !== list.tooltip) {
            this.cdr.detectChanges();
          }
        } else {
          list.tooltip = '';
          changedTooltip = '';
          if (previousTooltip !== list.tooltip) {
            this.cdr.detectChanges();
          }
        }
      } else {
        list.tooltip = list.data.Value;
        changedTooltip = list.data.Value;
        if (previousTooltip !== list.tooltip) {
          this.cdr.detectChanges();
        }
      }
    }
    return changedTooltip;
  }

  switchPass(item) {
    if (item.data.label.toLowerCase().includes('password')) {
      if (item.data.passVal) {
        item.data.passVal = null;
      } else {
        item.data.passVal = Array.from(item.data.label).map(it => '*').join('');
      }
    }
  }

  overTable(index) {
    const element = document.getElementById('customeTableBody' + index);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .add('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  leaveTable(index) {
    const element = document.getElementById('customeTableBody' + index);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .remove('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  mousedown(event: any, indexJ): boolean {
    const rightClick = this.isRightClick(event) || jqx.mobile.isTouchDevice();
    if (rightClick) {
      const reqData = {
        'ContactCode': this.customerDetail[indexJ].title,
        'Attribute': this.customerDetail[indexJ].key
      };
      if (this.customerDetail[indexJ].selectValue !== '--') {
        this.contextMenuList = [];
        for (let list of this.customerDetail[indexJ].data.menuitems) {
          let custom = {
            label: list.caption,
            menuLink: list.navigationpath
          }
          this.contextMenuList.push(custom);
        }
        this.openContextMenu(event);
      }
      return false;
    }
  };

  isRightClick(event: any): boolean {
    let rightclick;
    if (!event) event = window.event;
    if (event.which) rightclick = (event.which === 3);
    else if (event.button) rightclick = (event.button === 2);
    return rightclick;
  }

  contextmenuMenu(): boolean {
    return false;
  };

  overContextMenu(menuIndex) {
    const menuElement = document.getElementById('contextMenuLi' + menuIndex);
    menuElement.classList.add('jqx-menu-item-top-hover', 'jqx-menu-item-top-hover-' + this.globService.themeColor);
  }

  leaveContextMenu(menuIndex) {
    const menuElement = document.getElementById('contextMenuLi' + menuIndex);
    menuElement.classList.remove('jqx-menu-item-top-hover', 'jqx-menu-item-top-hover-' + this.globService.themeColor);
  }

  goToContextMenuLink(menuLink) {
    this.jqxCustomerDetailMenu.close();
    this.navCtrl.navigateForward([menuLink]);
  }

  openContextMenu(event) {
    if (typeof (this.jqxCustomerDetailMenu) === 'undefined' || this.jqxCustomerDetailMenu === null) {
      setTimeout(() => {
        this.openContextMenu(event);
      }, 500);
    } else {
      // tslint:disable-next-line:radix
      this.jqxCustomerDetailMenu.open(parseInt(event.clientX), parseInt(event.clientY));
    }
  }


  Itemclick(en) {
    this.getElementIndex(this.contextMenuList, en.target.innerText);
    this.jqxCustomerDetailMenu.close();
    this.navCtrl.navigateForward([this.selectedMenuLink]);
  }

  getElementIndex(samArray, comString) {
    this.selectedMenuLink = '';
    for (let list of samArray) {
      if (list.label === comString) {
        this.selectedMenuLink = list.menuLink;
      }
    }
  }

  gotoDetail(index) {
    this.switchPass(this.customerDetail[index]);
    this.getCDLabel.emit(this.customerDetail[index].data.label + 'Index&&' + index.toString() + 'Index&&'
      + this.customerDetail[index].data.value + 'Index&&' + this.customerDetail[index].data.navigationpath);
  }

  goToMenuDetail(index) {
    this.getCDLabel.emit(this.attributeMenuList.menuitems[index].caption + 'Index&&' + index.toString() + 'Index&&'
      + this.attributeMenuList.menuitems[index].id + 'Index&&' + this.attributeMenuList.menuitems[index].navigationurl);
  }

  getSubmenuDetail(event) {
    this.getCDLabel.emit(event);
  }

  getIconLink(value) {
    return value.includes('http') ? true : false;
  }

  goToNavigation(index) {
    let navPath = '';
    for (let list of this.customerDetail[index].data.menuitems) {
      if (list.Id.toString() === this.customerDetail[index].selectValue) {
        navPath = list.navigationpath;
      }
    }
    this.navCtrl.navigateForward([navPath]);
  }

  openMenu() {

  }

}
