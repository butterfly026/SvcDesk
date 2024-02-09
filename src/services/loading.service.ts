import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { GlobalService } from './global-service.service';
import { TranService } from './trans.service';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    isLoading = false;
    public loading;
    public loadingCounter: number = 0;
    loadingStr: string = '';

    constructor(
        public loadingCtrl: LoadingController,
        private tranService: TranService,
        public globService: GlobalService,
    ) {
        this.getLoadingStr();
    }

    async getLoadingStr() {
        this.tranService.translaterService();
        this.loadingStr = await this.tranService.convertText("loading_msg").toPromise()
    }

    async present() {
        this.loadingCounter++;
        if (this.isLoading) {
            return;
        } else {
            this.isLoading = true;
            return await this.loadingCtrl.create({
                message: this.loadingStr
            }).then(a => {
                a.present().then(() => { });
            });
        }
    }

    async dismiss() {
        this.loadingCounter--;
        if (this.loadingCounter < 0) {
            this.loadingCounter = 0;
        }
        if (this.isLoading && this.loadingCounter == 0) {
            this.isLoading = false;
            let close = await this.loadingCtrl.dismiss();
            this.globService.globSubject.next('load_end');
            return close;
        }
        return null;
    }

    async forcePresent() {
        return await this.loadingCtrl.create({
            message: this.loadingStr
        }).then(a => {
            a.present().then(() => { });
        });
    }

    async forceDismiss() {
        return await this.loadingCtrl.dismiss();
    }
}
