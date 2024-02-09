import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { AccountServiceGroupUnbarService } from './services/account-service-group-unbar.service';

import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';

import { ConfigureResourceService } from 'src/services/configure-resource.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationItem, ServiceGroupBar, ServiceGroupBarReason } from 'src/app/model';
import { AlertService } from 'src/services/alert-service.service';

import * as moment from 'moment';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-account-service-group-unbar',
  templateUrl: './account-service-group-unbar.page.html',
  styleUrls: ['./account-service-group-unbar.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AccountServiceGroupUnbarPage implements OnInit {

  @Input() ServiceGroupId: string = '';
  @Input() ServiceGroupName: string = '';
  @Output('AccountServiceGroupUnbar') AccountServiceGroupUnbar: EventEmitter<string> = new EventEmitter<string>();

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

  barData = {
    BarType: '',
    BarReason: '',
    DateToBarService: '',
    DateFromBarService: '',
    note: ''
  };

  currentDate = new Date();
  reversalMinDate = new Date();


  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGSUBService: AccountServiceGroupUnbarService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private resourceConf: ConfigureResourceService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private toast: ToastService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('service_group_service_unbar').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.barForm = this.formBuilder.group({
      BarType: ['', Validators.required],
      BarReason: [''],
      // BarReason: ['', Validators.required],
      DateToBarService: ['', Validators.required],
      DateFromBarService: [''],
      note: ['']
    });

    this.barForm.get('BarReason').disable();

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
    this.AccountServiceGroupUnbar.emit('setMinHeight');
  }

  ngOnInit() {
    this.unBarStateChange();
    this.ServiceUnBarTypeDisplayList();
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  async ServiceUnBarTypeDisplayList() {
    setTimeout(() => {
      this.AccountServiceGroupUnbar.emit('setMinHeight');
    }, 2000);
    this.barTypeList = [];
    await this.loading.present();
    this.sGSUBService.ServiceUnBarTypeDisplayList(this.ServiceGroupId).subscribe(async (result: ServiceGroupBar[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
        this.tranService.errorMessage('no_unbar_types');
      } else {
        this.barTypeList = result;
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      if (typeof (error.error) !== 'undefined') {
        if (error.error.ErrorCode === 500 && error.error.ErrorMessage.includes('No services')) {
          this.tranService.convertText('s_d_h_a_s_t_b_a_t_moment').subscribe(result => {
            // this.alert.presentAlert(result);
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

  selectBarType(index) {
  }

  goBack() {
    // this.navCtrl.pop();
    this.AccountServiceGroupUnbar.emit('closeServices');
  }

  async UnBarSubmit() {
    if (this.barForm.valid) {
      await this.loading.present();
      let effectDate = this.barForm.controls.DateToBarService.value;
      let reqParam;
      // moment(convertedDate).format('YYYY-MM-DD') + ' ' + moment(currentDate).format('HH:mm:ss')
      if (this.unBarState) {
        let temDateToBarService = this.barForm.controls.DateFromBarService.value;
        reqParam = {
          ServiceGroupId: this.ServiceGroupId,
          BarTypeId: this.barForm.controls.BarType.value,
          // BarReasonId: this.barForm.controls.BarReason.value,
          EffectiveDateTime: moment(effectDate).format('YYYY-MM-DD') + ' ' + moment(effectDate).format('HH:mm:ss'),
          // ReversaleDateTime: '',
          Note: this.barForm.controls.note.value,
        }
        reqParam.ReversaleDateTime = moment(temDateToBarService).format('YYYY-MM-DD') + ' ' + moment(temDateToBarService).format('HH:mm:ss');
      } else {
        this.barData.DateFromBarService = new Date().toISOString().split('T')[0];
        reqParam = {
          ServiceGroupId: this.ServiceGroupId,
          BarTypeId: this.barForm.controls.BarType.value,
          // BarReasonId: this.barForm.controls.BarReason.value,
          EffectiveDateTime: moment(effectDate).format('YYYY-MM-DD') + ' ' + moment(effectDate).format('HH:mm:ss'),
          Note: this.barForm.controls.note.value,
        }
      }
      if (this.unBarState) {
        let temDateToBarService = this.barForm.controls.DateFromBarService.value;
        reqParam.ReversaleDateTime = moment(temDateToBarService).format('YYYY-MM-DD') + ' ' + moment(temDateToBarService).format('HH:mm:ss');
      } else {
        this.barData.DateFromBarService = new Date().toISOString().split('T')[0];
        reqParam.ReversaleDateTime = moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss');
      }
      this.sGSUBService.ServiceGroupServiceBar(reqParam).subscribe(async (result: any) => {
        
        await this.loading.dismiss();
        this.tranService.convertText('unbar_success_message').subscribe(result => {
          // this.alert.presentAlert(result);

          this.toast.present(result);

          setTimeout(() => {
            this.AccountServiceGroupUnbar.emit('closeServices');
          }, 1000);
        });
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  unBarStateChange() {

    if (this.unBarState) {
      this.barForm.get('DateFromBarService').enable();
    } else {
      this.barForm.get('DateFromBarService').disable();
    }
  }

  changeStartDate() {
    let startDate = new Date(this.barForm.controls.DateToBarService.value.toString());
    startDate.setDate(startDate.getDate() + 1);
    this.reversalMinDate = startDate;
  }

}
