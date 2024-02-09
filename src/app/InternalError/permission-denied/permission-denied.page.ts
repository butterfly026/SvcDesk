import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
    selector: 'app-permission-denied',
    templateUrl: './permission-denied.page.html',
    styleUrls: ['./permission-denied.page.scss'],
})
export class PermissionDeniedPage implements OnInit {


    constructor(public navCtrl: NavController,
        public globService: GlobalService,
        private tranService: TranService) {
    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    ngOnInit(): void {

        this.tranService.translaterService();
    }

}
