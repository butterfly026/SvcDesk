import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-account-site',
  templateUrl: './account-site.component.html',
  styleUrls: ['./account-site.component.scss'],
})
export class AccountSiteComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountSiteComponent') AccountSiteComponent: EventEmitter<any> = new EventEmitter<any>();

  
  groupList: any[] = [];

  siteForm: UntypedFormGroup;

  typeList: any[] = [
    { id: 'Standard', name: 'Standard' },
  ];

  arrayLength: number = 0;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    
    public globService: GlobalService,
  ) {
    

    this.siteForm = this.formBuilder.group({
    });

    this.siteForm.valueChanges.subscribe(() => {
      this.globService.globSubject.next('validForm&&Sites&&' + this.siteForm.valid);
    });
  }

  ngOnInit() {
    this.addNewSiteForm();
  }

  addNewSiteForm() {
    const currentGroup = {
      TypeCtrl: 'Type' + this.arrayLength,
      NameCtrl: 'Name' + this.arrayLength,
    }

    this.groupList.push(currentGroup);

    this.addFormControl(currentGroup.TypeCtrl, '', Validators.required);
    this.addFormControl(currentGroup.NameCtrl, '', Validators.required);
    this.arrayLength++;
  }

  removeSiteForm(currentGroup) {
    this.groupList = this.groupList.filter(item => item != currentGroup);
    this.removeFormControl(currentGroup.TypeCtrl);
    this.removeFormControl(currentGroup.NameCtrl);
  }

  addFormControl(ctrlName, value, validators) {
    if (!this.siteForm.contains(ctrlName)) {
      this.siteForm.addControl(ctrlName, new UntypedFormControl(value, validators));
    }
  }

  removeFormControl(ctrlName) {
    if (this.siteForm.contains(ctrlName)) {
      this.siteForm.removeControl(ctrlName);
    }
  }

  nextForm() {
    document.getElementById('siteSubmitButton').click();
  }

  prevForm() {
    this.AccountSiteComponent.emit('before');
  }

  submitSiteForm() {
    if (this.siteForm.valid) {
      this.AccountSiteComponent.emit(this.siteForm.value);
    }
  }

}
