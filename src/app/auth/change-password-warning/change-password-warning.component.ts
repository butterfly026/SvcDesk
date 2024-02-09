import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChangePasswordComponentPage } from '../change-password/change-password-component/change-password-component.page';

@Component({
  selector: 'app-change-password-warning',
  templateUrl: './change-password-warning.component.html',
  styleUrls: ['./change-password-warning.component.scss'],
})
export class ChangePasswordWarningComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() expiryWarningDate: Date;
  @Input() expiryDate: Date;

  isDontShowAgain: boolean = false;

  constructor(
    public tranService: TranService,
    private modalCtrl: ModalController,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.isDontShowAgain = localStorage.getItem("UserPreferenceHidePasswordWarning"+ this.ContactCode) === 'true';
  }

  async  changepassword(): Promise<void> {
    await this.modalCtrl.dismiss();
    const modal = await this.modalCtrl.create({
      component: ChangePasswordComponentPage,
      componentProps: {
        ContactCode: this.ContactCode,
      },
      backdropDismiss: false,
    });

    await modal.present();
  }

  close(): void {
    this.modalCtrl.dismiss();
  }

  onChange(ob: MatCheckboxChange): void {
    this.isDontShowAgain = ob.checked;
    localStorage.setItem("UserPreferenceHidePasswordWarning_"+ this.ContactCode, this.isDontShowAgain.toString());
  }
}
