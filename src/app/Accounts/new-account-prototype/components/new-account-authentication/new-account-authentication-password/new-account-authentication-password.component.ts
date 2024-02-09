import { takeUntil, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { LoadingService, TranService } from 'src/services';
import { NewAccountAuthenticationService } from '../../../services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertController } from '@ionic/angular';
import { SpinnerService } from 'src/app/Shared/services';

@Component({
  selector: 'app-new-account-authentication-password',
  templateUrl: './new-account-authentication-password.component.html',
  styleUrls: ['./new-account-authentication-password.component.scss'],
})
export class NewAccountAuthenticationPasswordComponent implements OnDestroy {

  @Input() passwordFormControl: FormControl;

  isLoading: boolean;
  passwordComplexity: string;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private authService: NewAccountAuthenticationService,
    private alertCtrl: AlertController,
  ) { };

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  };

  checkPasswordComplexity(): void {
    if (this.passwordFormControl.valid) {
      this.isLoading = true;
      this.authService.checkPasswordComplexity(this.passwordFormControl.value)
        .pipe(
          takeUntil(this.unsubscribeAll$),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: result => {
            if (result.Result === 'FAILED') {
              this.passwordFormControl.setErrors({
                'invalid': result.Reason
              })
            } else {
              this.passwordComplexity = result.PasswordStrength
            };
          },
          error: error => this.tranService.errorMessage(error)
        });
    };
  };

  generatePassword(): void {
    this.spinnerService.loading();
    this.authService.generatePassword()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => {
          this.openPasswordSuggestionAlert(result.Password);
        }, 
        error: error => {
          this.tranService.errorMessage(error);
        }
      });
  };

  async openPasswordSuggestionAlert(password: string) {
    const alert = await this.alertCtrl.create({
      message: password,
      subHeader: this.tranService.instant('password_suggest'),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            this.passwordFormControl.setValue(password);
            this.checkPasswordComplexity();
          }
        }
      ],
      backdropDismiss: false,
    });
    await alert.present();
  };

}
