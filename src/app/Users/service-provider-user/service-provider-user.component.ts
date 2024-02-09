import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ServiceProviderUserService } from './services/service-provider-user-service';

import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { AlertService } from 'src/services/alert-service.service';
import { Paging } from 'src/app/model';

@Component({
  selector: 'app-service-provider-user',
  templateUrl: './service-provider-user.component.html',
  styleUrls: ['./service-provider-user.component.scss'],
})
export class ServiceProviderUserComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true;

  @Output('UserComponent') public UserComponent: EventEmitter<string> = new EventEmitter<string>();

  groupList: any[] = [];
  groupForm: UntypedFormGroup;
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = ['Text'];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Update', 'Delete'], toolBar: ['Create','Refresh', 'ExportExcel'] };
  csvFileName: string = '';
  eventParam = new Paging();  

  UserId: string = '';

  groupState: string = 'view';
  currentGroup: any;

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  userParam = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
  };

  totalLength: any;

  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;

  titleList = [
    { id: 'Mr', name: 'mr' },
    { id: 'Mrs', name: 'mrs' },
    { id: 'Miss', name: 'miss' },
    { id: 'Ms', name: 'ms' },
    { id: 'Dr', name: 'dr' },
    { id: 'Mr/s', name: 'mr_s' },
    { id: 'Count', name: 'count' },
    { id: 'Fr', name: 'fr' },
    { id: 'Judge', name: 'judge' },
    { id: 'Lady', name: 'lady' },
    { id: 'Lord', name: 'lord' },
    { id: 'Major', name: 'major' },
    { id: 'MP', name: 'mp' },
    { id: 'Prof', name: 'prof' },
    { id: 'Rev', name: 'rev' },
    { id: 'Sir', name: 'sir' }
  ];

  genderList = [
    { id: 'Male', name: 'male' },
    { id: 'Female', name: 'female' },
    { id: 'Undefined', name: 'undefined' }
  ];

  businessList = [
  ];

  roleList = [];

  teamList = [];

  passwordList = [
    { id: 'Display', value: 'Display' },
    { id: 'Manual', value: 'Manual' },
    { id: 'Email', value: 'Email' },
    { id: 'SMS', value: 'SMS' },
  ];

  phoneState: boolean = false;
  addressState: boolean = false;
  teamState: boolean = false;

  userConfiguration: any = {};

  suggestPassword: string = '';
  getFormDataState: boolean = false;

  passwordStrengStr: string = 'password_weak';

  reasonStr: any = {};
  spinner: any = {};
  showClear: boolean = false;

  pswLoginState: boolean = false;

  timezoneList = [];
  filteredTimezonList = [];
  availableCall: boolean = false;
  showSpinner: boolean = false;

  authDetailData: any = {};
  formSubmitState: boolean = false;
  timeZoneId: string = '';
  authAvailable: boolean = false;
  defaultBusinessList = [];
  defaultRoleList = [];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private userService: ServiceProviderUserService,
    private alertService: AlertService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.configInitialValues();
    this.groupForm = this.formBuilder.group({
      UserId: [''],
      FamilyName: ['', Validators.required],
      FirstName: ['', Validators.required],
      Title: ['',],
      DateOfBirth: ['',],
      Gender: ['',],
      EmployeeReference: ['',],
      BusinessUnits: ['', Validators.required],
      Roles: ['', Validators.required],
      Teams: ['', Validators.required],
      timeZone: ['', Validators.required],
      DefaultBusinessUnits: ['', Validators.required],
      DefaultRoles: ['', Validators.required],
    });

    this.groupForm.get('timeZone').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
      if (result) {
        if (this.availableCall) {
          this.spinner.timezone = true;
          this.getTimeZoneSearch(result);
        }
      }

      this.availableCall = true;
    });

    this.groupForm.get('timeZone').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
      if (result) {
        this.showClear = true;
      } else {
        this.showClear = false;
      }
    });

    this.groupForm.get('BusinessUnits').valueChanges.subscribe((result: any) => {
      if (result) {
        this.defaultBusinessList = this.businessList.filter(it => result.filter(item => item === it.id).length > 0);
      } else {
        this.defaultBusinessList = [];
      }
    });

    this.groupForm.get('Roles').valueChanges.subscribe((result: any) => {
      if (result) {
        this.defaultRoleList = this.roleList.filter(it => result.filter(item => item === it.name).length > 0);
      } else {
        this.defaultRoleList = [];
      }
    });

  }

  private configInitialValues(): void {
    this.columns = [
      'Id',
      'Name',
      'AuthenticationEmail',
      'Role',
      'AuthenticationStatus',
    ];
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.timezoneList.filter(option => option.country.toLowerCase().includes(filterValue));
  }

  async ngOnInit() {
    this.csvFileName = "Service Provider User";
    await this.getPermission();
  }
  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getGroupLists()
    }
  }
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Users/ServiceProviders', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Users/ServiceProviders', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getGroupLists();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.backMain();
            }, 1000);
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.backMain();
            }, 1000);
          }
        }
      });
  }
  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getGroupLists();
  }
  async getConfiguration() {
    await this.loading.present();
    this.userService.userConfiguration().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.userConfiguration = convResult;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getNextUserId() {
    await this.loading.present();
    this.userService.getNextUserId().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.UserId = convResult.userid;
      this.groupForm.get('UserId').setValue(convResult.userid);
      this.groupForm.get('UserId').disable();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }

  async getGroupLists() {
    this.groupState = 'view';
    this.groupList = [];
    await this.loading.present();
    this.userService.getAllUsers({
      ...this.eventParam
    })
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_transactions');
          } else {
            this.totalLength = result.Count;
            this.groupList = result.Users;            
            this.groupList.map(userObj => {              
              userObj.Role = userObj.Roles?.map(role=> role.Name).join(', ');
            });
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })

    this.Refresh_ = this.Refresh;
  }

  async getBusinessLists() {
    this.businessList = [];
    await this.loading.present();
    this.userService.getBusinessLists().subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.businessList = this.globService.ConvertKeysToLowerCase(result);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }

  async getTeamLists() {
    this.teamList = [];
    await this.loading.present();
    this.userService.getTeamLists().subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.teamList = this.globService.ConvertKeysToLowerCase(result);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }

  async getRoleLists() {
    this.roleList = [];
    await this.loading.present();
    this.userService.getRoleLists().subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.roleList = this.globService.ConvertKeysToLowerCase(result);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }

  backMain() {
    if(this.columns.indexOf('Action') != -1)
      this.columns.splice(this.columns.indexOf('Action'), 1);
    this.groupState = 'view';
  }

  createSubmitTrigger() {
    document.getElementById('create-submit').click();
  }

  submitForm() {
    if (this.groupState === 'create') {
      this.createUser();
    } else if (this.groupState === 'edit') {
      this.updateUser();
    }
    this.globService.serviceProviderUserSubject.next('formSubmit');
  }

  async createUser() {
    if (this.groupForm.valid) {
      let reqParam = {
        Id: this.groupForm.get('UserId').value,
        AuthenticationLoginId: this.authDetailData?.LoginId,
        AuthenticationMobile: this.authDetailData?.MobilePhone,
        AuthenticationEmail: this.authDetailData?.Email,
        FamilyName: this.groupForm.get('FamilyName').value,
        FirstName: this.groupForm.get('FirstName').value,
        Title: this.groupForm.get('Title').value,
        DateOfBirth: this.groupForm.get('DateOfBirth').value,
        Gender: this.groupForm.get('Gender').value,
        EmployeeReference: this.groupForm.get('EmployeeReference').value,
        ChangePasswordOnFirstLogin: this.authDetailData?.ChangePasswordOnFirstLogin,
        MFAEnabled: this.authDetailData?.MFAEnabled,
        Password: this.authDetailData?.TemporaryPassword,
        BusinessUnits: [],
        Roles: [],
        Teams: [],
        TimeZoneId: this.timeZoneId
      };

      if (this.groupForm.get('BusinessUnits').value) {
        for (let list of this.groupForm.get('BusinessUnits').value) {
          if (this.groupForm.get('DefaultBusinessUnits').value === list) {
            reqParam.BusinessUnits.push({ Id: list, Default: true });
          } else {
            reqParam.BusinessUnits.push({ Id: list });
          }
        }
      }

      if (this.groupForm.get('Roles').value) {
        for (let list of this.groupForm.get('Roles').value) {
          if (this.groupForm.get('DefaultRoles').value === list) {
            reqParam.Roles.push({ Name: list, Default: true });
          } else {
            reqParam.Roles.push({ Name: list });
          }
        }
      }

      if (this.groupForm.get('Teams').value) {
        for (let list of this.groupForm.get('Teams').value) {
          reqParam.Teams.push({ Id: list });
        }
      }

      await this.loading.present();

      this.userService.createUser(reqParam).subscribe(async (result: any) => {
        await this.loading.dismiss();
        this.registerNewUser();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async registerNewUser() {
    await this.loading.present();
    // const reqBody = {
    //   SiteId: localStorage.getItem('SiteId'),
    //   UserId: this.groupForm.get('UserId').value,
    //   ContactCode: this.groupForm.get('UserId').value,
    // }
    // this.userService.getRefreshTokenContact(this.globService.convertRequestBody(reqBody)).subscribe(async (refreshResult: any) => {
    //   const refreshToken = refreshResult.type + ' ' + refreshResult.credentials;
    //   this.userService.getAccessTokenContact(refreshToken).subscribe(async (accessResult: any) => {
    //     const accessToken = accessResult.type + ' ' + accessResult.credentials;

    //     const registerBody = {
    //       contactPassword: this.groupForm.get('UserId').value,
    //       selcommUserName: this.authDetailData?.LoginId,
    //       selcommUserEmail: '',
    //       selcommUserPhoneNumber: '',
    //       selcommUserPassword: this.authDetailData?.TemporaryPassword,
    //     }
    //     // selcommUserEmail: this.groupForm.get('UserId').value,
    //     // selcommUserPhoneNumber: this.groupForm.get('UserId').value,
    //     if (this.authDetailData?.MobilePhone) {
    //       registerBody.selcommUserPhoneNumber = this.authDetailData?.MobilePhone;
    //     }
    //     if (this.authDetailData?.Email) {
    //       registerBody.selcommUserEmail = this.authDetailData?.Email;
    //     }
    //     const registerParam = {
    //       accessToken: accessToken,
    //       SiteId: localStorage.getItem('SiteId'),
    //       userId: this.groupForm.get('UserId').value,
    //     }
    //     this.userService.addUserWithAccessToken(this.globService.convertRequestBody(registerParam), this.globService.convertRequestBody(registerBody)).subscribe(async (result: any) => {
    //       await this.loading.dismiss();
    //       const rolState = await this.addRole();
    //       if (rolState) {
    //         await this.getGroupLists();
    //       }
    //     }, async (error: any) => {
    //       await this.loading.dismiss();

    //       if (error.error && error.error.errors && error.error.errors.duplicateemail
    //         && error.error.errors.duplicateemail.length > 0) {
    //         this.tranService.errorMessage(error.error.errors.duplicateemail[0]);
    //       } else {
    //         this.tranService.errorMessage(error);
    //         return false;
    //       }
    //     });
    //   }, async (error: any) => {
    //     await this.loading.dismiss();
    //     this.tranService.errorMessage(error);
    //   });
    // }, async (error: any) => {
    //   await this.loading.dismiss();
    //   this.tranService.errorMessage(error);
    // });

    const registerParam = {
      SiteId: localStorage.getItem('SiteId'),
      userId: this.groupForm.get('UserId').value,
    }

    const registerBody = {
      contactPassword: this.groupForm.get('UserId').value,
      selcommUserName: this.authDetailData?.LoginId,
      selcommUserEmail: this.authDetailData?.Email,
      selcommUserPhoneNumber: this.authDetailData?.MobilePhone,
      selcommUserPassword: this.authDetailData?.TemporaryPassword,
    }
    this.userService.addUserWithAccessToken(this.globService.convertRequestBody(registerParam), this.globService.convertRequestBody(registerBody)).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const rolState = await this.addUser(result);
      this.setMFAMode();
      if (rolState) {
        await this.getGroupLists();
      }
    }, async (error: any) => {
      await this.loading.dismiss();

      if (error.error && error.error.errors && error.error.errors.duplicateemail
        && error.error.errors.duplicateemail.length > 0) {
        this.tranService.errorMessage(error.error.errors.duplicateemail[0]);
      } else {
        this.tranService.errorMessage(error);
        return false;
      }
    });
  }

  async setMFAMode() {
    await this.loading.present();
    const reqBody = {
      LoginId: this.authDetailData?.LoginId
    }

    if (this.authDetailData?.MFAEnabled) {
      this.userService.enableMFA(this.ContactCode, reqBody).subscribe(async (result: any) => {
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
      });
    } else {
      this.userService.disableMFA(this.ContactCode, reqBody).subscribe(async (result: any) => {
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
      });
    }
  }

  async deleteRole() {
    try {
      const registerParam = {
        userId: this.authDetailData?.LoginId,
        roleId: this.groupForm.get('Roles').value,
      }

      let additionalPath = '';
      if (this.authDetailData?.LoginId.includes('@')) {
        additionalPath = 'email:';
      } else if (parseFloat(this.authDetailData?.LoginId) > 0) {
        additionalPath = 'name:';
      }
      const registerResult = await this.userService.deleteRole(registerParam, additionalPath).toPromise();
      return true;
    } catch (error) {

      this.tranService.errorMessage(error);
      return false;
    }
  }

  async addUser(userId) {
    try {
      const registerParam = {
        userId: userId,
        roleId: this.groupForm.get('DefaultRoles').value,
      }
      const registerResult = await this.userService.addUser(registerParam).toPromise();
      return true;
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
      return false;
    }
  }

  async addRole() {
    try {
      const registerParam = {
        userId: this.authDetailData?.LoginId,
        roleId: this.groupForm.get('Roles').value,
      }

      let additionalPath = '';
      if (this.authDetailData?.LoginId.includes('@')) {
        additionalPath = 'email:';
      } else if (parseFloat(this.authDetailData?.LoginId) > 0) {
        additionalPath = 'name:';
      }
      const registerResult = await this.userService.addRole(registerParam, additionalPath).toPromise();
      return true;
    } catch (error) {

      this.tranService.errorMessage(error);
      return false;
    }
  }

  async showUpdate(selUser) {
    this.groupState = 'edit';
    this.groupForm.reset();
    this.globService.serviceProviderUserSubject.next('Update user');

    await this.getTimeZoneDefault();

    if (!this.getFormDataState) {
      await this.getFormData();
    }
    this.userService.getUserDetail(selUser.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convertResult = this.globService.ConvertKeysToLowerCase(result);
      this.UserId = convertResult.authenticationloginid;
      if (convertResult === null) {
        this.tranService.errorToastMessage('no_data');
      } else {
        this.currentGroup = convertResult;
        for (var key in this.groupForm.controls) {
          this.groupForm.get(key).clearValidators();
        }

        this.groupForm.get('FamilyName').setValue(convertResult.familyname);
        this.groupForm.get('FirstName').setValue(convertResult.firstname);
        this.groupForm.get('Title').setValue(convertResult.title);
        this.groupForm.get('DateOfBirth').setValue(new Date(convertResult.dateofbirth));
        this.groupForm.get('Gender').setValue(convertResult.gender);
        this.groupForm.get('EmployeeReference').setValue(convertResult.employeereference);
        let businessunits = [];
        for (let list of convertResult.businessunits) {
          businessunits.push(list.id);
          if (list.default) {
            this.groupForm.get('DefaultBusinessUnits').setValue(list.id);
          }
        }
        this.groupForm.get('BusinessUnits').setValue(businessunits);

        let roles = [];
        for (let list of convertResult.roles) {
          roles.push(list.name);
          if (list.default) {
            this.groupForm.get('DefaultBusinessUnits').setValue(list.name);
          }
        }
        this.groupForm.get('Roles').setValue(roles);

        let teams = [];
        for (let list of convertResult.teams) {
          teams.push(list.id);
        }
        this.groupForm.get('Teams').setValue(teams);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async showCreate() {
    this.groupState = 'create';
    this.globService.serviceProviderUserSubject.next('Create user');
    this.groupForm.reset();
    for (var key in this.groupForm.controls) {
      this.groupForm.get(key).clearValidators();
    }

    await this.loading.present();
    if (!this.getFormDataState) {
      await this.getFormData();
    }
    await this.getNextUserId();

    await this.getTimeZoneDefault();
    await this.loading.dismiss();
  }

  async updateUser() {
    if (this.groupForm.valid) {
      await this.loading.present();
      let reqParam = {
        AuthenticationLoginId: this.authDetailData?.LoginId,
        AuthenticationMobile: this.authDetailData?.MobilePhone,
        AuthenticationEmail: this.authDetailData?.Email,
        ChangePasswordOnFirstLogin: this.authDetailData?.ChangePasswordOnFirstLogin,
        MFAEnabled: this.authDetailData?.MFAEnabled,
        FamilyName: this.groupForm.get('FamilyName').value,
        FirstName: this.groupForm.get('FirstName').value,
        Title: this.groupForm.get('Title').value,
        DateOfBirth: this.groupForm.get('DateOfBirth').value,
        Gender: this.groupForm.get('Gender').value,
        EmployeeReference: this.groupForm.get('EmployeeReference').value,
        // ChangePasswordOnFirstLogin: this.pswLoginState,
        BusinessUnits: [],
        Roles: [],
        Teams: [],
        TimeZoneId: this.timeZoneId
      };

      if (this.groupForm.get('BusinessUnits').value) {
        for (let list of this.groupForm.get('BusinessUnits').value) {
          if (this.groupForm.get('DefaultBusinessUnits').value === list) {
            reqParam.BusinessUnits.push({ Id: list, Default: true });
          } else {
            reqParam.BusinessUnits.push({ Id: list });
          }
        }
      }

      if (this.groupForm.get('Roles').value) {
        for (let list of this.groupForm.get('Roles').value) {
          if (this.groupForm.get('DefaultRoles').value === list) {
            reqParam.Roles.push({ Name: list, Default: true });
          } else {
            reqParam.Roles.push({ Name: list });
          }
        }
      }

      if (this.groupForm.get('Teams').value) {
        for (let list of this.groupForm.get('Teams').value) {
          reqParam.Teams.push({ Id: list });
        }
      }
      this.userService.updateUser(reqParam, this.currentGroup.id).subscribe(async (result: any) => {
        await this.loading.dismiss();
        this.setMFAMode();
        await this.getGroupLists();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async getFormData() {
    this.getFormDataState = true;
    await this.getConfiguration();
    await this.getBusinessLists();
    await this.getTeamLists();
    await this.getRoleLists();
  }

  setFormValidator(ctrl, type, defaultValue) {
    if (ctrl === 'Phones') {
      switch (type) {
        case 'ReadOnly':
          this.groupForm.get('HomePhone').disable();
          this.groupForm.get('WorkPhone').disable();
          break;
        case 'Optional':
          this.groupForm.get('HomePhone').setValidators(Validators.pattern('[0-9]{8,}'));
          this.groupForm.get('WorkPhone').setValidators(Validators.pattern('[0-9]{8,}'));
          break;
        case 'Mandatory':
          this.groupForm.get('HomePhone').setValidators([Validators.required, Validators.pattern('[0-9]{8,}')]);
          this.groupForm.get('WorkPhone').setValidators([Validators.required, Validators.pattern('[0-9]{8,}')]);
          break;
        case 'Hidden':
          this.groupForm.removeControl('HomePhone');
          this.groupForm.removeControl('WorkPhone');
          break;

        default:
          break;
      }
    } else {
      switch (type) {
        case 'ReadOnly':
          this.groupForm.get(ctrl).disable();
          break;
        case 'Optional':
          this.groupForm.get(ctrl).setValidators(null);
          break;
        case 'Mandatory':
          this.groupForm.get(ctrl).setValidators([Validators.required]);
          break;
        case 'Hidden':
          this.groupForm.removeControl(ctrl);
          break;

        default:
          break;
      }
      this.groupForm.get(ctrl).setValue(defaultValue);
      this.groupForm.get(ctrl).updateValueAndValidity();
    }
  }

  get f() {
    return this.groupForm.controls;
  }

  closeComponent() {
    this.UserComponent.emit('close');
  }

  addPhone(event) {
    this.phoneState = event.checked;
  }

  addAddress(event) {

    this.addressState = event.checked;
  }

  addTeam(event) {
    this.teamState = event.checked;
  }

  setValidFormCtrl(Ctrl) {
    this.groupForm.get(Ctrl).setErrors(null);
  }

  async deleteUser(user) {
    await this.loading.present();
    this.userService.deleteUser(user.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      await this.getGroupLists();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async optionSelected(event) {
    for (let list of this.filteredTimezonList) {
      if (list.id === event.option.value) {
        this.timeZoneId = list.id;
        this.groupForm.get('timeZone').setValue(list.name + ' [' + list.country + ']');
      }
    }
    this.availableCall = false;
  }

  clearSearch() {
    this.showClear = false;
    this.filteredTimezonList = [];
    this.groupForm.get('timeZone').reset();
  }

  async getTimeZoneDefault() {
    await this.loading.present();
    this.userService.getDefaultTimeZone().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.groupForm.get('timeZone').setValue(convResult[0].name + ' [' + convResult[0].country + ']');
      this.timeZoneId = convResult[0].id;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getTimeZoneSearch(value) {
    const reqParam = {
      SearchString: value,
      SkipRecords: 0,
      TakeRecords: 10,
    }
    this.userService.getSearchTimeZone(reqParam).subscribe(async (result: any) => {
      this.spinner.timezone = false;
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.timezoneList = convResult;
      this.filteredTimezonList = this.filter(value);
    }, async (error: any) => {
      this.spinner.timezone = false;
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  processComponent(en) {
    this.authAvailable = true;
    if (en === false) {
      this.authAvailable = false;
    } else if (en?.type) {
      if (en.type === 'suspend') {
        for (let list of this.groupList) {
          if (list.id === en.data.id) {
            list.authenticationstatus = 'Active';
          }
        }
      } else {
        for (let list of this.groupList) {
          if (list.id === en.data.id) {
            list.authenticationstatus = 'Suspended';
          }
        }
      }
    } else {
      this.authDetailData = en;
    }
  }

}
