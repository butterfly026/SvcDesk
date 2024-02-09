import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranService } from 'src/services';
import { finalize, takeUntil } from 'rxjs/operators';

import { NewAccountAuthenticationService } from '../../../services';

@Component({
  selector: 'app-new-account-authentication-login-id',
  templateUrl: './new-account-authentication-login-id.component.html',
  styleUrls: ['./new-account-authentication-login-id.component.scss'],
})
export class NewAccountAuthenticationLoginIdComponent implements OnDestroy {

  @Input() LoginIdFormControl: FormControl;

  isLoading: boolean;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private authService: NewAccountAuthenticationService
  ) { };

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  };

  checkLoginIdStatus(): void {
    if (this.LoginIdFormControl.valid) {
      this.isLoading = true;
      this.authService.checkLoginIdUniqueStatus(this.LoginIdFormControl.value)
        .pipe(
          takeUntil(this.unsubscribeAll$),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: result => {
            if (result.Used) {
              this.LoginIdFormControl.setErrors({
                'invalid': this.tranService.instant('LoginIdAlreadyUsed')
              });
            };
          },
          error: error => this.tranService.errorMessage(error)
        });
    };
  };

}
