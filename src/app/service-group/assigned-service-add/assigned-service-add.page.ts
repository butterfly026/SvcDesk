import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ServiceGroup, ServiceGroupItem } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import * as moment from 'moment';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { AssignedServiceAddService } from './services/assigned-service-add.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-assigned-service-add',
  templateUrl: './assigned-service-add.page.html',
  styleUrls: ['./assigned-service-add.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AssignedServiceAddPage implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ServiceId: string = '';
  @Output('AssignedServiceAddComponent') AssignedServiceAddComponent: EventEmitter<string> = new EventEmitter<string>();

  groupList: Array<ServiceGroup> = [];
  assignList: Array<ServiceGroupItem> = [];
  

  serviceForm: UntypedFormGroup;

  minDate: Date = new Date();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private serviceGroupService: AssignedServiceAddService,
    private formBuilder: UntypedFormBuilder,
    private convertService: ConvertDateFormatService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    

    this.serviceForm = this.formBuilder.group({
      ServiceGroup: ['', Validators.required],
      StartDate: ['', Validators.required]
    });
    this.serviceForm.controls.StartDate.setValue(new Date());
  }

  ngOnInit() {
    // this.getServiceGroupList();
    this.getAssignedServiceGrouptList();
  }

  async getServiceGroupList() {
    this.groupList = [];
    await this.loading.present();
    this.serviceGroupService.ServiceGroupListContactCode(this.ContactCode).subscribe(async (result: ServiceGroup[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
      } else {
        for (const list of result) {
          if (this.checkCancelledDate(new Date(list.CancelledDatetime))) {
            let availPush = true;
            for (let assignlist of this.assignList) {
              if (list.Id.toString() === assignlist.ServiceGroupId.toString()) {
                availPush = false;
              }
            }
            if (availPush) {
              this.groupList.push(list);
            }
          }
        }
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getAssignedServiceGrouptList() {

    this.assignList = [];
    await this.loading.present();
    this.serviceGroupService.ServiceAssignedServiceGroups(this.ServiceId).subscribe(async (result: ServiceGroupItem[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
      } else {
        for (const list of result) {
          if (this.checkCancelledDate(new Date(list.EndDateTime))) {
            this.assignList.push(list);
          }
        }
      }

      this.getServiceGroupList();

    }, async (error: any) => {
      await this.loading.dismiss();
      this.getServiceGroupList();
      
      this.tranService.errorMessage(error);
    });
  }

  checkCancelledDate(date: Date) {
    const cancelDate = date.getTime();
    const currentDate = new Date().getTime();
    if (cancelDate > currentDate) {
      return true;
    } else {
      return false;
    }
  }

  async submitForm() {
    let currentDate = new Date(this.serviceForm.controls.StartDate.value);
    // currentDate.setDate(currentDate.getDate() + 1);
    let convertedDate = currentDate.toISOString();

    let reqParam = {
      serviceGroupId: this.serviceForm.controls.ServiceGroup.value,
      serviceId: this.ServiceId,
      startDateTime: convertedDate
    }
    await this.loading.present();
    this.serviceGroupService.ServiceGroupAssignService(reqParam).subscribe(async (result: any) => {
      
      await this.loading.dismiss();

      this.AssignedServiceAddComponent.emit('close');

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.AssignedServiceAddComponent.emit('close');
  }

}
