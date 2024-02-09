import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranService } from 'src/services/trans.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
    selector: 'app-fa-enter',
    templateUrl: './fa-enter.page.html',
    styleUrls: ['./fa-enter.page.scss'],
})
export class FaEnterPage {
    formData: UntypedFormGroup;

    constructor(
        private navCtrl: NavController,
        private formBuilder: UntypedFormBuilder,
        private tranService: TranService,
        public globService: GlobalService,
    ) {
        this.formData = this.formBuilder.group({
            facode: new UntypedFormControl('', [
                Validators.required,
                Validators.pattern('[0-9]{1,}')
            ]),
        });
        this.tranService.translaterService();
    }

    get f(): { [key: string]: AbstractControl<any, any> } {
        return this.formData.controls;
    }

    scrollContent(event): void {
        this.globService.resetTimeCounter();
    }

    async pinSubmit(): Promise<void> {
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
