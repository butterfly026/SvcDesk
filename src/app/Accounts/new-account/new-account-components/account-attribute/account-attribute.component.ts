import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountAttributeService } from './services/account-attribute.service';
import { AccountNewService } from '../../../new-account/services/new-account.service';
@Component({
  selector: 'app-account-attribute',
  templateUrl: './account-attribute.component.html',
  styleUrls: ['./account-attribute.component.scss'],
})
export class AccountAttributeComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountAttributeComponent') AccountAttributeComponent: EventEmitter<any> = new EventEmitter<any>();


  

  userForm: UntypedFormGroup;
  availableDefinedList: any[] = [];
  groupList: any[] = [];
  currentUserDefinedDetail: any;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private usersService: AccountAttributeService,
    private accountSvc: AccountNewService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.userForm = this.formBuilder.group({
      userDefined: ['', Validators.required],
      value: ['', Validators.required]
    });

    this.userForm.valueChanges.subscribe(() => {
      this.globService.globSubject.next('validForm&&Attibutes&&' + this.userForm.valid);
    });
  }

  async ngOnInit() {
    await this.getAvailableDefinedList();
  }

  async getAvailableDefinedList() {
    await this.loading.present();
    this.usersService.getAvailableUserDefinedDataTypes().subscribe(async (result: any) => {
      await this.loading.dismiss();

      const convResult = this.globService.ConvertKeysToLowerCase(result);

      this.availableDefinedList = [];
      for (let list of convResult) {
        this.availableDefinedList.push(list);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async userFormSubmit() {
    if (this.userForm.valid) {
      this.AccountAttributeComponent.emit(this.userForm.value);
    }
  }

  nextForm() {
    document.getElementById('attributeSubmitButton').click();
  }

  prevForm() {
    this.AccountAttributeComponent.emit('before');
  }

  addNewAttribute(){    
    let idx = this.accountSvc.getValidIdx(this.groupList);
    let temp = {
      DefinedCtrlName: 'DefinedCtrl' + idx,
      ValueCtrlName: 'ValueCtrl' + idx,
      idx: idx,
    }
    this.groupList.push(temp);
  }
  deleteAttr(dataIdx){
    if(dataIdx >= this.groupList.length) return;
    this.groupList.splice(dataIdx, 1);
  }
}
