import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { Subject } from 'rxjs';

import * as $ from 'jquery';
import { GlobalService } from 'src/services/global-service.service';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-service-desk-main',
  templateUrl: './service-desk-main.page.html',
  styleUrls: ['./service-desk-main.page.scss'],
})
export class ServiceDeskMainPage implements OnInit {


  @Input() Title: string = '';
  @Input() ContactCode: string = '';

  @Output('ServiceDeskMainComponent') ServiceDeskMainComponent: EventEmitter<string> = new EventEmitter<string>();



  CustomerMain = {
    'title': this.Title,
    'showNot': false,
    'notCount': 3,
    'notDetail': [],
  };

  componentType: string = '';
  componentValue: string = '';
  updatedEmail: Subject<string> = new Subject<string>();
  updatedPhone: Subject<string> = new Subject<string>();
  updateCustomerDetail: Subject<string> = new Subject<string>();
  AddressType: string = '';

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,

    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();


    this.globService.globSubject.subscribe((result: any) => {
      if (result.includes('Index&&')) {
        this.processNavigation(result, 'menu');
      }
    });

  }

  ngOnInit() {

    for (let i = 0; i < this.CustomerMain.notCount; i++) {
      const tempNot = { 'status': false };
      this.CustomerMain.notDetail.push(tempNot);
    }

    this.setCustomerDetailHeader();
  }

  async setCustomerDetailHeader() {
    const headerTitle = await this.tranService.convertText('MyTelco').toPromise();
    const headerType = 'customerDetail';
    const reqData = {
      headerTitle: headerTitle,
      headerType: headerType,
      CustomerMain: this.CustomerMain,
    }
    this.globService.headerSubject.next(reqData);
  }

  gotoDetail(event: any) {
    if (event.includes('Index&&')) {
      this.processNavigation(event, 'component');

      // This is temporary code
      if (event.includes('Status') || event.includes('Type')) {
        this.ServiceDeskMainComponent.emit(event);
      }
    }
  }

  processNavigation(event, type) {
    const NavigationPath = event.split('Index&&')[3];
    this.globService.currentComponent.next(type);
    switch (NavigationPath) {
      case '/Contacts/Emails':
        const email = event.split('Index&&')[2];
        this.goToEmail(email);
        break;
      case '/Contacts/Addresses':
        this.goToAddress();
        break;
      case '/Contacts/Names': case 'Contacts/customer-names':
        this.goToAliases();
        break;
      case '/Contacts/ContactPhones':
        this.goToPhone();
        break;
      case '/Contacts/Activities':
        this.goToActivities();
        break;
      case '/Contacts/Notes':
        this.goToNotes();
        break;
      case '/Contacts/Identifications':
        this.goToMenuOption('Identifications');
        break;
      case '/Contacts/UserDefinedData':
        this.goToMenuOption('user-defined-data');
        break;
      case '/Contacts/EnquiryPassword':
        this.goToMenuOption('Contacts-EnquiryPassword');
        break;
      case '/Accounts/BillOptions':
        this.componentType = 'BillOptions';
        this.checkPhoneScroll('bill-options');
        break;
      case '/Messages/Contacts':
        this.goToMenuOption('messages-contacts');
        break;
      case '/Users/Authentication':
        this.goToMenuOption('Authentication');
        break;
      case '/Messages/Images':
        this.goToMenuOption('messages-image');
        break;
      case '/Contacts/Events/New':
        this.goToMenuOption('AccountEventNew');
        break;
      case '/Accounts/Plans/PlanHistory':
        this.goToMenuOption('AccountsPlanHistory');
        break;
      case '/Contacts/RelatedContacts':
        this.goToMenuOption('RelatedContacts');
        break;
      case '/Contacts/RelatedContacts/New':
        this.goToMenuOption('RelatedContactsNew');
        break;
      case '/Charges/AccountCharges/New':
        this.goToMenuOption('AccountChargesNew');
        break;
      case '/Charges/AccountOverrides/New':
        this.goToMenuOption('AccountOverridesNew');
        break;
      case null:
        break;
      case '':
        break;
      case 'Contacts/customer-service-groups':
        this.ServiceDeskMainComponent.emit(event + 'IndexServiceGroup');
        break;
      default:
        if (type !== 'menu') {
          this.ServiceDeskMainComponent.emit(event);
        }
        break;
    }
    if(NavigationPath.startsWith('/Tasks/Contacts/New')){
      const categoryId = (NavigationPath == '/Tasks/Contacts/New') ? '' : NavigationPath.replace('/Tasks/Contacts/New/', '');
      this.goToMenuOption('AccountTaskNew' + categoryId);

    }
  }

  goToMenuOption(type) {
    this.componentType = type;
  }

  processMenuOptions(event) {
    if (event === 'close' || event?.type === 'close') {
      this.componentType = '';
    } else {
      this.updateCustomerDetail.next(event);
    }
  }

  goToEmail(email) {
    this.componentType = 'Email';
    this.componentValue = email;
    this.checkPhoneScroll('customer-contact-email');
  }

  goToAddress() {
    this.componentType = 'Address';
    this.checkPhoneScroll('customer-contact-address');
  }

  goToAliases() {
    this.componentType = 'Aliases';
    this.checkPhoneScroll('customer-contact-alias');
  }

  goToPhone() {
    this.componentType = 'Phones';
    this.checkPhoneScroll('customer-contact-phone');
  }

  checkPhoneScroll(idName) {
    let childElm = $('#' + idName);
    if (childElm === null || typeof (childElm) === 'undefined') {
      setTimeout(() => {
        this.checkPhoneScroll(idName);
      }, 500);
    } else {
      if (childElm.length > 0) {
        // this.ServiceDeskMainComponent.emit('content-scroll' + childElm.offset().top);
        document.getElementById(idName).scrollIntoView();
      } else {
        setTimeout(() => {
          this.checkPhoneScroll(idName);
        }, 500);
      }
    }
  }

  goToActivities() {
    this.componentType = 'Activities';
    let element = document.getElementById('activities-row');
    if (element === null || typeof (element) === 'undefined') {
      setTimeout(() => {
        this.goToActivities();
      }, 300);
    } else {
      let detailSection = document.getElementById('customer-detail-section-container');
      if (element.clientHeight > detailSection.clientHeight) {
        element.style.height = detailSection.clientHeight + 'px';
      } else {
        let windowHeight = window.screen.height;
        if (element.clientHeight > windowHeight) {
          element.style.height = windowHeight + 'px';
        } else {
          element.style.height = '900px';
        }
      }
    }
  }

  processContactActivities(event) {
  }

  goToNotes() {
    this.componentType = 'Notes';
    // this.processContactNotes('loaded');
    this.checkPhoneScroll('contact-notes-container');
  }

  processContactNotes(event) {
    if (event === 'loaded') {
      let element = document.getElementById('contact-notes-container');
      if (element === null || typeof (element) === 'undefined') {
        setTimeout(() => {
          this.processContactNotes(event);
        }, 500);
      } else {
        let detailSection = document.getElementById('customer-detail-section-container');
        if (element.clientHeight >= detailSection.clientHeight) {
          element.style.height = detailSection.clientHeight + 'px';
        } else {
          // let windowHeight = window.screen.height;
          // if (element.clientHeight > windowHeight) {
          //   element.style.height = windowHeight + 'px';
          // } else {
          //   element.style.height = '900px';
          // }
          element.style.height = "auto";
        }
      }
    } else if (event === 'submitted') {
      this.updateCustomerDetail.next(event);
    }
  }

  getServiceDetail(event, index) {
    if (event.includes('ServiceListNew')) {
      this.ServiceDeskMainComponent.emit(event);
    }
  }

  goBack() {
    this.ServiceDeskMainComponent.emit('close');
  }

  showNotification() {
    this.CustomerMain.showNot = true;
  }

  sawNot(notList) {
    this.CustomerMain.notDetail[notList].status = true;
    this.CustomerMain.notCount = 0;
    for (const list of this.CustomerMain.notDetail) {
      if (list.status === false) {
        this.CustomerMain.notCount++;
      }
    }
    this.cdr.detectChanges();
  }

  closeNotification() {
    this.CustomerMain.showNot = false;
  }

  callBillFunction(en, index) {
    if (en === 'service_desk') {
      this.componentType = '';
    }
  }

  processContactPhone(event) {
    if (event === 'close') {
      this.componentType = '';
    } else if (event.includes('close-history')) {
      this.checkPhoneScroll('customer-contact-phone');
    } else {
      this.updatedPhone.next(event);
    }
  }

  processContactAddress(event) {
    if (event === 'close') {
      this.componentType = '';
    } else if (event.includes('close-history')) {
      this.checkPhoneScroll('customer-contact-address');
    } else if (event.includes('address-management')) {
      this.checkPhoneScroll(event);
    } else {
      this.updateCustomerDetail.next(event);
    }
  }

  processContactEmail(event) {
    if (event === 'close') {
      this.componentType = '';
    } else if (event.includes('close-history')) {
      this.checkPhoneScroll('customer-contact-email');
    } else {
      this.updatedEmail.next(event);
    }
  }

  processContactAliases(event) {
    if (event === 'close') {
      this.componentType = '';
    } else if (event.includes('close-history')) {
      this.checkPhoneScroll('customer-contact-alias');
    } else {
      this.updateCustomerDetail.next(event);
    }
  }

  processBillOptions(event) {
    if (event === 'close') {
      this.componentType = '';
    } else if (event === 'updateBillOptions') {
      this.updateCustomerDetail.next(event);
    }
  }

  closeComponent() {
    this.componentType = '';
  }

}
