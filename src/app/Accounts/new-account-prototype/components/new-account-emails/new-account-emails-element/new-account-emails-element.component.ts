import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountEmailFormGroup, AccountEmailTypeItem } from '../../../models';

@Component({
  selector: 'app-new-account-emails-element',
  templateUrl: './new-account-emails-element.component.html',
  styleUrls: ['./new-account-emails-element.component.scss'],
})
export class NewAccountEmailsElementComponent {

  @Input() formGroup: FormGroup<AccountEmailFormGroup>;
  @Input() emailTypeList: AccountEmailTypeItem[] = [];
  @Output() onDeleteFormGroup = new EventEmitter<void>();

  isLoading: boolean;

  deleteFormGroup(): void {
    this.onDeleteFormGroup.emit();
  }

}
