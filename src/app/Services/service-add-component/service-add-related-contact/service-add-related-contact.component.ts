import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ServiceAddRelatedContactService } from './services/service-add-related-contact.service';

@Component({
  selector: 'app-service-add-related-contact',
  templateUrl: './service-add-related-contact.component.html',
  styleUrls: ['./service-add-related-contact.component.scss'],
})
export class ServiceAddRelatedContactComponent implements OnInit {

  @Output('ServiceAddRelatedContactComponent') ServiceAddRelatedContactComponent: Subject<any> = new Subject<any>();

  
  aggregationPoint: boolean = false;
  allocationType: string = '';

  saveState: boolean = false;

  titleList = [
    { Id: 'Mr', Value: 'Mr' },
    { Id: 'Mrs', Value: 'Mrs' },
    { Id: 'Miss', Value: 'Miss' },
    { Id: 'Ms', Value: 'Ms' },
    { Id: 'Dr', Value: 'Dr' },
    { Id: 'Mr/s', Value: 'Mr/s' },
    { Id: 'Count', Value: 'Count' },
    { Id: 'Fr', Value: 'Fr' },
    { Id: 'Judge', Value: 'Judge' },
    { Id: 'Lady', Value: 'Lady' },
    { Id: 'Lord', Value: 'Lord' },
    { Id: 'Major', Value: 'Major' },
    { Id: 'MP', Value: 'MP' },
    { Id: 'Prof', Value: 'Prof' },
    { Id: 'Rev', Value: 'Rev' },
    { Id: 'Sir', Value: 'Sir' },
  ];

  relationShipList = [];

  addForm: UntypedFormGroup;

  timezoneList = [];
  filteredTimezonList = [];
  availableCall: boolean = false;
  showSpinner: boolean = false;
  showClear: boolean = false;
  spinner: any = {};

  userConfiguration: any = {};
  groupState: string = 'create';
  currentUser: any;

  suggestPassword: string = '';
  getFormDataState: boolean = false;

  passwordStrengStr: string = 'password_weak';

  reasonStr: any = {};
  pswLoginState: boolean = false;
  showAuth: boolean = true;

  loginId: string = '';
  timeZoneId: any;
  availConfigureLogin: boolean = false;

