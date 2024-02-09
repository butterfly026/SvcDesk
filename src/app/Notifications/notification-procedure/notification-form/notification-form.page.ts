import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { NotificationProcedureService } from '../services/notificatio-procedure.service';

import { ActivatedRoute } from '@angular/router';
import { NotificationConfigration } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.page.html',
  styleUrls: ['./notification-form.page.scss'],
})
export class NotificationFormPage implements OnInit {

  // @Input() UserInfo: NotificationConfigration = {
  //   Id: 0,
  //   ContactCode: '',
  //   ContactName: '',
  //   ServiceReference: '',
  //   ServiceNumber: '',
  //   RechargeTypeId: '',
  //   RechargeType: '',
  //   RechargeElementId: 0,
  //   RechargeElement: '',
  //   MinimumQuantity: 0,
  //   MinimumValue: 0,
  //   Active: false,
  //   ContactEmail: '',
  //   ContactMobile: '',
  //   CreatedBy: '',
  //   CreatedDateTime: '',
  //   LastUpdatedBy: '',
  //   LastUpdatedDateTime: ''
  // };

  enableNotification: boolean = false;

  notForm: UntypedFormGroup;
  

  deviceList = ['1001', '1002', '1003', '1004', '1005'];
  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private nPService: NotificationProcedureService,
    
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.notForm = this.formBuilder.group({
      device: ['', Validators.required],
      proThre: ['', [
        Validators.required,
        Validators.min(0)]],
      email: ['', [
        Validators.required,
        Validators.email]
      ],
      mobile: ['', [
        Validators.required,
        Validators.pattern('[0-9]{5,}')]
      ],
    });
    
  }

  ngOnInit() {
  }

  get f() {
    return this.notForm.controls;
  }

  checkSaveState() {
    const currentPre = this.notForm.controls.proThre.value;
    const currentEmail = this.notForm.controls.email.value;
    const currentMobile = this.notForm.controls.mobile.value;

    // if (this.userInfo.ProcedureThreshold !== currentPre || this.userInfo.Email !== currentEmail
    //   || this.userInfo.Mobile !== currentMobile || this.notForm.controls.device.value !== '') {
    //   this.enableNotification = true;
    // } else {
    //   this.enableNotification = false;
    // }

  }

  submitTrigger() {
    this.navCtrl.pop();
  }

  goBack() {
    this.navCtrl.pop();
  }

  notSubmit() {

  }

}
