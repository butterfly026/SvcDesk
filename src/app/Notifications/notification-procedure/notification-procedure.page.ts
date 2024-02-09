import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationProcedureService } from './services/notificatio-procedure.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { DeviceListItem, NotificationConfigration, RechargeNotification } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-notification-procedure',
  templateUrl: './notification-procedure.page.html',
  styleUrls: ['./notification-procedure.page.scss'],
})
export class NotificationProcedurePage implements OnInit {

  pageTitle: string = '';

  
  debitRunId: string = '';

  userInfo: any;
  enableNotification: boolean = false;
  enableDelete: boolean = false;
  openNotification: boolean = false;
  enableContact: boolean = false;

  notForm: UntypedFormGroup;

  deviceList: Array<DeviceListItem> = [];
  notificationList: Array<NotificationConfigration> = [];
  NotDetail: NotificationConfigration = {
    Id: 0,
    ContactCode: '',
    ContactName: '',
    ServiceReference: '',
    ServiceNumber: '',
    RechargeTypeId: '',
    RechargeType: '',
    RechargeElementId: 0,
    RechargeElement: '',
    MinimumQuantity: 0,
    MinimumValue: 0,
    Active: false,
    ContactEmail: '',
    ContactMobile: '',
    CreatedBy: '',
    CreatedDateTime: '',
    LastUpdatedBy: '',
    LastUpdatedDateTime: '',
    RechargeElements: [{
      Id: '',
      MinimumQuantity: 0,
      RechargeElement: '',
      RechargeElementId: 0
    }]
  };

