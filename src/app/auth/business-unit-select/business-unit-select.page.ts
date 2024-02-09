import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { BusinessUnitListItem } from 'src/app/model';
import { LoadingService } from 'src/services/loading.service';
import { TranService } from 'src/services/trans.service';
import { GlobalService } from 'src/services/global-service.service';
import { BusinessUnitService } from './services/business-unit-select.service';

@Component({
  selector: 'app-business-unit-select',
  templateUrl: './business-unit-select.page.html',
  styleUrls: ['./business-unit-select.page.scss'],
})
export class BusinessUnitSelectPage implements OnInit, OnDestroy {

  unitList = [];
  pageTitle: any;
  formData: UntypedFormGroup;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    private businessUnitService: BusinessUnitService,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.formData = this.formBuilder.group({
      unitSelect: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loading.present();
    this.businessUnitService.getbusinessUnitList()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: BusinessUnitListItem[]) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_business_unit');
          } else {
            this.unitList = result;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  scrollContent(event): void {
    this.globService.resetTimeCounter();
  }

  goBack(): void {
    this.navCtrl.pop();
  }

  triggerSubmit(): void {
    document.getElementById('submitButton').click();
  }

  async unitSubmit(): Promise<void> {
    await this.loading.present();
    this.businessUnitService.businessUnitSelect(this.formData.controls['unitSelect'].value)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          await this.loading.dismiss();
          if (!!result) {
            this.navCtrl.pop();
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

}
