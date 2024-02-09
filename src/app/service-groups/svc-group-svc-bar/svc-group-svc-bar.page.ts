import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServiceGroupServiceBarService } from './services/svc-group-svc-bar.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ConfigureResourceService } from 'src/services/configure-resource.service';
import { ConfigurationItem, ServiceGroupBar, ServiceGroupBarReason, } from 'src/app/model';
import { ActivatedRoute } from '@angular/router';

import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-svc-group-svc-bar',
  templateUrl: './svc-group-svc-bar.page.html',
  styleUrls: ['./svc-group-svc-bar.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SvcGroupSvcBarPage implements OnInit {

  pageTitle: string = '';
  


  barForm: UntypedFormGroup;

  barTypeList: Array<ServiceGroupBar> = [];

  barReasonList: Array<ServiceGroupBarReason> = [];

  all: boolean = false;
  children: boolean = false;
  sameServiceType: boolean = false;
  sibiling: boolean = false;
  cNEvent: boolean = false;
  unBarState: boolean = false;

  configState = false;

  barData = {
    BarType: '',
    BarReason: '',
    DateToBarService: '',
    DateFromBarService: '',
    note: ''
  };

  serviceGroupId: string = '';
  serviceGroupName: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGSBService: ServiceGroupServiceBarService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private resourceConf: ConfigureResourceService,
    private route: ActivatedRoute,
    private alert: AlertService,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();
    this.tranService.convertText('service_group_service_bar').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.serviceGroupId = this.route.snapshot.params['Id'];
    this.serviceGroupName = this.route.snapshot.params['Name'];

    this.barForm = this.formBuilder.group({
      BarType: ['', Validators.required],
      BarReason: ['', Validators.required],
      DateToBarService: ['', Validators.required],
      DateFromBarService: ['', Validators.required],
      note: ['']
    });

    this.barForm.get('BarReason').disable();
    this.setBarOptions();

  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  setBarOptions() {

    this.resourceConf.getConfResource('BAR_SHOW_BULK_OPTIONS').subscribe((result: ConfigurationItem[]) => {
      
      if (result === null) {
        this.configState = false;
      } else {
        if (result[0].Key === 'BAR_SHOW_BULK_OPTIONS' && result[0].Value === 'YES') {
          this.configState = true;
        } else {
          this.configState = false;
        }
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });

  }

  unBarStateChange() {

    if (this.unBarState) {
      this.barForm.get('DateFromBarService').enable();
    } else {
      this.barForm.get('DateFromBarService').disable();
    }
  }

  ngOnInit() {
    this.unBarStateChange();
    this.getBarTypeList();
  }

  async getBarTypeList() {
    this.barTypeList = [];
    await this.loading.present();
    this.sGSBService.BarTypeList(this.serviceGroupId).subscribe(async (result: ServiceGroupBar[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
        this.tranService.errorMessage('no_bar_types');
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
            this.navCtrl.pop();
          });
        } else {
          this.tranService.errorMessage(error);
        }
      }
    });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  async selectBarType(index) {
    this.barForm.get('BarReason').enable();
    this.barReasonList = [];
    await this.loading.present();
    this.sGSBService.BarReasonList(this.barTypeList[index].Id).subscribe(async (result: ServiceGroupBarReason[]) => {
      
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

  async barSubmit() {
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

  goBack() {
    this.navCtrl.pop();
  }

}
