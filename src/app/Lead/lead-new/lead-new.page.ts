import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranService, LoadingService, ToastService } from 'src/services';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LeadNewService } from './services/lead-new.service';
import { UUID } from 'angular2-uuid';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';


@Component({
    selector: 'app-lead',
    templateUrl: './lead-new.page.html',
    styleUrls: ['./lead.page.scss'],
})
export class LeadNewPage implements OnInit {

    customData: any = {};
    leadForm: UntypedFormGroup;
    public panelValue: string;

    sourceOptions: Array<string> = ['Source 1', 'Source 2', 'Source 3', 'Source 4'];
    public sourceFilteredOptions: Observable<string[]>;

    statusOptions: Array<string> = ['Status 1', 'Status 2', 'Status 3', 'Status 4'];
    public statusFilteredOptions: Observable<string[]>;

    public pageTitle: string;
    


    constructor(private fb: UntypedFormBuilder,
        private tranService: TranService,
        private leadService: LeadNewService,
        private toast: ToastService,
        private activatedRoute: ActivatedRoute,
        private loading: LoadingService,
        public globService: GlobalService,
        public navCtrl: NavController) {

        this.tranService.translaterService();
        const personal_details = {

            // group 1
            source: ['', Validators.required],
            intro_details: [''],
            status: ['', Validators.required],
            type: ['', Validators.required],

            // group 2
            title: ['', Validators.required],
            first_name: [''],
            last_name: [''],
            company: [''],

            // group 3
            details: [''],

            // group 4
            fu_date: ['', Validators.required],
            do_not_contact: [''],

            // group 5
            mobile: ['', Validators.pattern(/^\d+$/)],
            home_contact: ['', Validators.pattern(/^\d+$/)],
            work_contact: ['', Validators.pattern(/^\d+$/)],
            email: ['', Validators.email],
            email_opt_out: [''],
            email_invalid: [''],

            // group 6
            address1: [''],
            address2: [''],
            suburb: [''],
            city: [''],
            postcode: ['', Validators.pattern('[0-9]{4}')],
            state: [''],
        };

        this.leadForm = fb.group({
            ...personal_details
        });
    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    ngOnInit(): void {

        if (this.activatedRoute.params) {

            this.customData = this.activatedRoute.params;

            this._expensionPanel(this.customData['open'] || 'personal_detail');
        }

        this.sourceFilteredOptions = this.leadForm.controls['source'].valueChanges.pipe(
            startWith(''),
            map(value => this.sourceOptions.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) === 0))
        );

        this.statusFilteredOptions = this.leadForm.controls['status'].valueChanges.pipe(
            startWith(''),
            map(value => this.statusOptions.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) === 0))
        );

        this.tranService.convertText('Lead')
            .subscribe(value => this.pageTitle = value);
    };


    async saveSalesLead() {

        const id = UUID.UUID();
        await this.loading.present();

        this.navCtrl.navigateForward(['SalesLead/lead-new-list']);

        this.leadService.createSalesLead({ ...this.leadForm.value, ...{ id } })
            .subscribe(
                async data => {
                    await this.loading.dismiss();
                    this.navCtrl.navigateForward(['SalesLead/lead-new-list']);
                },
                error => {
                    this._translateText('lead_saving_failed')
                        .then(async value => {
                            await this.loading.dismiss();
                            this.toast.present(value);
                        });
                }
            );
    };


    private _expensionPanel = (value) => this.panelValue = value;


    private _translateText = (text) =>
        this.tranService.convertText(text)
            .toPromise();

}
