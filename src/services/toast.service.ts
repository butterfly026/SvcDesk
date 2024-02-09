import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    
    public toast;
    
    constructor(
        public toastCtrl: ToastController,
    ) {
    }
    
    async present(toastMessage) {
        const toast = await this.toastCtrl.create({
            message: toastMessage,
            duration: 5000,
            color: 'dark',
            mode: 'ios'
        });
        toast.present();
    }
    
    async presentWithTime(toastMessage, time) {
        const toast = await this.toastCtrl.create({
            message: toastMessage,
            duration: time,
            color: 'dark',
            mode: 'ios'
        });
        toast.present();
    }
    
    async presentLoginHistory(toastMessage) {
        const toast = await this.toastCtrl.create({
            message: toastMessage,
            duration: 5000,
            color: 'dark',
            mode: 'ios',
            cssClass: 'login-history'
        });
        toast.present();
    }
}
