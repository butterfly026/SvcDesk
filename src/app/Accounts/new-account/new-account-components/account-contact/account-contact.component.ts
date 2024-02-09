import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AccountNewService } from '../../../new-account/services/new-account.service';

@Component({
  selector: 'app-account-contact',
  templateUrl: './account-contact.component.html',
  styleUrls: ['./account-contact.component.scss'],
})
export class AccountContactComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountContactComponent') AccountContactComponent: EventEmitter<any> = new EventEmitter<any>();

  
  groupList: any[] = [];

  contactForm: UntypedFormGroup;

  typeList: any[] = [
    { id: 'Standard', name: 'Standard' },
  ];

  titleList: any[] = [
    { id: 'Mr', name: 'Mr' },
    { id: 'Mrs', name: 'Mrs' },
    { id: 'Miss', name: 'Miss' },
    { id: 'Ms', name: 'Ms' },
    { id: 'Dr', name: 'Dr' },
    { id: 'Mr/s', name: 'Mr/s' },
    { id: 'Count', name: 'Count' },
    { id: 'Fr', name: 'Fr' },
    { id: 'Judge', name: 'Judge' },
    { id: 'Lady', name: 'Lady' },
    { id: 'Lord', name: 'Lord' },
    { id: 'Major', name: 'Major' },
    { id: 'MP', name: 'MP' },
    { id: 'Prof', name: 'Prof' },
    { id: 'Rev', name: 'Rev' },
    { id: 'Sir', name: 'Sir' },
  ];

  arrayLength: number = 0;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    private accountSvc: AccountNewService,
    public globService: GlobalService,
  ) {
    

    this.contactForm = this.formBuilder.group({
    });

    // this.contactForm.valueChanges.subscribe(() => {
    //   this.globService.globSubject.next('validForm&&Contacts&&' + this.contactForm.valid);
    // });
    this.contactForm.valueChanges.subscribe(() => {
      this.AccountContactComponent.emit({
        type: 'valueChange',
        data: this.contactForm.valid
      });
    });
  }

  ngOnInit() { 
    // this.addNewContactForm();
  }

  addNewContactForm() {
    let idx = this.accountSvc.getValidIdx(this.groupList);
    const currentGroup = {
      TypeCtrl: 'Type' + idx,
      TitleCtrl: 'Title' + idx,
      FirstNameCtrl: 'FirstName' + idx,
      FamilyNameCtrl: 'FamilyName' + idx,
      idx: idx
    }

    this.groupList.push(currentGroup);

    this.addFormControl(currentGroup.TypeCtrl, '', Validators.required);
    this.addFormControl(currentGroup.TitleCtrl, '', Validators.required);
    this.addFormControl(currentGroup.FirstNameCtrl, '', Validators.required);
    this.addFormControl(currentGroup.FamilyNameCtrl, '', Validators.required);

    this.arrayLength++;
  }

  removeContactForm(currentGroup) {
    this.groupList = this.groupList.filter(item => item != currentGroup);
    this.removeFormControl(currentGroup.TypeCtrl);
    this.removeFormControl(currentGroup.TitleCtrl);
    this.removeFormControl(currentGroup.FirstNameCtrl);
    this.removeFormControl(currentGroup.FamilyNameCtrl);
  }

  addFormControl(ctrlName, value, validators) {
    if (!this.contactForm.contains(ctrlName)) {
      this.contactForm.addControl(ctrlName, new UntypedFormControl(value, validators));
    }
  }

  removeFormControl(ctrlName) {
    if (this.contactForm.contains(ctrlName)) {
      this.contactForm.removeControl(ctrlName);
    }
  }

  nextForm() {
    document.getElementById('contactSubmitButton').click();
  }

  prevForm() {
    this.AccountContactComponent.emit('before');
  }

  submitContactForm() {
    if (this.contactForm.valid) {
      this.AccountContactComponent.emit(this.contactForm.value);
    }
  }

}
