import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';


import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceGroupAssignAddService } from './services/service-group-assign-add.service';

@Component({
  selector: 'app-svc-group-assign-svc-add',
  templateUrl: './svc-group-assign-svc-add.page.html',
  styleUrls: ['./svc-group-assign-svc-add.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SvcGroupAssignSvcAddPage implements OnInit {

  pageTitle: string = '';
  

  ServiceGroupId: string = '';

  serviceForm: UntypedFormGroup;

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGService: ServiceGroupAssignAddService,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('service_group_service_add').subscribe(value => {
      this.pageTitle = value;
    });

    this.ServiceGroupId = this.route.snapshot.params['Id'];
    
    this.serviceForm = this.formBuilder.group({
      ServiceId: ['', Validators.required],
      StartDateTime: ['', Validators.required]
    });
    this.serviceForm.controls.StartDateTime.setValue(new Date());
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async serviceAddSubmit() {
    if (this.serviceForm.valid) {
      await this.loading.present();
      const reqParam = {
        serviceGroupId: this.ServiceGroupId,
        serviceId: this.serviceForm.controls.ServiceId.value,
        startDateTime: new Date(this.serviceForm.controls.StartDateTime.value).toISOString()
      }
      this.sGService.ServiceGroupAssignService(reqParam).subscribe(async (result: any) => {
        
        await this.loading.dismiss();

        if (result === null) {
        } else {

        }

      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.navCtrl.pop();
  }

}
