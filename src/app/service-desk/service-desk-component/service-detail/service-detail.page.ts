import { Component, OnInit, ChangeDetectorRef, Input, AfterViewChecked, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ServiceDetailService } from './services/service-detail.service';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService } from 'src/services';

import { ContactItemList } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
})
export class ServiceDetailPage implements OnInit, OnDestroy {

  @Input('ServiceId') ServiceId: string = '';
  @Input('ContactCode') ContactCode: string = '';
  @Input() ServiceReferenceId: string = '';

  @Output('getCDLabel') public getCDLabel: EventEmitter<string> = new EventEmitter<string>();

  @Output('serviceLoadEnd') public serviceLoadEnd: EventEmitter<string> = new EventEmitter<string>();



  serviceDetail = [];
  serviceListArray: any;

  ServiceType: string = 'ServiceNotes';
  componentTitle: string = 'notes';
  subList: any[] = [];
  availableCall: boolean = true;
  serviceDetailType: string = '';

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceDetailService,

    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();

  }

  async ngOnInit() {
    this.getServiceDetail();

    const sub1 = this.globService.globSubject.subscribe((result: any) => {
      if (result.includes('Index&&')) {
        this.processNavigation(result, 'menu');
      }
    });

    const sub2 = this.globService.globalComponentSubject.subscribe((result: any) => {
      if (result.type === 'serviceReferenceSubject') {
        if (this.ServiceReferenceId === result.data) {
          this.availableCall = true;
        } else {
          this.availableCall = false;
        }
      }
    });

    this.subList.push(sub1);
    this.subList.push(sub2);

  }

  async getServiceDetail() {
    let passwordList = this.serviceDetail.find(detail => detail.Key.toLowerCase() === 'password');
    let passwordDisplayed = false;
    if (passwordList) {
      passwordDisplayed = passwordList.displayed;
    }
    this.serviceDetail = new Array();
    await this.loading.present();
    this.serService.ServiceItemList(this.ContactCode, this.ServiceId).subscribe(async (result: ContactItemList[]) => {

      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_services');
      } else {
        this.serviceListArray = result[0];
        for (const list of result) {
          if (list.Key.toLowerCase() === 'srvc_type_narr') {
            this.serviceDetailType = list.Value;
          }
          let newList = { ...list, displayed: true };
          if (list.Key.toLowerCase() === 'password') {
            newList.displayed = passwordDisplayed;
          }
          this.serviceDetail.push(newList);
        }
        this.serviceLoadEnd.emit('loaded');
      }
    }, async (error: any) => {
      await this.loading.dismiss();

      this.tranService.errorMessage(error);
    });
  }

  ngOnDestroy(): void {
    for (const list of this.subList) {
      list.unsubscribe();
    }
  }

  overTable(index) {
    const element = document.getElementById('customeTableBodyServiceDetail' + index);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .add('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  leaveTable(index) {
    const element = document.getElementById('customeTableBodyServiceDetail' + index);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .remove('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  gotoDetail(index) {
    if (this.serviceDetail[index].Key.toLowerCase() === 'password') {
      this.serviceDetail[index].displayed = !this.serviceDetail[index].displayed;
    }
    this.getCDLabel.emit(this.serviceDetail[index].Label + 'Index&&' + index.toString());
  }

  processNavigation(event, type) {
    if (this.availableCall) {
      const value = event.split('Index&&')[2];
      const title = event.split('Index&&')[0];
      const NavigationPath = event.split('Index&&')[3];
      switch (NavigationPath) {
        case '/Services/Notes':
          this.componentTitle = title;
          this.goToServiceNotes();
          break;
        case '/Services/Terminations/Terminate':
          this.componentTitle = title;
          this.goToMenuItem('service-termination');
          break;
        case '/Services/EnquiryPassword':
          this.componentTitle = title;
          this.goToMenuItem('Services/EnquiryPassword');
          break;
        case '/Services/Plans/PlanHistory':
          this.componentTitle = title;
          this.goToMenuItem('Services/Plans/PlanHistory');
          break;
        case '/Services/Events/New':
          this.componentTitle = '';
          this.goToMenuItem('/Services/Events/New');
          break;
        case '/Services/Plans/New':
          this.componentTitle = title;
          this.goToMenuItem('Services/Plans/New');
          break;
        case '/Services/Plans/PlanChange':
          this.componentTitle = title;
          this.goToMenuItem('Services/Plans/PlanChange');
          break;
        case '/Services/Configurations/PlanChanges':
          this.componentTitle = title;
          this.goToMenuItem('Services/Configurations/PlanChanges');
          break;
        case '/Services/Configurations/Terminations':
          this.componentTitle = title;
          this.goToMenuItem('Services/Configurations/Terminations');
          break;
        case '/Services/Suspensions/New':
          this.componentTitle = title;
          this.goToMenuItem('/Services/Suspensions/New');
          break;
        case '/Services/Addresses':
          this.componentTitle = title;
          this.goToMenuItem('/Services/Addresses');
          break;
        case '/Services/Novations':
          this.componentTitle = title;
          this.goToMenuItem('/Services/Novations');
          break;
        case '/Charges/ServiceCharges/New':
          this.componentTitle = '';
          this.goToMenuItem('/Charges/ServiceCharges/New');
          break;
        case '/Charges/ServiceOverrides/New':
          this.componentTitle = '';
          this.goToMenuItem('/Charges/ServiceOverrides/New');
        default:
          if (type !== 'menu') {
            this.getCDLabel.emit(event);
          }
          break;
      }
    }
  }

  goToServiceNotes() {
    this.ServiceType = 'ServiceNotes';
  }

  processAttributeMenu(event) {
    if (event?.type === 'close' || event?.type === 'planHistory' || event === 'close') {
      this.closeComponent();
    } else if (event?.type === 'password') {
      this.getServiceDetail();
    }
  }

  closeComponent() {
    this.componentTitle = 'notes';
    this.ServiceType = 'ServiceNotes';
  }

  goToMenuItem(type) {
    this.ServiceType = type;
  }

}
