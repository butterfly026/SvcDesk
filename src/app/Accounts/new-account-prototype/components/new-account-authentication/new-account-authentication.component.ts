import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AccountAuthenticationFormGroup } from '../../models';
@Component({
  selector: 'app-new-account-authentication',
  templateUrl: './new-account-authentication.component.html',
  styleUrls: ['./new-account-authentication.component.scss'],
})

export class NewAccountAuthenticationComponent {
  @Input() formGroup: FormGroup<AccountAuthenticationFormGroup>;
}
