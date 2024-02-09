import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SigninHistoryService } from './services/signin-history.service';

@Component({
  selector: 'app-signin-history',
  templateUrl: './signin-history.component.html',
  styleUrls: ['./signin-history.component.scss'],
})
export class SigninHistoryComponent implements OnInit, OnDestroy {

  @Input() ContactCode: string = '';

  loginHistory: any;
  isDontShowAgain: boolean = false;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private signService: SigninHistoryService,
    private modalCtrl: ModalController,
    public globService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.isDontShowAgain= localStorage.getItem('UserPreferenceHideSignInHistory_'+this.ContactCode) === 'true';
    this.getLoginHistory();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  closeModal(): void {
    this.modalCtrl.dismiss();
  }
  
  onChange(ob: MatCheckboxChange): void {
    this.isDontShowAgain =ob.checked;
    localStorage.setItem("UserPreferenceHideSignInHistory_"+ this.ContactCode, this.isDontShowAgain.toString());
  }

  async changeMarkState(index): Promise<void> {
    await this.loading.present();
    this.signService.updateUserSuspect(this.loginHistory.items[index].id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: any) => await this.loading.dismiss(),
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getLoginHistory(): Promise<void> {
    await this.loading.present();
    this.signService.getUserLoginHistory(this.ContactCode)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: async (result: any) => {
        await this.loading.dismiss();
        this.loginHistory = this.globService.ConvertKeysToLowerCase(result);
      },
      error: async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      }
    });
  }

}
