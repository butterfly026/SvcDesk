import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, AfterViewChecked, Input } from '@angular/core';
import { AccountServiceGroupAddService } from './services/account-service-group-add.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-account-service-group-add',
  templateUrl: './account-service-group-add.page.html',
  styleUrls: ['./account-service-group-add.page.scss'],
})
export class AccountServiceGroupAddPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountServiceGroupAddComponent') AccountServiceGroupAddComponent: EventEmitter<string> = new EventEmitter<string>();

  pageTitle: string = '';
  

  groupForm: UntypedFormGroup;

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGAService: AccountServiceGroupAddService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('service_group_add').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.groupForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Code: [''],
      AdditionalInformation1: [''],
      AdditionalInformation2: [''],
      AdditionalInformation3: [''],
      Email: ['']
    });

  }

  ngOnInit() {
    setTimeout(() => {
      this.AccountServiceGroupAddComponent.emit('setMinHeight');
    }, 1000);
  }

  checkNameNotSpace() {
    let value = this.groupForm.controls.Name.value;
    if (value.replace(/ /g, '') == '') {
      this.groupForm.controls.Name.setErrors({ 'invalid': true });
      // this.groupForm.controls.Name.setValue('');
    } else {

    }
  }

  async groupAddSubnit() {
    await this.loading.present();
    const reqParam = {
      "Name": this.groupForm.controls.Name.value,
      ContactCode: this.ContactCode,
      "Code": this.groupForm.controls.Code.value,
      "AdditionalInformation1": this.groupForm.controls.AdditionalInformation1.value,
      "AdditionalInformation2": this.groupForm.controls.AdditionalInformation2.value,
      "AdditionalInformation3": this.groupForm.controls.AdditionalInformation3.value,
      "Email": this.groupForm.controls.Email.value
    }
    this.sGAService.ServiceGroupAdd(reqParam).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessageWithTime('add_service_group_successfully');
      setTimeout(() => {
        this.AccountServiceGroupAddComponent.emit('close');
      }, 2000);

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
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
    this.AccountServiceGroupAddComponent.emit('close');
  }

}
