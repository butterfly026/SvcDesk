import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { ProcedureBalanceService } from './services/procedure-balance.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';


import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-procedure-balance',
  templateUrl: './procedure-balance.page.html',
  styleUrls: ['./procedure-balance.page.scss'],
})
export class ProcedureBalancePage implements OnInit {

  rechargeList: any = [];
  pageTitle: string = '';

  actKeyString: string = '';

  

  procedureBalance: number = 0;

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private toast: ToastService,
    private tranService: TranService,
    private pBService: ProcedureBalanceService,
    
    private cdr: ChangeDetectorRef,
    
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('procedure_balance').subscribe(value => {
      this.pageTitle = value;
    });

    
  }

  goBack() {
    this.navCtrl.pop();
  }

  async ngOnInit() {

    await this.loading.present();
    this.pBService.getRechargeList('1').subscribe(async (result: any) => {
      
      await this.loading.dismiss();

      if (result === null) {
        this.tranService.convertText('vouchers_not_found').subscribe(value => {
          this.toast.present(value);
        });
      } else {
        for (const list of result) {
          this.rechargeList.push(list);
        }
        for (const list of this.rechargeList) {
          this.procedureBalance = this.procedureBalance + list.MainCurrencyAmount;
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

}
