import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface, ComponentOutValue } from 'src/app/model';
import { AlertController, ToastController, NavController, ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { SignInService } from 'src/app/auth/signin/services/signin.service';
import { CookieService } from 'ngx-cookie-service';

var timeOutCounter = 0;
var expireCounter = 0;

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    private warningText = '';
    private continueText = '';
    private warningHeader = '';
    private noText = '';
    private xTime = 1800;
    // private xTime = 350;
    private alert: any;

    private timeInterval;
    private expireInterval;
    private expireTime = 86400;
    private onGoingText = '';
    private expireAccessToken;

    public DialogControlFlag: string = '';

    public globSubject: Subject<string> = new Subject<string>();
    public portalMenuSubject: Subject<any> = new Subject<any>();
    public leftMenuSubject: Subject<any> = new Subject<any>();
    public getMenuEventSubject: Subject<any> = new Subject<any>();
    public headerSubject: Subject<any> = new Subject<any>();
    public currentComponent: Subject<any> = new Subject<any>();
    public currentThemeSubject: Subject<any> = new Subject<any>();
    public cardStateSubject: Subject<any> = new Subject<any>();
    public chargeDefinitionSubject: Subject<ComponentOutValue> = new Subject<ComponentOutValue>();
    public serviceProviderUserSubject: Subject<any> = new Subject<any>();
    accountSecurityDetails: any = null;
    private securityDetailsSubject = new BehaviorSubject<any>(this.accountSecurityDetails);
    public securityDetails = this.securityDetailsSubject.asObservable();
    public globalComponentSubject: Subject<{ type: string, data?: any }> = new Subject<{ type: string, data?: any }>();

    public themeColor: string = '';
    public rtlMode: boolean = false;
    public PasswordInformation: any;
    public activeState = true;

    public currencyConfig: any;
    public currencyOptionsOnlyPositive = {
        align: 'left',
        allowNegative: false,
        decimal: '.',
        precision: 2,
        prefix: '$',
        suffix: '',
        thousands: ',',
        max: 9999999999999
    };
    public currencyOptions = {
        align: 'left',
        allowNegative: true,
        decimal: '.',
        precision: 2,
        prefix: '$',
        suffix: '',
        thousands: ',',
        max: 9999999999999
    };;

    onGoingStr: string = '';

    inactiveTime = 0;
    previousTime = 0;

    constructor(
        @Inject(APP_CONFIG) public config: IAppConfig,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController,
        private translate: TranslateService,
        private cookieService: CookieService,
        public toastCtrl: ToastController,
        private navCtrl: NavController,
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        private signinService: SignInService,
        private platform: Platform,
    ) {
        document.addEventListener('keydown', function () {
            timeOutCounter = 0;
        });
        document.addEventListener('keypress', function () {
            timeOutCounter = 0;
        });
        document.addEventListener('keyup', function () {
            timeOutCounter = 0;
        });
        document.addEventListener('mousedown', function () {
            timeOutCounter = 0;
        });
        document.addEventListener('mouseenter', function () {
            timeOutCounter = 0;
        });
        document.addEventListener('mousemove', function () {
            timeOutCounter = 0;
        });
        document.addEventListener('mouseup', function () {
            timeOutCounter = 0;
        });

        this.getAllTrans();

        this.getDirValue();

        this.globSubject.subscribe((result: any) => {
            if (result === 'language_change') {
                this.getDirValue();
            }
        });

        this.themeColor = this.getCurrentTheme();

        this.currentThemeSubject.subscribe(() => {
            this.themeColor = this.getCurrentTheme();
        })

        this.currencyConfig = { id: 'AUD', name: 'Australian Dollar' };

    }

    public SetDialogControlFlag(Flag: string) {
        this.DialogControlFlag = Flag;
    }

    public ClearDialogControlFlag() {
        this.DialogControlFlag = '';
    }

    public getCurrentTheme() {
        let currentTheme = 'base';
        if (typeof (localStorage.getItem('currentTheme')) === 'undefined' || localStorage.getItem('currentTheme') === '' || localStorage.getItem('currentTheme') === null) {
            currentTheme = 'base';
            localStorage.setItem('currentTheme', currentTheme);
        } else {
            currentTheme = localStorage.getItem('currentTheme');
        }
        return currentTheme;
    };

    clearOneSignalConfig() {
        localStorage.removeItem('isPushNotificationsEnabled');
        localStorage.removeItem('onesignal-notification-prompt');
        localStorage.removeItem('os_pageViews');
        localStorage.removeItem('isOptedOut');
    }

    async getAllTrans() {
        this.warningText = await this.translate.get('session_expire_warning').toPromise();
        this.continueText = await this.translate.get('continue').toPromise();
        this.noText = await this.translate.get('no').toPromise();
        this.warningHeader = await this.translate.get('warning').toPromise();
        this.onGoingStr = await this.translate.get('on_going').toPromise();
    }

    ConvertKeysToLowerCase(obj) {
        var json = JSON.stringify(obj);
        var newJson = json.replace(/"([\w]+)":/g, function ($0, $1) {
            return ('"' + $1.toLowerCase() + '":');
        });
        var newObj = JSON.parse(newJson);
        this.getAllValues(newObj);

        return newObj;
    };

    getAllValues(obj) {
        for (var prop in obj) {
            if (typeof obj[prop] == 'object') {
                // object
                this.getAllValues(obj[prop]);
            } else {
                if (this.getCurrentDateFormat(obj[prop])) {
                    obj[prop] = this.checkCancelledDate(obj[prop].toString());
                }
            }
        }
    }

    setSecurityDetails(securityDetails: any) {
        this.securityDetailsSubject.next(securityDetails);
    }

    increaseCounter() {
        this.previousTime = 0;
        this.inactiveTime = 0;

        document.addEventListener('visibilitychange', function (event) {
            if (document.hidden) {
                this.inactiveTime = new Date().getTime();
                this.previousTime = timeOutCounter;
                localStorage.setItem('previousTime', timeOutCounter.toString());
            } else {
                const activeTime = new Date().getTime();
                if (timeOutCounter === 0) {
                } else {
                    timeOutCounter = parseInt(localStorage.getItem('previousTime'))
                        + Math.round((activeTime - this.inactiveTime) / 1000);
                }
                this.previousTime = 0;
                localStorage.setItem('activeState', this.previousTime.toString());
            }
        });

        this.timeInterval = setInterval(() => {
            this.startCounter();
        }, 1000);
    }

    startCounter() {
        timeOutCounter++;
        if (timeOutCounter % 60 === 0) {
            localStorage.setItem('timeOutCounter', timeOutCounter.toString());
        }
        if (timeOutCounter === this.xTime || timeOutCounter > this.xTime) {
            timeOutCounter = 0;
            clearInterval(this.timeInterval);
            this.logOutAutomatic();
        }
    }

    resetTimeCounter() {
        timeOutCounter = 0;
        this.previousTime = 0;
        this.inactiveTime = 0;
    }

    clearAllToken() {
        this.tokens.AccessToken = '';
        this.tokens.RefreshToken = '';
        this.tokens.Type = '';
        this.tokens.Name = '';
        this.tokens.UserCode = '';
        this.tokens.ContactCode = '';


    }

    checkExpireToken() {
        this.expireInterval = setInterval(() => {
            this.startExpireInterval();
        }, 1000);
    }

    startExpireInterval() {
        expireCounter = expireCounter + 1;
        if (expireCounter === this.expireTime || expireCounter > this.expireTime) {
            this.logOutAutomatic();
        }
    }

    getAccessToken() {
        this.expireAccessToken = setInterval(() => {
            if (expireCounter <= this.expireTime) {
                this.signinService.getAccessToken().subscribe((result: any) => {
                    this.tokens.AccessToken = result.type + ' ' + result.credentials;
                });
            }
        }, 600000)
    }

    async presentAlert() {
        this.alert = await this.alertCtrl.create({
            message: this.warningText,
            subHeader: this.warningHeader,
            backdropDismiss: false,
            buttons: [
                {
                    text: this.noText,
                    role: 'cancel',
                    handler: () => {
                        this.logOutAutomatic();
                    }
                },
                {
                    text: this.continueText,
                    handler: () => {
                        timeOutCounter = 0;
                        this.increaseCounter();
                    }
                }
            ]
        });
        await this.alert.present();
    }

    async dismissAlert() {
        await this.alertCtrl.dismiss();
    }

    async dismissModal() {
        await this.modalCtrl.dismiss();
    }

    async logOutAutomatic() {
        timeOutCounter = 0;
        expireCounter = 0;
        clearInterval(this.timeInterval);
        clearInterval(this.expireInterval);
        clearInterval(this.expireAccessToken);
        this.clearAllToken();
        if (await this.alertCtrl.getTop()) {
            await this.dismissAlert();
        }
        if (await this.modalCtrl.getTop()) {
            await this.dismissModal();
        }
        const signoutToast = await this.translate.get('auto_signout_toast').toPromise();
        await this.toastPresent(signoutToast);
        this.navCtrl.navigateRoot(['auth/signin']);
        // window.location.reload();
    }

    forceLogout() {
        timeOutCounter = 0;
        expireCounter = 0;
        clearInterval(this.timeInterval);
        clearInterval(this.expireInterval);
        clearInterval(this.expireAccessToken);
        this.clearAllToken();
        this.cookieService.deleteAll('searchItems');
        this.navCtrl.navigateRoot(['auth/signin']);
    }

    async toastPresent(toastMessage) {
        const toast = await this.toastCtrl.create({
            message: toastMessage,
            duration: 3000,
            color: 'dark',
            mode: 'ios'
        });
        toast.present();
    }

    checkNullValue(value) {
        if (value !== '' && typeof (value) !== 'undefined' && value !== null) {
            return true;
        } else {
            return false;
        }
    }

    DateTimeAddT(value: string) {
        if (value !== null && typeof (value) != 'undefined') {
            if (value.includes('T')) {
                return new Date(value);
            } else {
                const temp = value.replace(' ', 'T');
                return new Date(temp);
            }
        } else {
            return new Date(value);
        }
    }

    newDateFormat(value) {
        if (value !== null && typeof (value) != 'undefined') {
            if (value.includes('T')) {
                return moment(value).format('YYYY-MM-DD HH:mm:ss');
            } else {
                return value;
            }
        } else {
            return value;
        }
    }

    getDateTimeRequest(value) {
        const currentTime = new Date();
        return moment(value).format('YYYY-MM-DD') + 'T' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
    }

    getCurrentTimeFormat() {
        const currentTime = new Date();
        return moment(currentTime).format('HH:mm:ss');
    }

    getCurrentDateFormat(value) {
        const dateValue = new Date(value);
        const isValidDate = moment(value, moment.ISO_8601).isValid();

        if (typeof (value) === 'number' || typeof (value) === 'boolean' || typeof (value) === 'undefined' || value === null) {
            return false;
        } else {
            if (dateValue.toString().toLowerCase().includes('invalid') || !isValidDate) {
                return false;
            } else {
                if (value.toString().includes(' ')) {
                    const dateArray = value.toString().split(' ');
                    let dateValue2 = '';
                    for (let i = 0; i < dateArray.length - 1; i++) {
                        dateValue2 += dateArray[i] + ' ';
                    }
                    if (new Date(dateValue2.trim()).toString().toLowerCase().includes('invalid')) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }

    checkCancelledDate(date: string) {
        if (date !== null && typeof (date) !== 'undefined') {
            if (date.includes('9999')) {
                return this.onGoingStr;
            } else {
                return this.newDateFormat(date);
            }
        } else {
            return this.newDateFormat(date);
        }
    }

    getDirValue() {
        if (typeof (localStorage.getItem('set_lng')) === 'undefined' || localStorage.getItem('set_lng') === '' || localStorage.getItem('set_lng') === null) {
            this.rtlMode = false;
            return 'ltr';
        } else {
            if (localStorage.getItem('set_lng') === 'ar') {
                this.rtlMode = true;
                return 'rtl'
            } else {
                this.rtlMode = false;
                return 'ltr';
            }
        }
    }

    getMenu(type, reference): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));
        const param = new HttpParams()
            .set('api-version', '1.0');

        let urlPart = (type == 'Service') ? 'ServiceReference' : 'ContactCode'
        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Menus/DisplayAttributes/' + urlPart + '/' + reference, {
            headers: header, params: param,
        });
    }

    getDynamicMenuList(id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Menus/Display/Id/' + id, {
            headers: header, params: param,
        });
    }

    operationAPIService(reqBody): Observable<any> {
        let reqParam = {};
        reqParam['OperationId'] = reqBody.OperationId;
        if (reqBody.Parameters) {
            for (let list of reqBody.Parameters) {
                list.Value = list.Value.toString();
            }
            reqParam['Parameters'] = reqBody.Parameters;
        }
        reqParam['RequestBody'] = '';
        if (reqBody.RequestBody) {
            reqParam['RequestBody'] = JSON.stringify(reqBody.RequestBody);
        }

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/APIs/Operations', reqParam, {
            headers: header, params: param,
        });
    }

    // userActivityLogger(Activity, ContactCode, Details) {

    //     const reqBody = {
    //         OperationId: '/Users/Activities/ContactCode/{ContactCode}#post',
    //         Parameters: [
    //             {
    //                 Type: 'path',
    //                 Name: 'ContactCode',
    //                 Value: ContactCode
    //             }
    //         ],
    //         RequestBody: {
    //             Activity: Activity,
    //             EntityId: ContactCode,
    //             PersistenceLevel: 1,
    //             Details: Details,
    //             SubjectEntityId: ContactCode,
    //             SubjectEntityType: "CONTACT",
    //         }
    //     };
    //     this.operationAPIService(reqBody).subscribe(result => {

    //     }, error => {

    //     });
    // }

    userActivityLogger(Activity, ContactCode, Details) {

        const reqBody = {
            Activity: Activity,
            EntityId: ContactCode,
            PersistenceLevel: 1,
            Details: Details,
            SubjectEntityId: ContactCode,
            SubjectEntityType: "CONTACT",
        };

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Users/Activities/Contact/' + ContactCode, this.convertRequestBody(reqBody), {
            headers: header, params: param
        }).subscribe((result: any) => {

        }, error => {

        });
    }

    getDateTimeWithString(format, value) {
        return moment(value).format(format);
    }

    getFormValue(value) {
        if (value === '' || typeof (value) === 'undefined') {
            return null;
        } else {
            return value
        }
    }

    convertRequestBody(data) {
        for (var key in data) {
            if (data[key] === '' || typeof (data[key]) === 'undefined') {
                data[key] = null;
            }
        }

        return data;
    }

    getCurrencyConfiguration(value) {
        const currencyType = this.currencyConfig.id;
        const locale = this.currencyConfig.locale;
        let amount;
        if (typeof (value) === 'string') {
            amount = Number(value);
        } else {
            amount = value;
        }

        let navigatorLangauge;
        if (locale && locale !== 'undefined') {
            navigatorLangauge = locale;
        }

        var formatter = new Intl.NumberFormat(navigatorLangauge, {
            style: 'currency',
            currency: currencyType
        });

        return formatter.format(amount);
    }

    getCurrencySymbol() {
        const currency = this.currencyConfig.id;
        const locale = this.currencyConfig.locale;
        return (0).toLocaleString(
            locale,
            {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        ).replace(/\d/g, '').trim()
    }

    getSeparator(locale, separatorType) {
        const numberWithGroupAndDecimalSeparator = 1000.1;
        return Intl.NumberFormat(locale)
            .formatToParts(numberWithGroupAndDecimalSeparator)
            .find(part => part.type === separatorType)
            .value;
    }

    getNumberFormatValue(value) {
        let amount;
        if (typeof (value) === 'string') {
            amount = Number(value);
        } else {
            amount = value;
        }

        const currrencyConfiguration = localStorage.getItem('currrencyConfiguration');
        if (currrencyConfiguration) {
            const currencyConfig = this.ConvertKeysToLowerCase(JSON.parse(currrencyConfiguration));
            var formatter = new Intl.NumberFormat(currencyConfig.locale);
            return formatter.format(amount);
        } else {
            return amount;
        }
    }

    getAmountFromCurrency(value) {
        const symbol = this.getCurrencySymbol();
        return value.replace(symbol, '');
    }

    getCurrencyMatchingData(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/Currencies', {
            headers: header, params: param
        });
    }

    getCurrencyData(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/Currencies/AccountCode/' + ContactCode, {
            headers: header, params: param
        });
    }

    public getAuthorization(Resource: string, IncludceChildren?: boolean): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        let param = new HttpParams()

        if (IncludceChildren !== undefined) {
            param = new HttpParams()
                .set('api-version', '1.2')
                .append('Resource', Resource)
                .append('IncludeChildren', IncludceChildren);
        } else {
            param = new HttpParams()
                .set('api-version', '1.2')
                .append('Resource', Resource);
        }

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Authorisations/', {
            headers: header, params: param
        });
    }

    getTranslateKeyFromObject(object) {
        let newObject = {};
        for (var key in object) {
            let keyStr = '';
            for (let i = 0; i < key.length; i++) {
                if (i == 0) {
                    keyStr += key[i].toLowerCase();
                } else {
                    if (key[i] === key[i].toUpperCase()) {
                        keyStr += '_' + key[i].toLowerCase();
                    } else {
                        keyStr += key[i].toLowerCase();
                    }
                }
            }
            newObject[keyStr] = object[key];
        }

        return newObject;
    }

    getGridOptions(array) {
        let sourceArray = [];
        let columnArray = [];
        let widthArray = {};
        let gridList = {};
        let tranList = {};
        for (var key in array) {
            let keyStr = '';
            let tranStr = '';
            for (let i = 0; i < key.length; i++) {
                if (i == 0) {
                    keyStr += key[i].toLowerCase();
                    tranStr += key[i];
                } else {
                    if (key[i] === key[i].toUpperCase()) {
                        keyStr += '_' + key[i].toLowerCase();
                        tranStr += ' ' + key[i];
                    } else {
                        keyStr += key[i].toLowerCase();
                        tranStr += key[i];
                    }
                }
            }
            const source = { name: keyStr, type: 'string' };
            sourceArray.push(source);

            const column = { text: '', datafield: keyStr };
            columnArray.push(column);

            widthArray[keyStr] = 0;

            gridList[keyStr] = 'list.' + keyStr.replace(/_/g, '');
            tranList[keyStr] = tranStr;
        }

        console.log('sourceArray', JSON.stringify(sourceArray));
        console.log('columnArray', JSON.stringify(columnArray));
        console.log('widthArray', JSON.stringify(widthArray));
        console.log('gridList', JSON.stringify(gridList));
        console.log('tranList', JSON.stringify(tranList));
    }

    getKeyOptions(object) {
        let strArray = [];
        for (var key in object) {
            let keyStr = '';
            for (let i = 0; i < key.length; i++) {
                if (i == 0) {
                    keyStr += key[i].toLowerCase();
                } else {
                    if (key[i] === key[i].toUpperCase()) {
                        keyStr += '_' + key[i].toLowerCase();
                    } else {
                        keyStr += key[i].toLowerCase();
                    }
                }
            }
            strArray.push(keyStr);
        }

        console.log('strArray', JSON.stringify(strArray));
    }

    getBusinessUnits(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/BusinessUnits', {
            headers: header, params: param
        });
    }
}
