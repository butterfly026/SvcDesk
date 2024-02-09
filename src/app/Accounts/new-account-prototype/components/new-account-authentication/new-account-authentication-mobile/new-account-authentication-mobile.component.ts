import { switchMap, finalize, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, Subject } from 'rxjs';

import { TranService } from 'src/services';
import { NewAccountAuthenticationService } from '../../../services';
import { UniqueStatusResponse, ValidateStatusResponse } from '../../../models';

@Component({
  selector: 'app-new-account-authentication-mobile',
  templateUrl: './new-account-authentication-mobile.component.html',
  styleUrls: ['./new-account-authentication-mobile.component.scss'],
})
export class NewAccountAuthenticationMobileComponent implements OnDestroy {

  @Input() mobileFormControl: FormControl;

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

  checkMobilePhoneStatus(): void {
    if (this.mobileFormControl.valid) {
      this.isLoading = true;
      this.authService.checkMobileFormatStatus(this.mobileFormControl.value)
        .pipe(
          switchMap(result => {
            return result.Valid
              ? this.authService.checkMobileUniqueStatus(this.mobileFormControl.value)
              : of(result);
          }),
          takeUntil(this.unsubscribeAll$),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: result => {
            if ((result as ValidateStatusResponse).Valid === false) {
              this.mobileFormControl.setErrors({
                'invalid': (result as ValidateStatusResponse).Results[0].Message
              });
            };
            if ((result as UniqueStatusResponse).Used) {
              this.mobileFormControl.setErrors({
                'invalid': this.tranService.instant('MobilePhoneAlreadyUsed')
              });
            };
          },
          error: error => this.tranService.errorMessage(error)
        });
    };
  };

}
