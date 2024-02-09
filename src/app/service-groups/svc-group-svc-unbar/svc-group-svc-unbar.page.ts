import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServiceGroupServiceUnBarService } from './services/svc-group-svc-unbar.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfigureResourceService } from 'src/services/configure-resource.service';
import { ActivatedRoute } from '@angular/router';

import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ConfigurationItem, ServiceGroupBar, ServiceGroupBarReason } from 'src/app/model';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-svc-group-svc-unbar',
  templateUrl: './svc-group-svc-unbar.page.html',
  styleUrls: ['./svc-group-svc-unbar.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SvcGroupSvcUnbarPage implements OnInit {

  pageTitle: string = '';
  

  noteData: string = '';

  barForm: UntypedFormGroup;



  barTypeList: Array<ServiceGroupBar> = [];

  barReasonList: Array<ServiceGroupBarReason> = [];

  all: boolean = false;
  children: boolean = false;
  sameServiceType: boolean = false;
  sibiling: boolean = false;
  cNEvent: boolean = false;
  unBarState: boolean = false;

  configState: boolean = false;

  serviceGroupId: string = '';
  serviceGroupName: string = '';

  barData = {
    BarType: '',
    BarReason: '',
    DateToBarService: '',
    DateFromBarService: '',
    note: ''
  };


  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGSUBService: ServiceGroupServiceUnBarService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private resourceConf: ConfigureResourceService,
    private route: ActivatedRoute,
    private alert: AlertService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('service_group_service_unbar').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.serviceGroupId = this.route.snapshot.params['Id'];
    this.serviceGroupName = this.route.snapshot.params['Name'];

    this.barForm = this.formBuilder.group({
      BarType: ['', Validators.required],
      BarReason: ['', Validators.required],
      DateToBarService: ['', Validators.required],
      DateFromBarService: [''],
      note: ['']
    });

    this.resourceConf.getConfResource('UNBAR_SHOW_BULK_OPTIONS').subscribe((result: ConfigurationItem[]) => {
      
      if (result === null) {
        this.configState = true;
      } else {
        if (result[0].Key === 'UNBAR_SHOW_BULK_OPTIONS' && result[0].Value === 'NO') {
          this.configState = false;
        } else {
          this.configState = true;
        }
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }


  ngOnInit() {
    this.unBarStateChange();
    this.ServiceUnBarTypeDisplayList();
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  async ServiceUnBarTypeDisplayList() {
    this.barTypeList = [];
    await this.loading.present();
    this.sGSUBService.ServiceUnBarTypeDisplayList(this.serviceGroupId).subscribe(async (result: ServiceGroupBar[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
        setTimeout(() => {
          this.goBack();
        }, 3000);
      } else {
        this.barTypeList = result;
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      if (typeof (error.error) !== 'undefined') {
        if (error.error.ErrorCode === 500 && error.error.ErrorMessage.includes('No services')) {
          this.tranService.convertText('s_d_h_a_s_t_b_a_t_moment').subscribe(result => {
            this.tranService.convertText('oops').subscribe(title => {
              this.alert.presentAlert(title, result);
            });
            setTimeout(() => {
              this.goBack();
            }, 3000);
          });
        } else {
          this.tranService.errorMessage(error);
        }
      }
    });
  }

  async selectBarType(index) {
    this.barForm.get('BarReason').enable();
    this.barReasonList = [];
    await this.loading.present();
    this.sGSUBService.BarReasonList(this.barTypeList[index].Id).subscribe(async (result: ServiceGroupBarReason[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
        this.tranService.errorMessage('no_bar_reasons');
      } else {
        this.barReasonList = result;
      }

    },async  (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  UnBarSubmit() {
    if (this.barForm.valid) {
      this.barData.BarType = this.barForm.controls.BarType.value;
      this.barData.BarReason = this.barForm.controls.BarReason.value;
      let temDateFromBarService = this.barForm.controls.DateToBarService.value;
      this.barData.DateToBarService = temDateFromBarService.toISOString().split('T')[0];
      if (this.unBarState) {
        let temDateToBarService = this.barForm.controls.DateFromBarService.value
        this.barData.DateFromBarService = temDateToBarService.toISOString().split('T')[0];
      } else {
        this.barData.DateFromBarService = new Date().toISOString().split('T')[0];
      }
    }
  }

  unBarStateChange() {

    if (this.unBarState) {
      this.barForm.get('DateFromBarService').enable();
    } else {
      this.barForm.get('DateFromBarService').disable();
    }
  }

}
