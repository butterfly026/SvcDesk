import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { LockoutUserService } from './services/lockout-user.service';

@Component({
  selector: 'app-lockout-user',
  templateUrl: './lockout-user.component.html',
  styleUrls: ['./lockout-user.component.scss'],
})
export class LockoutUserComponent implements OnInit {

  

  groupForm: UntypedFormGroup;
  userId: string = '';

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private userService: LockoutUserService,
    
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private modalCtrl: ModalController,
    private navParams: NavParams,

  ) {
    this.groupForm = this.formBuilder.group({
      date: [''],
    });

    
  }

  ngOnInit() {
    this.userId = this.navParams.data.userId;
  }

  submitTrigger() {
    document.getElementById('submitButton').click()
  }

  async submitForm() {
    await this.loading.present();
    let reqBody = '';
    if (this.groupForm.get('date').value) {
      reqBody = this.groupForm.get('date').value;
    } else {
      reqBody = '9999-01-01T00:00:00';
    }
    this.userService.LockoutUser(this.userId, JSON.stringify(reqBody)).subscribe((result: any) => {
      
      this.modalCtrl.dismiss({ state: 'success' });
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  cancelLockOut() {
    this.modalCtrl.dismiss({ state: 'canceled' });
  }

}
