import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServiceTypeChangeService } from './services/service-type.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-service-type-change',
  templateUrl: './service-type-change.page.html',
  styleUrls: ['./service-type-change.page.scss'],
})
export class ServiceTypeChangePage implements OnInit {

  pageTitle: string = '';

  

  serviceForm: UntypedFormGroup;
  serviceTypeList = [
    {
      'text': 'elders_dsl_service',
      'value': '',
    }
  ];
  debitRunId: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sTCService: ServiceTypeChangeService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('change_service_type').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.serviceForm = this.formBuilder.group({
      ServiceType: ['', Validators.required],
      Note: ['']
    });
    for (const list of this.serviceTypeList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  changeServiceType() {

  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.navCtrl.pop();
  }

}