  genderList = [
    { id: 'Male', name: 'male' },
    { id: 'Female', name: 'female' },
    { id: 'Other', name: 'other' }
  ];


  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private usersService: ServiceAddRelatedContactService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {
    this.tranService.translaterService();
    
    this.addForm = this.formBuilder.group({
      title: [''],
      firstName: ['',],
      surName: ['', Validators.required],
      gender: ['',],
      dob: ['',],
      email: ['', [Validators.email]],
      phone: ['', Validators.pattern('[+]?[0-9]{9,}')],
      relationship: ['', Validators.required],
      timeZone: ['', Validators.required],


      Email: ['', [Validators.email, Validators.required]],
      LoginId: ['', Validators.required],
      MobilePhone: [''],
      TemporaryPassword: ['', Validators.required],
    });

    this.loadAuth();

    this.addForm.get('timeZone').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
      if (result) {
        if (this.availableCall) {
          this.getTimeZoneSearch(result);
          if (this.availableCall) {
            this.spinner.timezone = true;
            await this.getTimeZoneSearch(result);
            this.spinner.timezone = false;
            this.filteredTimezonList = this.filter(result);
          }
          this.availableCall = true;
        }
      }

      this.availableCall = true;
    });

    this.addForm.get('timeZone').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
      if (result) {
        this.showClear = true;
      } else {
        this.showClear = false;
      }
    });

    this.addForm.get('TemporaryPassword').valueChanges.pipe(debounceTime(1000)).subscribe((password: any) => {
      if (password) {
        if (password.length % 3 === 0) {
          this.passwordStrengthCheck();
        }
      }
    });

    this.addForm.get('MobilePhone').valueChanges.subscribe((password: any) => {
      if (password) {
        this.addForm.get('MobilePhone').setErrors({ invalid: true });
      }
    });

    this.addForm.get('Email').valueChanges.subscribe((email: any) => {
      if (email) {
        this.addForm.get('Email').setErrors({ invalid: true });
      } else {
        this.addForm.get('Email').setErrors(null);
      }
    });

    this.addForm.get('LoginId').valueChanges.subscribe((login: any) => {
      if (login) {
        this.addForm.get('LoginId').setErrors({ invalid: true });
      }
    });

  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.timezoneList.filter(option => option.country.toLowerCase().includes(filterValue));
  }

  async ngOnInit() {
    console.log('service add related contact component');
    await this.getReslationShipLists();

    await this.getConfiguration();
    await this.getTimeZoneDefault();
    await this.getNextLoginId();
    this.availConfigureLogin = true;
  }

  // async getNextLoginId() {
  //   const reqBody = {
  //     OperationId: '/Contacts/NextId#post',
  //   }
  //   try {
  //     const result = await this.globService.operationAPIService(reqBody).toPromise();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
      
  //     this.loginId = convResult.userid;
  //   } catch (error) {
  //     this.tranService.errorMessage(error);
  //   }
  // }

  async getNextLoginId() {
    try {
      const result = await this.usersService.postNextId().toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      this.loginId = convResult.userid;
    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  async getReslationShipLists() {
    await this.loading.present();
    this.usersService.getRelationshipTypes().subscribe(async (result: any) => {
      await this.loading.dismiss();

      const convResult = this.globService.ConvertKeysToLowerCase(result);

      this.relationShipList = [];
      for (let list of convResult) {
        if (list.visible) {
          this.relationShipList.push(list);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getTimeZoneDefault() {

    await this.loading.present();
    this.usersService.getDefaultTimeZone().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);

      this.addForm.get('timeZone').setValue(convResult[0].name + ' [' + convResult[0].country + ']');
      this.timeZoneId = convResult[0].id;

    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getTimeZoneSearch(value) {
    const reqData = {
      SearchString: value,
      SkipRecords: 0,
      TakeRecords: 10
    }
    await this.loading.present();

    this.usersService.getSearchTimeZone(reqData).subscribe(async (result: any) => {
      await this.loading.dismiss();

      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.timezoneList = convResult;

    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  async addFormSubmit() {
    if (this.addForm.valid) {
      const reqData = {
        Id: this.loginId,
        Mobile: this.addForm.get('phone').value,
        Email: this.addForm.get('email').value,
        FamilyName: this.addForm.get('surName').value,
        FirstName: this.addForm.get('firstName').value,
        Title: this.addForm.get('title').value,
        Gender: this.addForm.get('gender').value,
        DateOfBirth: this.addForm.get('dob').value,
        TimezoneId: this.timeZoneId,
        RelationshipTypes: [],
        AuthenticationLoginId: this.addForm.get('LoginId').value,
        AuthenticationMobile: this.addForm.get('MobilePhone').value,
        AuthenticationEmail: this.addForm.get('Email').value,
        ChangePasswordOnFirstLogin: this.pswLoginState,
        Password: this.addForm.get('TemporaryPassword').value,
      };

      for (let list of this.addForm.get('relationship').value) {
        reqData.RelationshipTypes.push({ Id: list });
      }

      this.ServiceAddRelatedContactComponent.next(this.globService.convertRequestBody(reqData));

    }
  }

  get f() {
    return this.addForm.controls;
  }

  async optionSelected(event) {
    for (let list of this.filteredTimezonList) {
      if (list.id === event.option.value) {
        this.addForm.get('timeZone').setValue(list.name + ' [' + list.country + ']');
        this.timeZoneId = list.id;
      }
    }
    this.availableCall = false;
  }

  clearSearch() {
    this.showClear = false;
    this.filteredTimezonList = [];
    this.addForm.get('timeZone').reset();
  }

  // async generatePassword() {
  //   await this.loading.present();
  //   const reqBody = {
  //     OperationId: '/Users/Passwords/Suggestion#get'
  //   }
  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     this.openPasswordSuggestionAlert(convResult.password);
  //   }, async (error: any) => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async generatePassword() {
    await this.loading.present();
    this.usersService.generatePassword('/Users/Passwords/Suggestion').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.openPasswordSuggestionAlert(convResult.password);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async openPasswordSuggestionAlert(password) {
    const passwordSuggestStr = await this.tranService.convertText('password_suggest').toPromise();
    const alert = await this.alertCtrl.create({
      message: password,
      subHeader: passwordSuggestStr,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.addForm.get('TemporaryPassword').setValue(password);
            this.passwordStrengthCheck();
          }
        }
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  focusOnField(fieldName) {

  }

  focusOutField(fieldName) {
    switch (fieldName) {
      case 'email':
        if (this.addForm.get('email').value && !this.addForm.get('email').hasError('email')) {
          if (this.userConfiguration.logindefault.toLowerCase().includes('email')) {
            const loginValue = this.addForm.get('LoginId').value;
            if (typeof (loginValue) === 'undefined' || loginValue === 'null' || loginValue === '') {
              this.addForm.get('LoginId').setValue(this.addForm.get('Email').value);
            }
          }
          this.checkEmailValidate('email');
        }
        break;
      case 'authEmail':
        if (this.addForm.get('Email').value && !this.addForm.get('Email').hasError('email')) {
          if (this.userConfiguration.logindefault.toLowerCase().includes('email')) {
            const loginValue = this.addForm.get('LoginId').value;
            if (typeof (loginValue) === 'undefined' || loginValue === 'null' || loginValue === '') {
              this.addForm.get('LoginId').setValue(this.addForm.get('Email').value);
            }
          }
          if (!this.checkAvailableCall('email')) {
            this.checkEmailValidate('authEmail');
          }
        }
        break;
      case 'mobile':
        if (this.addForm.get('MobilePhone').value) {
          if (this.userConfiguration.logindefault.toLowerCase().includes('mobile')) {
            const loginValue = this.addForm.get('LoginId').value;
            if (typeof (loginValue) === 'undefined' || loginValue === 'null' || loginValue === '') {
              this.addForm.get('LoginId').setValue(this.addForm.get('MobilePhone').value);
            }
          }
          if (!this.checkAvailableCall('mobile')) {
            this.checkMobileValidate();
          }
        }
        break;
      case 'password':
        if (!this.addForm.get('TemporaryPassword').valid) {
          this.tranService.errorToastMessage(this.userConfiguration.passwordmessage);
        }
        if (this.addForm.get('TemporaryPassword').value && this.addForm.get('TemporaryPassword').value.length % 3 !== 0) {
          this.passwordStrengthCheck();
        }
        break;
      case 'loginId':
        if (!this.checkAvailableCall('loginId')) {
          this.checkLoginId();
        }
        break;

      default:
        break;
    }
  }

  // async checkLoginId() {
  //   this.spinner.loginid = true;
  //   const reqBody = {
  //     OperationId: '/Users/Authentication/LoginId/Unique/{LoginId}#get',
  //     Parameters: [
  //       {
  //         Type: 'path',
  //         Name: 'LoginId',
  //         Value: this.globService.getFormValue(this.addForm.get('LoginId').value)
  //       }
  //     ]
  //   };

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     this.spinner.loginid = false;
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     if (convResult.used) {
  //       this.tranService.errorToastOnly('invalid_login_id');
  //       this.addForm.get('LoginId').setErrors({ 'invalid': true });
  //     } else {
  //       this.tranService.errorToastOnly('valid_login');
  //       this.addForm.get('LoginId').setErrors(null);
  //     }
  //   }, async (error: any) => {
  //     this.spinner.loginid = false;
      
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(console.error());
  //   });

  // }

  async checkLoginId() {
    console.log('loginId', this.globService.getFormValue(this.addForm.get('LoginId').value));
    this.spinner.loginid = true;
    this.usersService.checkLoginId('/Users/Authentication/LoginId/' + this.globService.getFormValue(this.addForm.get('LoginId').value) + '/Unique').subscribe(async (result: any) => {
      this.spinner.loginid = false;
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      if (convResult.used) {
        this.tranService.errorToastOnly('invalid_login_id');
        this.addForm.get('LoginId').setErrors({ 'invalid': true });
      } else {
        this.tranService.errorToastOnly('valid_login');
        this.addForm.get('LoginId').setErrors(null);
      }
    }, async (error: any) => {
      this.spinner.loginid = false;
      
      await this.loading.dismiss();
      this.tranService.errorMessage(console.error());
    });

  }

  // async checkEmailValidate(emailType) {
  //   if (emailType === 'authEmail') {
  //     this.spinner.authEmail = true;
  //     const reqBody = {
  //       OperationId: '/Users/Authentication/Email/Unique/{Email}#get',
  //       Parameters: [
  //         {
  //           Type: 'path',
  //           Name: 'Email',
  //           Value: this.globService.getFormValue(this.addForm.get('Email').value)
  //         }
  //       ]
  //     };

  //     this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //       this.spinner.authEmail = false;
  //       const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //       if (convResult.used) {
  //         this.tranService.errorToastOnly('invalid_authentication_email');
  //         this.addForm.get('Email').setErrors({ 'invalid': true });
  //       } else {
  //         this.tranService.errorToastOnly('valid_email');
  //         this.addForm.get('Email').setErrors(null);
  //       }
  //     }, async (error: any) => {
  //       this.spinner.authEmail = false;
        
  //       await this.loading.dismiss();
  //       this.tranService.errorMessage(console.error());
  //     });
  //   } else if (emailType === 'email') {
  //     this.spinner.email = true;
  //     const reqBody = {
  //       OperationId: '/Users/Authentication/Email/Unique/{Email}#get',
  //       Parameters: [
  //         {
  //           Type: 'path',
  //           Name: 'Email',
  //           Value: this.globService.getFormValue(this.addForm.get('email').value)
  //         }
  //       ]
  //     };

  //     this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //       this.spinner.email = false;
  //       const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //       if (convResult.used) {
  //         this.tranService.errorToastOnly('invalid_authentication_email');
  //         this.addForm.get('email').setErrors({ 'invalid': true });
  //       } else {
  //         this.tranService.errorToastOnly('valid_email');
  //         this.addForm.get('email').setErrors(null);
  //       }
  //     }, async (error: any) => {
  //       this.spinner.email = false;
        
  //       await this.loading.dismiss();
  //       this.tranService.errorMessage(console.error());
  //     });
  //   }
  // }

  async checkEmailValidate(emailType) {
    if (emailType === 'authEmail') {
      this.spinner.authEmail = true;
      this.usersService.checkEmailValidate('/Users/Authentication/Email/' + this.globService.getFormValue(this.addForm.get('Email').value)  +'/Unique').subscribe(async (result: any) => {
        this.spinner.authEmail = false;
        const convResult = this.globService.ConvertKeysToLowerCase(result);
        if (convResult.used) {
          this.tranService.errorToastOnly('invalid_authentication_email');
          this.addForm.get('Email').setErrors({ 'invalid': true });
        } else {
          this.tranService.errorToastOnly('valid_email');
          this.addForm.get('Email').setErrors(null);
        }
      }, async (error: any) => {
        this.spinner.authEmail = false;
        
        await this.loading.dismiss();
        this.tranService.errorMessage(console.error());
      });
    } else if (emailType === 'email') {
      this.spinner.email = true;
      this.usersService.checkEmailValidate('/Users/Authentication/Email/' + this.globService.getFormValue(this.addForm.get('Email').value)  +'/Unique').subscribe(async (result: any) => {
        this.spinner.email = false;
        const convResult = JSON.parse(result);
        if (convResult.used) {
          this.tranService.errorToastOnly('invalid_authentication_email');
          this.addForm.get('email').setErrors({ 'invalid': true });
        } else {
          this.tranService.errorToastOnly('valid_email');
          this.addForm.get('email').setErrors(null);
        }
      }, async (error: any) => {
        this.spinner.email = false;
        
        await this.loading.dismiss();
        this.tranService.errorMessage(console.error());
      });
    }
  }

  // async getConfiguration() {
  //   try {
  //     const reqBody = {
  //       OperationId: '/Users/ServiceProviderUsers/Configuration#get'
  //     }
  //     const result = await this.globService.operationAPIService(reqBody).toPromise();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     this.userConfiguration = convResult;

  //   } catch (error) {
      
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   }
  // }

  async getConfiguration() {
    try {
      const result = await this.usersService.getConfiguration('/Users/ServiceProviderUsers/Configuration').toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.userConfiguration = convResult;

    } catch (error) {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  checkAvailableCall(type) {
    let returnType = false;
    if (this.groupState === 'edit') {
      switch (type) {
        case 'loginId':
          if (!this.addForm.get('LoginId').valid && this.addForm.get('LoginId').value && this.currentUser.authenticationloginid !== this.addForm.get('LoginId').value) {
            returnType = false;
          } else {
            returnType = true;
            this.addForm.get('LoginId').setErrors(null);
          }
          break;
        case 'email':
          if (!this.addForm.get('Email').hasError('email') && this.addForm.get('Email').value && this.currentUser.authenticationemail !== this.addForm.get('Email').value) {
            returnType = false;
          } else {
            returnType = true;
            this.addForm.get('Email').setErrors(null);
          }
          break;
        case 'mobile':
          if (!this.addForm.get('MobilePhone').valid && this.addForm.get('MobilePhone').value && this.currentUser.authenticationmobile !== this.addForm.get('MobilePhone').value) {
            returnType = false;
          } else {
            returnType = true;
            this.addForm.get('MobilePhone').setErrors(null);
          }
          break;

        default:
          break;
      }
    } else if (this.groupState === 'create') {
      switch (type) {
        case 'loginId':
          if (!this.addForm.get('LoginId').valid && this.addForm.get('LoginId').value) {
            returnType = false;
          } else {
            returnType = true;
            this.addForm.get('LoginId').setErrors(null);
          }
          break;
        case 'email':
          if (!this.addForm.get('Email').valid && this.addForm.get('Email').value) {
            returnType = false;
          } else {
            returnType = true;
            this.addForm.get('Email').setErrors(null);
          }
          break;
        case 'mobile':
          if (!this.addForm.get('MobilePhone').valid && this.addForm.get('MobilePhone').value) {
            returnType = false;
          } else {
            returnType = true;
            this.addForm.get('MobilePhone').setErrors(null);
          }
          break;

        default:
          break;
      }
    }

    return returnType;
  }

  // async checkMobileValidate() {
  //   this.spinner.mobile = true;
  //   const reqBody = {
  //     OperationId: '/Users/Authentication/Mobile/Unique/{Mobile}#get',
  //     Parameters: [
  //       {
  //         Type: 'path',
  //         Name: 'Mobile',
  //         Value: this.globService.getFormValue(this.addForm.get('MobilePhone').value)
  //       }
  //     ]
  //   };

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     this.spinner.mobile = false;
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
      
  //     if (convResult.used) {
  //       this.tranService.errorToastOnly('invalid_authentication_mobile');
  //       this.addForm.get('MobilePhone').setErrors({ 'invalid': true });
  //     } else {
  //       this.tranService.errorToastOnly('valid_mobile');
  //       this.addForm.get('MobilePhone').setErrors(null);
  //     }
  //   }, async (error: any) => {
  //     this.spinner.mobile = false;
      
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(console.error());
  //   });
  // }

  async checkMobileValidate() {
    this.spinner.mobile = true;
    this.usersService.checkMobileValidate('/Users/Authentication/Mobile/'+ this.globService.getFormValue(this.addForm.get('MobilePhone').value) +'/Unique').subscribe(async (result: any) => {
      this.spinner.mobile = false;
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      if (convResult.used) {
        this.tranService.errorToastOnly('invalid_authentication_mobile');
        this.addForm.get('MobilePhone').setErrors({ 'invalid': true });
      } else {
        this.tranService.errorToastOnly('valid_mobile');
        this.addForm.get('MobilePhone').setErrors(null);
      }
    }, async (error: any) => {
      this.spinner.mobile = false;
      
      await this.loading.dismiss();
      this.tranService.errorMessage(console.error());
    });
  }

  // passwordStrengthCheck() {
  //   const reqBody = {
  //     OperationId: '/Users/Passwords/CheckComplexity/Password/{Password}#post',
  //     Parameters: [
  //       {
  //         Type: 'path',
  //         Name: 'Password',
  //         Value: this.globService.getFormValue(this.addForm.get('TemporaryPassword').value)
  //       }
  //     ]
  //   };

  //   this.spinner.password = true;
  //   this.globService.operationAPIService(reqBody).subscribe((result: any) => {
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     this.spinner.password = false;
  //     if (convResult.result.toLowerCase() === 'failed') {
  //       this.addForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
  //       this.reasonStr.password = convResult.reason;
  //       this.passwordStrengStr = 'password_failed';
  //     } else {
  //       switch (this.userConfiguration.minimumpasswordstrength) {
  //         case 'Medium':
  //           if (convResult.passwordstrength.toLowerCase() === 'medium') {
  //             this.passwordStrengStr = 'password_medium';
  //           } else if (convResult.passwordstrength.toLowerCase() === 'strong') {
  //             this.passwordStrengStr = 'password_strong';
  //           } else {
  //             this.addForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
  //             this.passwordStrengStr = 'password_weak';
  //           }
  //           break;
  //         case 'Strong':
  //           if (convResult.passwordstrength.toLowerCase() === 'strong') {
  //             this.passwordStrengStr = 'password_strong';
  //           } else {
  //             if (convResult.passwordstrength.toLowerCase() === 'medium') {
  //               this.addForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
  //               this.passwordStrengStr = 'password_medium';
  //             } else {
  //               this.addForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
  //               this.passwordStrengStr = 'password_weak';
  //             }
  //           }
  //           break;

  //         default:
  //           break;
  //       }
  //     }

  //     if (this.addForm.get('TemporaryPassword').valid && this.groupState === 'edit') {
  //       this.passwordChangeAlert();
  //     }

  //   }, (error: any) => {
      
  //     this.tranService.errorMessage(error);
  //   });
  // }


  passwordStrengthCheck() {
    this.spinner.password = true;
    this.usersService.postPasswordStrengthCheck(this.globService.getFormValue(this.addForm.get('TemporaryPassword').value), '/Users/Passwords/CheckComplexity/Password/').subscribe((result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.spinner.password = false;
      if (convResult.result.toLowerCase() === 'failed') {
        this.addForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
        this.reasonStr.password = convResult.reason;
        this.passwordStrengStr = 'password_failed';
      } else {
        switch (this.userConfiguration.minimumpasswordstrength) {
          case 'Medium':
            if (convResult.passwordstrength.toLowerCase() === 'medium') {
              this.passwordStrengStr = 'password_medium';
            } else if (convResult.passwordstrength.toLowerCase() === 'strong') {
              this.passwordStrengStr = 'password_strong';
            } else {
              this.addForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
              this.passwordStrengStr = 'password_weak';
            }
            break;
          case 'Strong':
            if (convResult.passwordstrength.toLowerCase() === 'strong') {
              this.passwordStrengStr = 'password_strong';
            } else {
              if (convResult.passwordstrength.toLowerCase() === 'medium') {
                this.addForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
                this.passwordStrengStr = 'password_medium';
              } else {
                this.addForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
                this.passwordStrengStr = 'password_weak';
              }
            }
            break;

          default:
            break;
        }
      }

      if (this.addForm.get('TemporaryPassword').valid && this.groupState === 'edit') {
        this.passwordChangeAlert();
      }

    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });
  }

  async passwordChangeAlert() {
    const passwordSuggestStr = await this.tranService.convertText('password_change_warning').toPromise();
    const warningStr = await this.tranService.convertText('want_continue').toPromise();
    const alert = await this.alertCtrl.create({
      message: warningStr,
      subHeader: passwordSuggestStr,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            
            this.passwordFieldReset();
          }
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  passwordFieldReset() {
    this.addForm.get('TemporaryPassword').reset();
    this.passwordStrengStr = '';
  }

  changePasswordLogin(event) {
    this.pswLoginState = event.checked;
  }

  loadAuth() {
    this.showAuth = !this.showAuth;

    if (this.showAuth) {
      this.addForm.get('Email').setValidators([Validators.required, Validators.email]);
      this.addForm.get('LoginId').setValidators(Validators.required);
      this.addForm.get('TemporaryPassword').setValidators(Validators.required);
      this.addForm.get('Email').updateValueAndValidity();
      this.addForm.get('LoginId').updateValueAndValidity();
      this.addForm.get('TemporaryPassword').updateValueAndValidity();

      if (this.addForm.get('email').value) {
        this.addForm.get('Email').setValue(this.addForm.get('email').value);
        this.checkEmailValidate('authEmail');
      }
      if (this.addForm.get('surName').value) {
        this.addForm.get('LoginId').setValue(this.addForm.get('surName').value);
        this.checkLoginId();
      } else {
        this.addForm.get('LoginId').setValue(this.loginId);
        this.checkLoginId();
      }
      if (this.addForm.get('phone').value) {
        this.addForm.get('MobilePhone').setValue(this.addForm.get('phone').value);
        this.checkMobileValidate();
      }
    } else {
      this.addForm.get('Email').clearValidators();
      this.addForm.get('LoginId').clearValidators();
      this.addForm.get('TemporaryPassword').clearValidators();

      this.addForm.get('Email').updateValueAndValidity();
      this.addForm.get('LoginId').updateValueAndValidity();
      this.addForm.get('TemporaryPassword').updateValueAndValidity();

      this.addForm.get('Email').reset();
      this.addForm.get('LoginId').reset();
      this.addForm.get('TemporaryPassword').reset();
      this.addForm.get('MobilePhone').reset();

    }
  }


  prevForm() {
    this.ServiceAddRelatedContactComponent.next('eighth');
  }

  nextForm() {
    document.getElementById('relatedContactSubmitButton').click();
  }

}
