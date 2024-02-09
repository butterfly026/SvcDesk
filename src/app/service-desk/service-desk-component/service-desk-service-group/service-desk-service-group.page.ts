import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { UtilityService } from 'src/app/utility-method.service';
import { GlobalService } from 'src/services/global-service.service';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-service-desk-service-group',
  templateUrl: './service-desk-service-group.page.html',
  styleUrls: ['./service-desk-service-group.page.scss'],
})
export class ServiceDeskServiceGroupPage implements OnInit, OnChanges {

  @Input() ContactCode: string = '';
  @Input() ResultMenu: string = '';
  @Output('ServiceDeskServiceLevelTabComponent') ServiceDeskServiceLevelTabComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  pageTitle: string = '';
  pageId: string = '';


  selectedServiceDeskServiceTabIndex: number = -1;
  advancedState: boolean = false;

  tabList: {
    Title: string;
    Type: string;
    ContactCode: string;
    Id?: string;
    Value?: string;
    showMenu?: boolean;
    avail?: boolean;
    ConfirmClose?: boolean;
    ShowAskConfirm?: boolean;
  }[] = [];
  SelectedServiceDesk: string = '';
  mainCtrl: string = '';

  invoiceInput: any;
  usageDetailInput: any;

  attributeMenuList: any;
  curServiceId: string = '';

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,

