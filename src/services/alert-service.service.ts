import { Injectable, Inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranService } from './trans.service';
import { TokenInterface, Token_config, } from 'src/app/model';
import { GlobalService } from './global-service.service';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    alerts: any[] = [];
    constructor(
        private alertCtrl: AlertController,

        @Inject(Token_config) public tokens: TokenInterface,
        private globService: GlobalService,
    ) {
    }

    async presentAlert(text, contactStr) {
        const alert = await this.alertCtrl.create({
            message: contactStr,
            subHeader: text,
            buttons: ['OK']
        });
        await alert.present();
        this.alerts.push(alert);
    }

    async HandleServerError(text) {
        const alert = await this.alertCtrl.create({
            message: text,
            buttons: ['Dismiss']
        });
        await alert.present();
    }

    async closeAllAlerts() {
        for (const list of this.alerts) {
            await list.dismiss();
        }
    }



    public createAlertBox = async (retryHandler: Function) =>
        await new AlertController().create(
            {
                message: 'Internet connection has been lost, Please reconnect your internet connection and sign-in again',
                subHeader: 'Message',
                buttons: [
                    {
                        text: 'Logout', cssClass: 'secondary', handler: () => {
                            this.globService.forceLogout();
                        }
                    },
                    { text: 'Retry', cssClass: 'secondary', handler: () => setTimeout(retryHandler, 1000) }
                ],
                backdropDismiss: false,
                keyboardClose: false
            }
        );


}
