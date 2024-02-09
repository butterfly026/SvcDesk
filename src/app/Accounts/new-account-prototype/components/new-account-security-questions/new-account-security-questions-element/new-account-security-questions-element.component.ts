import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AccountSecurityQuestionFormGroup, SecurityQuestion } from '../../../models';

@Component({
  selector: 'app-new-account-security-questions-element',
  templateUrl: './new-account-security-questions-element.component.html',
  styleUrls: ['./new-account-security-questions-element.component.scss'],
})
export class NewAccountSecurityQuestionsElementComponent {

  @Input() formGroup: FormGroup<AccountSecurityQuestionFormGroup>;
  @Input() securityQuestions: SecurityQuestion[];
  @Output() onDeleteFormGroup = new EventEmitter<void>();

  deleteFormGroup(): void {
    this.onDeleteFormGroup.emit();
  }

}