    private utilityService: UtilityService,
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,

  ) { }

  async ngOnInit() {
    let tabItem = {
      Title: 'details',
      Type: 'ServiceDeskDetail',
      Value: '',
      ContactCode: this.ContactCode,
      showMenu: true,
    };

    this.tabList.push(tabItem);
    this.selectedServiceDeskServiceTabIndex = 0;
    tabItem['attributeMenuList'] = await this.getMenuItems('ContactCode', this.ContactCode);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ResultMenu) {
      if (this.ResultMenu === 'load_end') {
        this.enableTabSelectable();
      } else if (this.ResultMenu.includes('Index&&')) {
        this.processNavigation(this.ResultMenu);
      }
    }
  }

  processNavigation(event) {
    const value = event.split('Index&&')[2];
    const title = event.split('Index&&')[0];
    const navigationPath = event.split('Index&&')[3].trimRight();

    switch (navigationPath) {
      // Accounts
      case '/Events/AccountEventHistory':
        this.addNewTab('AccountEvent', '', title, this.ContactCode, false);
        break;

      // Charges
      case '/Charges/AccountCharges':
        this.addNewTab('AccountCharges', '', title, 'AccountCharges', false);
        break;
      case '/Charges/AccountOverrides':
        this.addNewTab('ChargesAccountOverrides', '', title, 'ChargesAccountOverrides', false);
        break;
      case '/Charges/PriceOverrides/Accounts':
        this.addNewTab('ChargesPriceOverridesAccounts', '', title, 'ChargesPriceOverridesAccounts', false);
        break;

      // Financials
      case '/FinancialTransactions/Transactions':
        this.addNewTab('ShowFinancial', '', 'showFinancial', '', false);
        break;
      case '/FinancialTransactions/Invoices/New':
        this.addNewTab('FinancialTransactionsInvoicesNew', '', title, '', false);
        break;
      case '/FinancialTransactions/Receipts/New':
        this.addNewTab('FinancialTransactionsReceiptsNew', '', title, '', false);
        break;
      case '/FinancialTransactions/CreditAdjustments/New':
        this.addNewTab('FinancialTransactionsCreditAdjustmentNew', '', title, '', false);
        break;
      case '/FinancialTransactions/DebitAdjustments/New':
        this.addNewTab('FinancialTransactionsDebitAdjustmentNew', '', title, '', false);
        break;
      case '/FinancialTransactions/AutoAllocate/All':
        this.addNewTab('FinancialTransactionsAutoAllocateAll', '', title, '', false);
        break;


      case '/Accounts/Usage':
        this.addNewTab('UsageAccount', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;

      case '/Configrations/Reports/FTP':
        this.addNewTab('AccountFTPConfiguration', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Configurations/SMTP':
        this.addNewTab('AccountSMTPConfiguration', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Configurations/Address':
        this.addNewTab('AccountAddressConfiguration', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Configurations/ChangePassword':
        this.addNewTab('AccountChangePasswordConfiguration', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Configurations/PasswordConfiguration':
        this.addNewTab('AccountPasswordConfiguration', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Configurations/Messages/Templates/New':
        this.addNewTab('Template Editor', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Accounts/Documents':
        this.addNewTab('AccountDocuments', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Accounts/CostCenters':
        this.addNewTab('AccountCostCenters', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;


      // Service

      case '/Services/Events':
        this.addNewTab('ServiceEvent', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      // case '/Services/Events/New':
      //   this.addNewTab('ServicesEventsNew', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
      //   this.enableTabSelectable();
      //   break;

      case '/Charges/ServiceCharges':
        this.addNewTab('ServiceCharges', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Charges/ServiceOverrides':
        this.addNewTab('ChargesServiceOverrides', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;

      // case '/Services/Plans/PlanHistory':
      //   this.addNewTab('ServicesPlanHistory', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
      //   break;
      // case '/Services/Plans/New':
      //   this.addNewTab('ServicesPlanNew', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
      //   break;
      // case '/Services/Plans/PlanChange':
      //   this.addNewTab('ServicesPlanChange', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
      //   break;

      case '/Services/Usage':
        this.addNewTab('UsageService', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Charges/Configurations/Groups':
        this.addNewTab('ChargesConfigurationsGroups', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;

      case '/Services/Documents':
        this.addNewTab('ServiceDocuments', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Services/Discounts':
        this.addNewTab('ServiceDiscount', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Services/Attributes':
        this.addNewTab('ServiceAttributes', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Services/New':
        this.addNewTab('ServicesNew', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false, true);
        break;
      case '/Services/CostCenters':
        this.addNewTab('ServiceCostCenters', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Services/Terminations/Terminate':
        // this.addNewTab('Services/Terminations/Terminate', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;



      case '/Services/Notes':
        // this.addNewTab('ServiceNote', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;


      // Bills Menu
      case 'BillHistory':
        this.addNewTab('BillHistory', '', 'bill_history', 'BillHistory', false);
        break;
      case '/Bills/Delegations/Accounts':
        this.addNewTab('/Bills/Delegations/Accounts', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Bills/Delegations/New':
        this.addNewTab('/Bills/Delegations/New', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Bills/Delegations/Update':
        this.addNewTab('/Bills/Delegations/Update', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Bills/Disputes/Accounts':
        this.addNewTab('/Bills/Disputes/Accounts', '', title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Bills/Disputes/New':
        this.addNewTab('/Bills/Delegations/New', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Bills/Disputes/Update':
        this.addNewTab('/Bills/Delegations/Update', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;

      case 'Contacts/customer-service-groups':
        this.addNewTab('ServiceGroup', '', 'service_group', '', false);
        break;
      case '/Contacts/PaymentMethods':
        this.addNewTab('PaymentMethod', '', 'payment_method', 'PaymentMethod', false);
        break;
      // Tasks
      case '/Tasks/Services':
        this.addNewTab('/Tasks/Services', '', title + ' - ' + this.tabList[this.selectedServiceDeskServiceTabIndex].Title, this.tabList[this.selectedServiceDeskServiceTabIndex].Value, false);
        break;
      case '/Tasks/Contacts':
        this.addNewTab('/Tasks/Contacts', '', title, '', false);
        break;
      // Deposit
      case '/Accounts/Configurations/DepositStatusReasons':
        this.addNewTab('/Accounts/Configurations/DepositStatusReasons', '', title, '', false);
        break;
      case '/Accounts/Deposits':
        this.addNewTab('/Accounts/Deposits', '', title, '', false);
        break;
      case '/Accounts/Installments':
        this.addNewTab('/Accounts/Installments', '', title, '', false);
        break;
      case '/Contracts':
        this.addNewTab('/Contracts', '', title, '', false);
        break;
      case '/Contracts/Penalties':
        this.addNewTab('/Contracts/Penalties', '', title, '', false);
        break;
      case '/Contacts/AuthorisedAccounts':
        this.addNewTab('/Contacts/AuthorisedAccounts', '', title, '', false);
        break;

      default:
        this.notURLAvailable();
        break;
    }
  }

  async getMenuItems(type, value) {
    try {
      const result = await this.globService.getMenu(type, value).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      return convResult;
    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  closeTab(index, confirmedClose?) {
    if (!confirmedClose) {
      if (confirmedClose === false && this.tabList[index].ConfirmClose) {
        this.tabList[index].ShowAskConfirm = false;
        this.cdr.detectChanges();
      } else if (this.tabList[index].ConfirmClose) {
        this.tabList[index].ShowAskConfirm = true;
        this.cdr.detectChanges();
      } else {

        this.tabList.splice(index, 1);
        if (this.selectedServiceDeskServiceTabIndex != index) {
        } else {
          this.selectedServiceDeskServiceTabIndex = index;
        }

        this.ServiceDeskServiceLevelTabComponent.emit({ type: 'closeTab' });
      }
    } else {
      this.tabList.splice(index, 1);
      if (this.selectedServiceDeskServiceTabIndex != index) {
      } else {
        this.selectedServiceDeskServiceTabIndex = index;
      }

      this.ServiceDeskServiceLevelTabComponent.emit({ type: 'closeTab' });
    }

  }

  async processMainComponent(event) {
    if (event === 'close') {
      this.selectedServiceDeskServiceTabIndex = 0;
    } else if (event.includes('IndexServiceGroup')) {
      this.addNewTab('ServiceGroup', '', 'service_group', '', false);
    } else if (event.includes('ServiceListNew')) {
      const value = event.split('ServiceListNew')[1];
      const title = event.split('ServiceListNew')[0];
      this.curServiceId = title;
      this.addNewTab('CustomerServiceType', 'Service', title, value, true);

    } else if (event.includes('Index&&')) {

      this.processNavigation(event);

    } else if (event.includes('content-scroll')) {
      this.ServiceDeskServiceLevelTabComponent.emit({ type: 'content-scroll', data: event.replace('content-scroll', '') });
    }
    //  else if (event.includes('Status') || event.includes('Type')) {
    //   this.addNewTab('ShowFinancial', '', 'showFinancial', '', false);
    // }
  }

  async addNewTab(type, menuType, title, value, showMenu, askConfirmClose?) {

    let availPush = true;
    for (let i = 0; i < this.tabList.length; i++) {
      if (this.tabList[i].Id === title + value) {
        availPush = false;
        this.selectedServiceDeskServiceTabIndex = i;
      }
    }
    if (this.tabList.length < 10) {
      if (availPush) {
        const tabTitle = {
          Title: title,
          Type: type,
          Value: value,
          ContactCode: this.ContactCode,
          showMenu: showMenu,
          Id: title + value,
          ShowAskConfirm: false,
        }
        if (askConfirmClose) {
          tabTitle['ConfirmClose'] = askConfirmClose;
        }
        if (menuType == 'ContactCode' || menuType === 'Service') {
          this.tabList[this.tabList.length - 1]['attributeMenuList'] = this.getMenuItems(menuType, value);
        }
        this.tabList.push(tabTitle);
        this.selectedServiceDeskServiceTabIndex = this.tabList.length;
        this.cdr.detectChanges();
      }
    } else {
      if (availPush) {
        this.tranService.convertText('limit_tab_close_old').subscribe(value => {
          this.toast.present(value);
        });
      }
    }
    this.globService.currentComponent.next(type);
  }

  goToPaymentList() {
    const tabItem = {
      Id: 'PaymentList',
      Title: 'payment_list',
      Type: 'PaymentList',
      Value: 'PaymentList',
      ContactCode: this.ContactCode,
      avail: false,
    }

    if (this.availPushCustomerTab(tabItem.Id)) {
      this.tabList.push(tabItem);
      this.selectedServiceDeskServiceTabIndex = this.tabList.length;
    }
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

  focusChange(event) {
    this.disableTabSelectable();
  }

  async selectTabs(event) {
    this.selectedServiceDeskServiceTabIndex = event.index;
    if (event.index === 0) {
      this.tabList[event.index]['attributeMenuList'] = await this.getMenuItems('ContactCode', this.ContactCode);
    } else {
      if (this.tabList[event.index].showMenu) {
        this.tabList[event.index]['attributeMenuList'] = await this.getMenuItems('Service', this.tabList[event.index].Value);
      }
      if (this.tabList[event.index].Value && this.tabList[event.index].Type === 'CustomerServiceType') {
        this.globService.globalComponentSubject.next({ type: 'serviceReferenceSubject', data: this.tabList[event.index].Value })
      }
    }
  }

  animationDone() {
    this.enableTabSelectable();
  }

  availPushCustomerTab(Id) {
    if (this.tabList.length < 10) {
      let avail = true;
      for (let i = 0; i < this.tabList.length; i++) {
        if (this.tabList[i].Id === Id) {
          avail = false;
          this.selectedServiceDeskServiceTabIndex = i;
          this.cdr.detectChanges();

          return;
        }
      }
      return avail;
    } else {
      let avail = true;
      for (let i = 0; i < this.tabList.length; i++) {
        if (this.tabList[i].Id === Id) {
          avail = false;
          this.selectedServiceDeskServiceTabIndex = i;
          this.cdr.detectChanges();
          return;
        }
      }
      this.cdr.detectChanges();
      if (avail) {
        this.tranService.convertText('limit_tab_close_old').subscribe(value => {
          this.toast.present(value);
        });
      }
      return false;
    }
  }

  goToSMS() {

    const tabItem = {
      Id: 'SMS',
      Title: 'sms',
      Type: 'SMS',
      Value: '',
      ContactCode: this.SelectedServiceDesk
    }

    if (this.availPushCustomerTab(tabItem.Id)) {
      this.tabList.push(tabItem);
      this.selectedServiceDeskServiceTabIndex = this.tabList.length;
    }
  }

  goToEmail(email) {

    const tabItem = {
      Id: 'Email' + email,
      Title: 'email',
      Type: 'Email',
      Value: email,
      ContactCode: this.SelectedServiceDesk
    }

    if (this.availPushCustomerTab(tabItem.Id)) {
      this.tabList.push(tabItem);
      this.selectedServiceDeskServiceTabIndex = this.tabList.length;
    }
  }

  goToBillListUCRetail() {
    const tabItem = {
      Id: 'BillListUCRetail',
      Title: 'billListUCRetail',
      Type: 'BillListUCRetail',
      Value: '',
      ContactCode: this.ContactCode,
      showMenu: false,
    }

    if (this.availPushCustomerTab(tabItem.Id)) {
      this.tabList.push(tabItem);
      this.selectedServiceDeskServiceTabIndex = this.tabList.length;
    }
  }

  goToContact() {
    const tabItem = {
      Id: 'ContactMethod',
      Title: 'contact_methods',
      Type: 'ContactMethod',
      Value: '',
      ContactCode: this.ContactCode
    }

    if (this.availPushCustomerTab(tabItem.Id)) {
      this.tabList.push(tabItem);
      this.selectedServiceDeskServiceTabIndex = this.tabList.length;
    }
  }

  goToTransactionHistory(billId, billNumber) {
    const tabItem = {
      Id: 'BillTransaction' + ' [' + billNumber + ']',
      Title: 'bill_transaction',
      Type: 'BillTransaction',
      BillId: billId,
      ContactCode: this.ContactCode,
      showMenu: false,
    }

    this.tranService.convertText('bill_transaction').subscribe(result => {
      tabItem.Title = result + ' [' + billNumber + ']';

      if (this.availPushCustomerTab(tabItem.Id)) {
        this.tabList.push(tabItem);
        this.selectedServiceDeskServiceTabIndex = this.tabList.length;
      }
    });
  }

  goToBillServices(billId, billNumber) {
    const tabItem = {
      Id: 'BillService' + ' [' + billNumber + ']',
      Title: 'bill_services',
      Type: 'BillService',
      BillId: billId,
      ContactCode: this.ContactCode,
      showMenu: false,
    }

    this.tranService.convertText('bill_services').subscribe(result => {
      tabItem.Title = result + ' [' + billNumber + ']';

      if (this.availPushCustomerTab(tabItem.Id)) {
        this.tabList.push(tabItem);
        this.selectedServiceDeskServiceTabIndex = this.tabList.length;
      }
    });
  }

  goToBillCharges(billId, billNumber) {
    const tabItem = {
      Id: 'BillCharges' + ' [' + billNumber + ']',
      Title: 'bill_charges',
      Type: 'BillCharges',
      BillId: billId,
      ContactCode: this.ContactCode,
      showMenu: false,
    }

    this.tranService.convertText('bill_charges').subscribe(result => {
      tabItem.Title = result + ' [' + billNumber + ']';

      if (this.availPushCustomerTab(tabItem.Id)) {
        this.tabList.push(tabItem);
        this.selectedServiceDeskServiceTabIndex = this.tabList.length;
      }
    });
  }

  goToBillDisputes(billId, billNumber) {
    const tabItem = {
      Id: 'BillDisputes' + ' [' + billNumber + ']',
      Title: 'bill_disputes',
      Type: 'BillDisputes',
      BillId: billId,
      BillNumber: billNumber,
      ContactCode: this.ContactCode,
      showMenu: false,
    }

    this.tranService.convertText('bill_disputes').subscribe(result => {
      tabItem.Title = result + ' [' + billNumber + ']';

      if (this.availPushCustomerTab(tabItem.Id)) {
        this.tabList.push(tabItem);
        this.selectedServiceDeskServiceTabIndex = this.tabList.length;
      }
    });
  }

  goToBillEmail(billId, docList, billNumber) {
    const tabItem = {
      Id: 'BillEmail' + ' [' + billNumber + ']',
      Title: 'bill_email',
      Type: 'BillEmail',
      BillId: billId,
      DocLists: JSON.parse(docList),
      ContactCode: this.ContactCode,
      showMenu: false,
    }

    this.tranService.convertText('bill_email').subscribe(result => {
      tabItem.Title = result + ' [' + billNumber + ']';

      if (this.availPushCustomerTab(tabItem.Id)) {
        this.tabList.push(tabItem);
        this.selectedServiceDeskServiceTabIndex = this.tabList.length;
      }
    });
  }

  goToFinancialDetail(value, contactCode, number, type) {
    const tabItem = {
      Id: 'FinantialTransactionDetails',
      Title: `${type}: ${number}`,
      Type: 'FinantialTransactionDetails',
      Value: value,
      ContactCode: contactCode,
      showMenu: false,
    }

    if (this.availPushCustomerTab(tabItem.Id)) {
      this.tabList.push(tabItem);
      this.selectedServiceDeskServiceTabIndex = this.tabList.length;
    } else {
      this.tabList.map(it => {
        if (it.Id === tabItem.Id) {
          it.Title = value;
          it.Value = value;
        }
        return it;
      });
    }
  }

  goToFinancialReallocate(value, contactCode, number, type): void {
    const tabItem = {
      Id: 'financial-reallocate',
      Title: `${this.tranService.instant('FinancialReallocate')}: ${type}: ${number}`,
      Type: 'financial-reallocate',
      Value: value,
      ContactCode: contactCode,
      showMenu: false,
    }

    if (this.availPushCustomerTab(tabItem.Id)) {
      this.tabList.push(tabItem);
      this.selectedServiceDeskServiceTabIndex = this.tabList.length;
    } else {
      this.tabList.map(it => {
        if (it.Id === tabItem.Id) {
          it.Title = value;
          it.Value = value;
        }
        return it;
      });
    }
  }

  loadEnd(event) {
  }

  getDetailLabel(en: any) {
  }

  paymentMethodListProcess(en, index) {
    if (en === 'closeTab') {
      this.closeTab(index);
    } else if (en === 'new_payment') {
      this.tabList[index].Type = 'PaymentNew';
    } else if (en === 'added') {
      this.tabList[index].Type = 'PaymentList';
    } else if (en === 'cancel') {
      this.tabList[index].Type = 'PaymentList';
    } else {
      this.tabList[index].Type = 'UpdatePayment';
      this.tabList[index].Value = en;
    }
  }

  callBillFunction(en, index) {
    if (en === 'service_desk') {
      this.closeTab(index);
    } else if (en === 'close') {
      this.closeTab(index);
    }
  }

  cancelDetailTab(en, index) {
    if (en && en.type) {
      switch (en.type) {
        case 'bill_services':
          this.goToBillServices(en.data.billId, en.data.billnumber);
          break;
        case 'bill_transaction':
          this.goToTransactionHistory(en.data.billId, en.data.billnumber);
          break;
        case 'bill_charges':
          this.goToBillCharges(en.data.billId, en.data.billnumber);
          break;
        case 'bill_disputes':
          this.goToBillDisputes(en.data.billId, en.data.billnumber);
          break;
        case 'invoice_details':
          break;
        case 'service_desk':
          this.closeTab(index);
          break;
        case 'bill_now':
          this.closeTab(index);
          this.addNewTab('BillNow', '', 'bill_now', '', false);
          break;

        default:
          break;
      }
    } else {
      if (!en.includes('&')) {
        if (en === 'service_desk') {
          this.closeTab(index);
        } else if (en === 'receipt_details') {
          this.tabList[index].Type = 'ReceiptDetails';
        } else if (en === 'invoice_details') {
          this.tabList[index].Type = 'InvoiceDetails';
        } else if (en === 'bill_history') {
          this.tabList[index].Type = 'BillHistory';
        } else if (en === 'usage-detail') {
          this.tabList[index].Type = 'UsageDetail';
        } else if (en === 'close') {
          this.closeTab(index);
        } else if (en === 'list') {
          this.closeTab(index);
        } else if (en === 'close') {
          this.closeTab(index);
        }
      }
    }
  }

  financialTransaction(event, index, contactCode) {
    if (!event.includes('&')) {
      if (event === 'service_desk') {
        this.closeTab(index);
      } else if (event === 'close') {
        this.closeTab(index);
      } else if (event === 'financials') {
        this.closeTab(index);
      } else if (event === 'financial-invoice') {
        this.addNewTab('FinancialTransactionsInvoicesNew', '', 'new_invoice', '', false);
      } else if (event === 'receipts') {
        this.addNewTab('FinancialTransactionsReceiptsNew', '', 'new_receipt', '', false);
      } else if (event === 'financial-credit-adjustment') {
        this.addNewTab('FinancialTransactionsCreditAdjustmentNew', '', 'NewCreditAdjustment', '', false);
      } else if (event === 'financial-debit-adjustment') {
        this.addNewTab('FinancialTransactionsDebitAdjustmentNew', '', 'NewDebitAdjustment', '', false);
      }
    } else {
      let data = event.split('&');
      if (data[0] === 'finantialDetail') {
        this.goToFinancialDetail(data[1], contactCode, data[2], data[3])
      }

      if (data[0] === 'financial-reallocate') {
        this.goToFinancialReallocate(data[1], contactCode, data[2], data[3])
      }
    }
  }

  processPayment(event, index) {
    if (event === 'setMinHeight') {
      this.ServiceDeskServiceLevelTabComponent.emit(event);
    }
    if (event == 'close') {
      this.closeTab(index);
    }
  }

  processAttributeMenu(event, index) {

    if (event?.type) {
      switch (event.type) {
        case 'close':
          if (event.confirmedClose === true || event.confirmedClose === false) {
            this.closeTab(index, event.confirmedClose);
          } else {
            this.closeTab(index);
          }

          break;
        default:
          break;
      }
    } else {
      if (event === 'close') {
        this.closeTab(index);
      } else if (event === 'list') {
        this.closeTab(index);
      } else if (event.includes('usage-detail')) {
        this.usageDetailInput = JSON.parse(event.split('&&')[1]);
        this.tabList[index].Type = 'UsageDetail';
      }
    }
  }

  async openErrorAlert() {
    this.tranService.errorToastOnly('no_menu_path_txt');
  }

  notURLAvailable() {
    // this.tranService.errorToastMessage('url_not_available');
  }

}
