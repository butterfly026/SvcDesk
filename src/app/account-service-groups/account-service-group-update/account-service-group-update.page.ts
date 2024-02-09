import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ServiceGroup, ServiceGroupStatus } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { AccountServiceGroupService } from '../services/account-service-group.service';
import { AccountServiceGroupUpdateService } from './services/account-service-group-update.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-account-service-group-update',
  templateUrl: './account-service-group-update.page.html',
  styleUrls: ['./account-service-group-update.page.scss'],
})
export class AccountServiceGroupUpdatePage implements OnInit {

  @Input() ServiceId: string = '';
  @Output('AccountServiceGroupUpdate') AccountServiceGroupUpdate: EventEmitter<string> = new EventEmitter<string>();
  pageTitle: string = '';
  

  groupForm: UntypedFormGroup;

  groupList: Array<ServiceGroup> = [];
  currentSG: ServiceGroup = {
    Id: 0,
    ParentId: 0,
    Code: '',
    Name: '',
    ContactCode: '',
    AdditionalInformation1: '',
    AdditionalInformation2: '',
    AdditionalInformation3: '',
    CancelledDatetime: '',
    GeneralLedgerCode: '',
    StatusId: 0,
    Status: '',
    StatusDateTime: '',
    Email: '',
    Created: '',
    CreatedBy: '',
    LastUpdated: '',
    UpdatedBy: ''
  };

  groupStatusList: Array<ServiceGroupStatus> = []

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGService: AccountServiceGroupUpdateService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private convertService: ConvertDateFormatService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('service_group_update').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.groupForm = this.formBuilder.group({
      Id: ['', Validators.required],
      ParentId: [''],
      ContactCode: [''],
      CancelledDateTime: [''],
      GeneralLedgerCode: [''],
      StatusId: [''],
      Status: [''],
      StatusDateTime: [''],
      Created: [''],
      CreatedBy: [''],
      LastUpdated: [''],
      UpdatedBy: [''],
      Name: ['', Validators.required],
      Code: [''],
      AdditionalInformation1: [''],
      AdditionalInformation2: [''],
      AdditionalInformation3: [''],
      Email: ['']
    });
  }

  async getServiceDetail() {
    this.groupList = [];

    await this.loading.present();
    this.sGService.GetServiceGroupListGroupId(this.ServiceId).subscribe(async (result: ServiceGroup) => {
      

      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_service_group_detail');
      } else {
        // this.currentSG.Id = result.Id;
        this.groupForm.controls.Id.setValue(result.Id);
        this.groupForm.controls.ParentId.setValue(result.ParentId);
        this.groupForm.controls.Name.setValue(result.Name);
        this.groupForm.controls.Code.setValue(result.Code);
        this.groupForm.controls.ContactCode.setValue(result.ContactCode);
        this.groupForm.controls.CancelledDateTime.setValue(moment(result.CancelledDatetime).format(this.convertService.getLocalDateFormat() + ' HH:mm'));
        this.groupForm.controls.CancelledDateTime.setValue(result.CancelledDatetime);
        this.groupForm.controls.GeneralLedgerCode.setValue(result.GeneralLedgerCode);
        this.groupForm.controls.StatusId.setValue(result.StatusId);
        this.groupForm.controls.Status.setValue(result.StatusId.toString());
        this.groupForm.controls.StatusDateTime.setValue(moment(result.StatusDateTime).format(this.convertService.getLocalDateFormat() + ' HH:mm'));
        this.groupForm.controls.StatusDateTime.setValue(result.StatusDateTime);
        this.groupForm.controls.Email.setValue(result.Email);
        this.groupForm.controls.Created.setValue(result.Created);
        this.groupForm.controls.CreatedBy.setValue(result.CreatedBy);
        this.groupForm.controls.LastUpdated.setValue(result.LastUpdated);
        this.groupForm.controls.UpdatedBy.setValue(result.UpdatedBy);
        this.groupForm.controls.AdditionalInformation1.setValue(result.AdditionalInformation1);
        this.groupForm.controls.AdditionalInformation2.setValue(result.AdditionalInformation2);
        this.groupForm.controls.AdditionalInformation3.setValue(result.AdditionalInformation3);
        this.groupForm.controls.Email.setValue(result.Email);
      }

      setTimeout(() => {
        this.AccountServiceGroupUpdate.emit('setMinHeight');
      }, 1000);

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  getGroupStatusList() {
    this.sGService.ServiceGroupStatusList().subscribe((result: ServiceGroupStatus[]) => {
      
      if (result === null) {

      } else {
        this.groupStatusList = result;
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });
  }

  ngOnInit() {
    this.getServiceDetail();
    this.getGroupStatusList();
  }

  async groupUpdateSubnit() {
    await this.loading.present();
    this.currentSG.Code = this.groupForm.controls.Code.value;
    this.currentSG.AdditionalInformation1 = this.groupForm.controls.AdditionalInformation1.value;
    this.currentSG.AdditionalInformation2 = this.groupForm.controls.AdditionalInformation2.value;
    this.currentSG.AdditionalInformation3 = this.groupForm.controls.AdditionalInformation3.value;
    this.currentSG.Email = this.groupForm.controls.Email.value;
    this.currentSG.Name = this.groupForm.controls.Name.value;
    this.currentSG.Id = this.groupForm.controls.Id.value;
    this.currentSG.StatusId = parseInt(this.groupForm.controls.Status.value, 10);
    // this.currentSG.Status = this.groupForm.controls.Status.value;
    this.sGService.ServiceGroupUpdate(this.currentSG).subscribe(async (result: any) => {
      
      // if()
      await this.loading.dismiss();
      // this.AccountServiceGroupUpdate.emit('closeServices');
      this.tranService.errorMessageWithTime('update_service_group_successfully');
      setTimeout(() => {
        this.AccountServiceGroupUpdate.emit('closeServices');
      }, 2000);
    }, async (error: any) => {
      await this.loading.dismiss();
      
      if (error.status) {
        if (error.status === 200) {
          this.tranService.errorMessageWithTime('update_service_group_successfully');
          setTimeout(() => {
            this.AccountServiceGroupUpdate.emit('closeServices');
          }, 2000);
        } else {
          this.tranService.errorMessage(error.status.toString());
        }
      } else {
        
        this.tranService.errorMessage(error);
      }
      // 
      // this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  get f() {
    return this.groupForm.controls;
  }

  goBack() {
    // this.navCtrl.pop();
    // this.navCtrl.navigateRoot(['ServiceGroups/service-group-list']);
    this.AccountServiceGroupUpdate.emit('closeServices');
  }
}
