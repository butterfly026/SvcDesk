import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { UserDefinedDataFormService } from './services/user-defined-data-form.service';

@Component({
  selector: 'app-user-defined-data-form',
  templateUrl: './user-defined-data-form.component.html',
  styleUrls: ['./user-defined-data-form.component.scss'],
})
export class UserDefinedDataFormComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() UserDefinedId: string = '';
  @Input() ExistingUserDefinedDefinitions: any = [];
  @Output('UserDefinedDataFormComponent') UserDefinedDataFormComponent: EventEmitter<string> = new EventEmitter<string>();


  

  userForm: UntypedFormGroup;
  availableDefinedList: any[] = [];
  currentUserDefinedDetail: any;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private usersService: UserDefinedDataFormService,
    
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.userForm = this.formBuilder.group({
      userDefined: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.getAvailableDefinedList();
    if (this.UserDefinedId) {
      this.getUserDefinedDataDetail();
    }
  }

  async getAvailableDefinedList() {
    await this.loading.present();
    this.usersService.getAvailableUserDefinedDataTypes(this.ContactCode).subscribe(async (result: any) => {
      await this.loading.dismiss();

      const convResult = this.globService.ConvertKeysToLowerCase(result);

      this.availableDefinedList = [];
      for (let list of convResult) {
        let availPush = true;
        for (let origin of this.ExistingUserDefinedDefinitions) {
          if (origin.id === list.id) {
            availPush = false;
          }
        }

        if (availPush) {
          this.availableDefinedList.push(list);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getUserDefinedDataDetail() {
    await this.loading.present();
    this.usersService.getUserDefinedDataDetail(this.ContactCode, this.UserDefinedId).subscribe(async (result: any) => {
      await this.loading.dismiss();

      const convResult = this.globService.ConvertKeysToLowerCase(result);

      this.currentUserDefinedDetail = convResult;
      this.userForm.get('userDefined').setValue(this.currentUserDefinedDetail.id);
      this.userForm.get('value').setValue(this.currentUserDefinedDetail.value);

      this.userForm.get('userDefined').disable();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async userFormSubmit() {
    if (this.userForm.valid) {
      const reqData = {
        Value: this.userForm.get('value').value
      };
      if (this.UserDefinedId) {
        await this.loading.present();
        this.usersService.updateUserDefinedData(this.ContactCode, this.userForm.get('userDefined').value, reqData).subscribe(async (result: any) => {
          await this.loading.dismiss();
          this.UserDefinedDataFormComponent.emit('close');
        }, async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        });
      } else {
        await this.loading.present();
        this.usersService.addUserDefinedData(this.ContactCode, this.userForm.get('userDefined').value, reqData).subscribe(async (result: any) => {
          await this.loading.dismiss();
          this.UserDefinedDataFormComponent.emit('close');
        }, async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        });
      }
    }
  }

  triggerSubmit() {
    document.getElementById('submitButton').click();
  }

  closeAdd() {
    this.UserDefinedDataFormComponent.emit('close');
  }


}
