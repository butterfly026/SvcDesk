import { Component, Inject, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services/trans.service';
import { LoadingService } from 'src/services/loading.service';
import { TokenInterface, Token_config } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';
import { SignInService } from '../signin/services/signin.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnDestroy {

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private signinService: SignInService,
    private router: Router,
    @Inject(Token_config) private tokens: TokenInterface,
  ) {
    this.tranService.translaterService();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  scrollContent(event): void {
    this.globService.resetTimeCounter();
  }

  getAccessToken(): void {
    this.signinService.getAccessToken()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          await this.loading.dismiss();
  
          this.tokens.AccessToken = result.type + ' ' + result.credentials;
          this.globService.increaseCounter();
          this.globService.getAccessToken();
          this.router.navigate(['ServiceDesk'], { replaceUrl: true });
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          await this.loading.forceDismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  async processPassword(event): Promise<void> {
    if (event === 'close') {
      this.navCtrl.pop();
    } else if (event === 'main') {
      this.router.navigate(['ServiceDesk'], { replaceUrl: true });
    } else if (event.includes('changePassword')) {
      const password = event.split('&&')[1];
      await this.loading.present();

      const reqData = {
        'UserId': this.tokens.UserCode,
        'Password': password,
        'SiteId': localStorage.getItem('SiteId'),
        'signType': null
      };

      this.signinService.getRefreshToken(reqData)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: async (result: any) => {
            this.tokens.RefreshToken = result.credentials;
            this.tokens.Type = result.type;
            this.getAccessToken();
          },
          error: async (error: any) => {
            await this.loading.dismiss();
  
            if (error.status.toString() === '404') {
              this.navCtrl.navigateForward(['Registration', reqData.UserId]);
            } else {
              await this.loading.forceDismiss();
              this.tranService.errorMessage(error.error.status.toString());
            }
          }
        });
    }
  }
}
