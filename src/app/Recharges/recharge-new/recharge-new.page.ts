import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { RechargeNewService } from './services/recharge-new.service';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { RechargeListItem, ErrorItems } from 'src/app/model';
import { jqxCheckBoxComponent } from 'jqwidgets-ng/jqxcheckbox';

import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-recharge-new',
  templateUrl: './recharge-new.page.html',
  styleUrls: ['./recharge-new.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class RechargeNewPage implements OnInit {
  @ViewChild('default') default: jqxCheckBoxComponent;
  @ViewChild('useThis') useThis: jqxCheckBoxComponent;

  pageTitle: string = '';

  

  newRechargeForm: UntypedFormGroup;
  typeList: Array<string> = ['Laser Treatment', 'Test Type 1', 'Test Type 2'];
  voucherList: Array<string> = ['20 Procedure credits', '10 Procedure credits'];
  startDate: string;
  expireDate: string;
  expireState: boolean = false;
  expireValue: string = '';
  pinText: string = '';

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private rNewService: RechargeNewService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('add_voucher').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.newRechargeForm = this.formBuilder.group({
      type: ['', Validators.required],
      voucher: ['', Validators.required],
      amount: ['', Validators.required],
      start: ['', Validators.required]
    });
    this.startDate = new Date().toISOString();
    this.expireDate = new Date().toISOString();
    this.expireValue = 'default';
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  goBack() {
    this.navCtrl.pop();
  }

  async newRecharge() {
    const param = {
      'type': this.newRechargeForm.controls['type'].value,
      'voucher': this.newRechargeForm.controls['voucher'].value,
      'amount': this.newRechargeForm.controls['amount'].value,
      'start': this.newRechargeForm.controls['start'].value,
      'expireDate': '',
    };
    if (this.expireValue === 'custom') {
      param.expireDate = '26/10/2019';
    } else {
      param.expireDate = this.expireDate;
    }
    await this.loading.present();
    this.rNewService.addNewRecharge(param).subscribe(async (result: RechargeListItem[]) => {
      
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  expireChange() {
    if (this.expireValue === 'custom') {
      this.expireState = true;
    } else {
      this.expireState = false;
    }
  }

}
