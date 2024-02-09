import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpendNotificationConfigrationService } from './services/spend-notification-config.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-spend-notification-configration',
  templateUrl: './spend-notification-configuration.page.html',
  styleUrls: ['./spend-notification-configuration.page.scss'],
})
export class SpendNotificationConfigurationPage implements OnInit {

  pageTitle: string = '';
  

  configSource: string = 'system_default';
  enableAlert: boolean = true;
  emailState: boolean = true;
  smsState: boolean = true;

  userInfo: any;

  NotForm: UntypedFormGroup;

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sNCService: SpendNotificationConfigrationService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('spend_notification_configration').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.NotForm = this.formBuilder.group({
      FirstAlert: ['', Validators.required],
      SecondAlert: [''],
      ThirdAlert: [''],
      FourthAlert: [''],
      FifthAlert: ['']
    });
  }

  async ngOnInit() {
    await this.loading.present();
    this.sNCService.getUserInfo().subscribe(async (result: any) => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_notification_configuration');
      } else {
        this.userInfo = result;
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });

  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.navCtrl.pop();
  }

  notSubmit() {

  }

}
