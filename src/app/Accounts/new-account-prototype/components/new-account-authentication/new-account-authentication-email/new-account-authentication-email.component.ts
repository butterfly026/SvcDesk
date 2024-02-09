import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { switchMap, finalize, takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { NewAccountAuthenticationService } from '../../../services';
import { UniqueStatusResponse, ValidateStatusResponse } from '../../../models';

@Component({
  selector: 'app-new-account-authentication-email',
  templateUrl: './new-account-authentication-email.component.html',
  styleUrls: ['./new-account-authentication-email.component.scss'],
})
export class NewAccountAuthenticationEmailComponent implements OnDestroy {

  @Input() emailFormControl: FormControl;

  isLoading: boolean;

  private unsubscribleAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private authService: NewAccountAuthenticationService
  ) { };

  ngOnDestroy(): void {
    this.unsubscribleAll$.next(null);
    this.unsubscribleAll$.complete();
  };

  checkEmailStatus(): void {
    if (this.emailFormControl.valid) {
      this.isLoading = true;
      this.authService.checkEmailFormatStatus(this.emailFormControl.value)
        .pipe(
          switchMap(result => {
            return result.Valid
              ? this.authService.checkEmailUniqueStatus(this.emailFormControl.value)
              : of(result);
          }),
          takeUntil(this.unsubscribleAll$),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: result => {
            if ((result as ValidateStatusResponse).Valid === false) {
              this.emailFormControl.setErrors({
                'invalid': (result as ValidateStatusResponse).Results[0].Message
              });
            };
            if ((result as UniqueStatusResponse).Used) {
              this.emailFormControl.setErrors({
                'invalid': this.tranService.instant('EmailIsAlreadyUsed')
              });
            };
          },
          error: error => this.tranService.errorMessage(error)
        });
    };
  };

}
