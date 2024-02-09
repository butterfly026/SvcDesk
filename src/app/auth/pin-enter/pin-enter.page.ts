import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranService } from 'src/services/trans.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
    selector: 'app-pin-enter',
    templateUrl: './pin-enter.page.html',
    styleUrls: ['./pin-enter.page.scss'],
})
export class PinEnterPage {

    formData: UntypedFormGroup;

    constructor(
        private navCtrl: NavController,
        private formBuilder: UntypedFormBuilder,
        private tranService: TranService,
        public globService: GlobalService
    ) {
        this.formData = this.formBuilder.group({
            pincode: new UntypedFormControl('', [
                Validators.required,
                Validators.pattern('[0-9]{4}')
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

    pinSubmit(): void {
        if (this.formData.valid) {
            this.navCtrl.pop();
        }
    }

    triggerSubmit(): void {
        document.getElementById('submitButton').click();
    }

    goBack(): void {
        this.navCtrl.pop();
    }

}
