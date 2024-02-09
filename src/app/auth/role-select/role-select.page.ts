import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services/trans.service';
import { LoadingService } from 'src/services/loading.service';
import { RoleService } from './services/role-select.service';
import { RoleListItem } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.page.html',
  styleUrls: ['./role-select.page.scss'],
})
export class RoleSelectPage implements OnInit, OnDestroy {

  formData: UntypedFormGroup;
  roleList = [];
  
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private formBuilder: UntypedFormBuilder,
    private roleService: RoleService,
  ) {
    this.tranService.translaterService();
    this.formData = this.formBuilder.group({
      roleSelect: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loading.present();
    this.roleService.getRolList()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: RoleListItem[]) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_roles');
          } else {
            this.roleList = result;
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

  triggerSubmit(): void {
    document.getElementById('submitButton').click();
  }

  goBack(): void {
    this.navCtrl.pop();
  }

  async roleSubmit(): Promise<void> {
    if (this.formData.valid) {
      await this.loading.present();
      this.roleService.roleSelect(this.formData.controls['roleSelect'].value)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: async () => {
            this.navCtrl.pop();
            await this.loading.dismiss();
          },
          error: async (error: any) => {
            await this.loading.dismiss();
            this.tranService.errorMessage(error);
          }
        });
    }
  }
}
