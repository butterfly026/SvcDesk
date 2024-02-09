import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, AbstractControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranService } from 'src/services/trans.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
    selector: 'app-pin-unlock',
    templateUrl: './pin-unlock.page.html',
    styleUrls: ['./pin-unlock.page.scss'],
})
export class PinUnlockPage {
    formData: UntypedFormGroup;

    constructor(
        private navCtrl: NavController,
        private formBuilder: UntypedFormBuilder,
        private tranService: TranService,
        public globService: GlobalService,
    ) {
        this.formData = this.formBuilder.group({
            pincode: new UntypedFormControl('', [
                Validators.required,
                Validators.pattern('[0-9]{1,}')
            ]),
        });
        this.tranService.translaterService();
    }

    scrollContent(event): void {
        this.globService.resetTimeCounter();
    }

    get f(): { [key: string]: AbstractControl<any, any> } {
        return this.formData.controls;
    }

    pinSubmit() {
        this.navCtrl.pop();
    }

    triggerSubmit() {
        document.getElementById('submitButton').click();
    }

    goBack() {
        this.navCtrl.pop();
    }

}