  currentDeviceId: string = '';
  thresholdList: Array<number> = [];
  availSubmit: boolean = true;

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private nPService: NotificationProcedureService,
    
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private toast: ToastService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('notification_procedure').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.notForm = this.formBuilder.group({
      device: ['', Validators.required],
      proThre: ['', [
        Validators.required]],
      // email: ['', [
      //   Validators.required,
      //   Validators.email]
      // ],
      // mobile: ['', [
      //   // Validators.required,
      //   Validators.pattern('[0-9]{5,}')]
      // ],
    });
    this.getDeviceList();
    for (let i = 1; i < 101; i++) {
      this.thresholdList.push(i);
    }
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async getNotificationDetail() {
    this.enableDelete = false;
    this.enableContact = false;

    this.notForm.controls.proThre.reset();
    // this.notForm.controls.email.reset();

    await this.loading.present();
    this.nPService.NotificationConfiguration(this.currentDeviceId).subscribe(async (result: NotificationConfigration[]) => {
      
      if (result === null) {
        await this.loading.dismiss();
        // this.notForm.controls.proThre.reset();
        // this.notForm.controls.email.reset();
        // this.notForm.controls.mobile.reset();
        this.enableDelete = false;
        this.openNotification = false;
        this.enableContact = false;
      } else {
        await this.loading.dismiss();
        this.notificationList = result;
        this.NotDetail = this.notificationList[0];
        this.openNotification = this.NotDetail.Active;
        this.enableDelete = true;
        this.enableContact = true;
        this.notForm.controls.proThre.setValue((this.NotDetail.RechargeElements[0].MinimumQuantity).toString());
        // this.notForm.controls.email.setValue((this.NotDetail.ContactEmail));
        // this.notForm.controls.mobile.setValue((this.NotDetail.ContactMobile));
        this.checkSaveState();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getDeviceList() {

    this.notForm.reset();
    await this.loading.present();
    this.nPService.getDeviceList().subscribe(async (result: DeviceListItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_devices');
      } else {
        this.deviceList = result;
        this.currentDeviceId = this.deviceList[0].ServiceReference.toString();
        this.notForm.controls.device.setValue(this.currentDeviceId);
        this.getNotificationDetail();

      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });

  }

  get f() {
    return this.notForm.controls;
  }

  checkSaveState() {
    const currentPre = this.notForm.controls.proThre.value;
    // const currentEmail = this.notForm.controls.email.value;
    // const currentMobile = this.notForm.controls.mobile.value;

    this.enableContact = false;

    if (this.enableDelete) {
      if (this.NotDetail.RechargeElements[0].MinimumQuantity !== parseInt(currentPre)
        // || (this.NotDetail.ContactEmail !== currentEmail
        // || (this.NotDetail.ContactMobile !== currentMobile && currentMobile !== null && currentMobile !== '')
      ) {
        this.enableNotification = true;
      } else {
        this.enableNotification = false;
      }


      if (this.notForm.valid && this.enableNotification) {
        this.enableContact = true;
      } else {
        this.enableContact = false;
      }
    } else {
      if (this.notForm.valid) {
        this.enableContact = true;
      } else {
        this.enableContact = false;
      }
    }

    // if (!this.notForm.controls.mobile.hasError('pattern') && this.notForm.controls.mobile.value !== '' && this.notForm.controls.mobile.value !== null) {
    //   this.enableContact = true;
    //   if (this.notForm.controls.email.value !== '' && this.notForm.controls.email.value !== null) {
    //     if (this.notForm.controls.email.hasError('email')) {
    //       this.enableContact = false;
    //     }
    //   }
    // }

    // if (!this.notForm.controls.email.hasError('email') && this.notForm.controls.email.value !== '' && this.notForm.controls.email.value !== null) {
    //   this.enableContact = true;
    //   if (this.notForm.controls.mobile.value !== '' && this.notForm.controls.mobile.value !== null) {
    //     if (this.notForm.controls.mobile.hasError('pattern')) {
    //       this.enableContact = false;
    //     }
    //   }
    // }

    // if (this.notForm.valid && this.enableContact) {
    //   this.enableContact = true;
    // } else {
    //   this.enableContact = false;
    // }

    // if (this.enableContact && this.enableNotification) {
    //   this.enableContact = true;
    // } else {
    //   this.enableContact = false;
    // }
  }

  ngOnInit() {
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.navCtrl.pop();
  }

  async notSubmit() {
    if (this.enableDelete) {
      let updateParam = {
        Id: this.NotDetail.Id,
        RechargeElements: [
          {
            RechargeElementId: 1,
            MinimumQuantity: this.notForm.controls.proThre.value
          }
        ],
        // ContactEmail: this.notForm.controls.email.value,
        // ContactMobile: this.notForm.controls.mobile.value,
      }

      if (this.availSubmit) {
        this.availSubmit = false;
        await this.loading.present();
        this.nPService.NotificationConfigurationUpdate(updateParam).subscribe(async (result: any) => {
          await this.loading.dismiss();
          
          this.tranService.convertText('notification_update').subscribe(result => {
            this.toast.present(result);
            setTimeout(() => {
              this.navCtrl.pop();
            }, 3000);
          });
        }, async (error: any) => {
          await this.loading.dismiss();
          
          this.tranService.errorMessage(error);
        });
      }

    } else {

      let addParam = {
        ServiceReference: parseInt(this.notForm.controls.device.value),
        RechargeElements: [
          {
            RechargeElementId: 1,
            MinimumQuantity: this.notForm.controls.proThre.value
          }
        ],
        // ContactEmail: this.notForm.controls.email.value,
        // ContactMobile: this.notForm.controls.mobile.value,
      }

      if (this.availSubmit) {
        this.availSubmit = false;
        await this.loading.present();
        this.nPService.NotificationConfigurationAdd(addParam).subscribe(async (result: any) => {
          await this.loading.dismiss();
          
          this.tranService.convertText('notification_save').subscribe(result => {
            this.toast.present(result);
            setTimeout(() => {
              this.navCtrl.pop();
            }, 3000);
          });
        }, async (error: any) => {
          await this.loading.dismiss();
          
          this.tranService.errorMessage(error);
        });
      }
    }
  }

  selectDevice(index) {
    this.currentDeviceId = this.deviceList[index].ServiceReference.toString();
    this.getNotificationDetail();
  }

  async deleteNotification() {
    if (this.availSubmit) {
      this.availSubmit = false;
      await this.loading.present();
      this.nPService.NotificationConfigurationDelete(this.NotDetail.Id).subscribe(async (result: any) => {
        await this.loading.dismiss();
        
        this.tranService.convertText('notification_delete').subscribe(result => {
          this.toast.present(result);
          setTimeout(() => {
            this.navCtrl.pop();
          }, 3000);
        });
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  async updateNotificationStatus() {
    if (this.enableDelete) {
      let reqParam = {
        "Id": this.NotDetail.Id,
        "Active": !this.openNotification
      }

      await this.loading.present();
      this.nPService.NotificationConfigurationStatusUpdate(reqParam).subscribe(async (result: any) => {
        await this.loading.dismiss();
        
        // this.tranService.convertText('notification_delete').subscribe(result => {
        //   this.toast.present(result);
        //   setTimeout(() => {
        //     this.navCtrl.pop();
        //   }, 3000);
        // });
        if (!this.openNotification) {
          this.tranService.convertText('notification_disable').subscribe(result => {
            this.toast.present(result);
            setTimeout(() => {
              this.navCtrl.pop();
            }, 3000);
          });
        } else {
          this.tranService.convertText('notification_enable').subscribe(result => {
            this.toast.present(result);
            setTimeout(() => {
              this.navCtrl.pop();
            }, 3000);
          });
        }
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

}
