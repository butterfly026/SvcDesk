import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService } from 'src/services/trans.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

    formData: UntypedFormGroup;

    constructor(
        private navCtrl: NavController,
        private tranService: TranService,
        private formbuilder: UntypedFormBuilder,
        public globService: GlobalService
    ) {
        this.tranService.translaterService();
        this.formData = this.formbuilder.group({
            userinfo: new UntypedFormControl({ value: '', disabled: true }, Validators.required)
        });

        this.formData.controls['userinfo'].setValue('veerhunter127@gmail.com');
    }

    signInSubmit(): void {
        this.navCtrl.pop();
    }

    scrollContent(event): void {
        this.globService.resetTimeCounter();
    }

    goBack(): void {
        this.navCtrl.pop();
    }

    sendLink(): void {
        this.navCtrl.pop();
    }


}
