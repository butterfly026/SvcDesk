import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, ToastService, TranService } from 'src/services';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UUID } from 'angular2-uuid';
import { GlobalService } from 'src/services/global-service.service';

@Component({
    selector: 'app-recharge-upsert',
    templateUrl: './recharge-upsert.page.html',
    styleUrls: ['./recharge-upsert.page.scss'],
})
export class RechargeUpsertPage implements OnInit {


    
    rechargeUpsertForm: UntypedFormGroup;
    public rechargeId: string;
    public pageTitle: string;


    constructor(private fb: UntypedFormBuilder,
        private tranService: TranService,
        private toast: ToastService,
        private activatedRoute: ActivatedRoute,
        private loading: LoadingService,
        public globService: GlobalService,
        public navCtrl: NavController) {

        this.tranService.translaterService();
        this.rechargeId = activatedRoute.snapshot.params['recharge_status_id'];

        this.rechargeUpsertForm = fb.group({
            Id: [(this.rechargeId === 'new' ? '' : this.rechargeId), Validators.required],
            Description: ['', Validators.required],
            CreatedBy: ['', Validators.required],
            CreatedDatetime: ['', Validators.required],
            UpdatedBy: ['', Validators.required],
            LastUpdatedDatetime: ['', Validators.required]
        });

        this.pageTitle = this.rechargeId === 'new' ? 'add_new_recharge_status' : 'update_recharge_status';

    }


    ngOnInit(): void {
    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    public saveForm = (): void => {

        const id = UUID.UUID();
        this.navCtrl.back();
    };


}
