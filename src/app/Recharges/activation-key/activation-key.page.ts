import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivationKeyService } from './services/activation-key.service';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RechargeSimpleNewItem, ErrorItems } from 'src/app/model';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-activation-key',
  templateUrl: './activation-key.page.html',
  styleUrls: ['./activation-key.page.scss'],
})
export class ActivationKeyPage implements OnInit {

  pageTitle: string = '';
  

  newActForm: UntypedFormGroup;
  actKey: string = '';

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private actKeyService: ActivationKeyService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    public globService: GlobalService,
  ) {
    
    this.tranService.translaterService();
    this.tranService.convertText('voucher_code').subscribe(value => {
      this.pageTitle = value;
    });


    this.actKey = this.route.snapshot.params['key'];

    this.newActForm = this.formBuilder.group({
      actKey: ['', Validators.required]
    });
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
    await this.loading.present();
    this.actKeyService.checkActivationKey().subscribe(async (result: string) => {
      
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

}
