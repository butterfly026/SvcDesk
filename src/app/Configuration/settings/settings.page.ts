import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { TranService, LoadingService, ToastService } from 'src/services';
import { NavController } from '@ionic/angular';
import { AuthoriseResourceService } from 'src/services/authorise-resource.service';
import { AuthorisationToken } from 'src/app/model/AuthorisationToken/AuthorisationToken';
import { ErrorItems } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    @ViewChild('buttonClose') private buttonElem: ElementRef;

    public themeList: Array<{ theme: string, mark: string }> = [
        { theme: 'base', mark: 'Base' },
        { theme: 'classic', mark: 'Classic' },
        { theme: 'bootstrap', mark: 'Bootstrap' },
        { theme: 'orange', mark: 'Orange' },
        { theme: 'energyblue', mark: 'Energy Blue' },
        { theme: 'darkblue', mark: 'Dark Blue' },
        { theme: 'summer', mark: 'Summer' },
        { theme: 'metro', mark: 'Metro' },
        { theme: 'office', mark: 'Office' },
        { theme: 'metrodark', mark: 'Metro Dark' },
        { theme: 'shinyblack', mark: 'Shiny Black' },
        { theme: 'highcontrast', mark: 'High Contrast' },
        { theme: 'material', mark: 'Material' }
    ];


    public languageList: Array<{ language: string, title: string }> = [
        { language: 'en', title: 'English' },
        { language: 'ru', title: 'Russian' }
    ];

    public languageType: string = localStorage.set_lng;
    public panelValue: string = 'style';


    // notifications variables
    public leadNotification: boolean = false;
    public debitRunNotification: boolean = false;

    themeColor: string = '';

    constructor(
        private tranService: TranService,
        public navCtrl: NavController,
        private loading: LoadingService,
        private toast: ToastService,
        private authService: AuthoriseResourceService,
        public globService: GlobalService
    ) {

        this.tranService.translaterService();
        this.changeThemeMark();
    }

    async ngOnInit() {
        await this.loading.present();
        this.authService.getAuthResource('Settings').subscribe(async (result: AuthorisationToken) => {
            
            switch (result.AuthorisationToken) {
                case 1:
                    this.navCtrl.navigateRoot(['InternalError/permission-denied']);
                    break;
                case 3:
                    break;
                case 5:
                    break;
                case 7:
                    break;
                case 9:
                    break;
                case 11:
                    break;
            }
            await this.loading.dismiss();
        }, async (error: any) => {
            
            await this.loading.dismiss();
            this.tranService.errorMessage(error);
        })
    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    public themeChange = (themeValue): any => {
        const jqButtonTheme1 = document.getElementsByClassName('jqx-button-theme');
        const selectedTheme = localStorage.getItem('currentTheme');

        if (selectedTheme !== '' && selectedTheme != null && typeof (selectedTheme) !== 'undefined') {
            for (let i = 0; i < jqButtonTheme1.length; i++) {
                jqButtonTheme1[i].classList.
                    remove('jqx-rc-all-' + selectedTheme, 'jqx-button-' + selectedTheme,
                        'jqx-widget-' + selectedTheme, 'jqx-fill-state-normal-' + selectedTheme,
                        'jqx-fill-state-disabled-' + selectedTheme);
            }
        } else {
            for (let i = 0; i < jqButtonTheme1.length; i++) {
                jqButtonTheme1[i].classList.
                    remove('jqx-rc-all-base', 'jqx-button-base', 'jqx-widget-base', 'jqx-fill-state-normal-base', 'jqx-fill-state-disabled-based');
            }
        }
        localStorage.setItem('currentTheme', themeValue);
        this.globService.currentThemeSubject.next('change_theme');
    };

    public langChange = (langValue: string): void => {
        localStorage.setItem('set_lng', langValue);
        this.tranService.setLang(langValue);
        this.changeThemeMark();
    };

    changeThemeMark() {
        for (const list of this.themeList) {
            this.tranService.convertText(list.theme).subscribe(value => {
                list.mark = value;
            });
        }
    }

}
