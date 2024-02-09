import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { PartnerService } from './services/partner.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent implements OnInit {

  @Input() ContactCode: string = '';


  @Output('UserComponent') PartnersComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  groupList: any[] = [];
  groupForm: UntypedFormGroup;

  groupState: string = '';
  currentGroup: any;

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
    { id: 'Other', name: 'other' }
  ];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private userService: PartnerService,

    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {

    this.groupForm = this.formBuilder.group({});
  }

  searchInputEvent(event) {
    if (event.keyCode === 13) {
      this.userParam.SearchString = event.target.value;

      this.userParam.SkipRecords = 0;
      this.userParam.TakeRecords = 10;
      this.pageRowNumber = 1;
      this.rowStep = '10';
      this.SkipRecords = 0;
      this.getGroupLists();
    }
  }

  outPagingComponent(event) {
    this.userParam.SkipRecords = event.SkipRecords;
    this.userParam.TakeRecords = event.TakeRecords;

    this.pageRowNumber = event.pageRowNumber;
    this.rowStep = event.rowStep;
    this.SkipRecords = event.SkipRecords;

    this.getGroupLists();
  }

  async ngOnInit() {
    await this.loading.present();
    this.getGroupLists();
  }

  getGroupLists() {
    this.groupState = 'view';
    this.groupList = [];
    this.userService.getAllUsers(this.userParam).subscribe(async (result: any) => {

      await this.loading.dismiss();
      const convertResult = this.globService.ConvertKeysToLowerCase(result);
      if (convertResult.documents === null) {
        this.tranService.errorToastMessage('no_data');
      } else {
        this.groupList = convertResult.users;
        this.totalLength = convertResult.recordcount;

        for (let list of this.groupList) {
          list.mode = false;
        }
      }
    }, async (error: any) => {

      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  backMain() {
    this.groupState = 'view';
    this.removeGroupForm();
  }

  createSubmitTrigger() {
    document.getElementById('create-submit').click();
  }

  async createUser() {
    if (this.groupForm.valid) {
      let reqParam = {
        BusinessUnitCode: this.groupForm.get('BusinessUnitCode').value,
        Role: this.groupForm.get('Role').value,
        Name: this.groupForm.get('Name').value,
        FirstName: this.groupForm.get('FirstName').value,
        Title: this.groupForm.get('Title').value,
        DateOfBirth: this.groupForm.get('DateOfBirth').value,
        Gender: this.groupForm.get('Gender').value,
        Email: this.groupForm.get('Email').value,
        HomePhone: this.groupForm.get('HomePhone').value,
        WorkPhone: this.groupForm.get('WorkPhone').value,
        MobilePhone: this.groupForm.get('MobilePhone').value,
        Address1: this.groupForm.get('Address1').value,
        Address2: this.groupForm.get('Address2').value,
        Suburb: this.groupForm.get('Suburb').value,
        City: this.groupForm.get('City').value,
        State: this.groupForm.get('State').value,
        Postcode: this.groupForm.get('Postcode').value,
        CountryCode: this.groupForm.get('CountryCode').value,
        EmployeeReference: this.groupForm.get('EmployeeReference').value
      }
      await this.loading.present();
      this.userService.createUser(this.globService.convertRequestBody(reqParam)).subscribe((result: any) => {

        this.getGroupLists();
      }, async (error: any) => {

        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async goToGroupDetail(index) {
    this.groupState = 'edit';
    await this.loading.present();
    this.userService.getUserDetail(this.groupList[index].id).subscribe(async (result: any) => {

      await this.loading.dismiss();
      const convertResult = this.globService.ConvertKeysToLowerCase(result);
      if (convertResult === null) {
        this.tranService.errorToastMessage('no_data');
      } else {
        this.currentGroup = convertResult;
        this.createGroupForm();
        for (var key in this.groupForm.controls) {
          this.groupForm.get(key).setValue(this.currentGroup[key.toLowerCase()]);
        }
      }
    }, async (error: any) => {

      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  createGroupForm() {
    this.groupForm.addControl('BusinessUnitCode', new UntypedFormControl(''));
    this.groupForm.addControl('Role', new UntypedFormControl('', Validators.required));
    this.groupForm.addControl('Name', new UntypedFormControl('', Validators.required));
    this.groupForm.addControl('FirstName', new UntypedFormControl('', Validators.required));
    this.groupForm.addControl('Title', new UntypedFormControl(''));
    this.groupForm.addControl('DateOfBirth', new UntypedFormControl(''));
    this.groupForm.addControl('Gender', new UntypedFormControl(''));
    this.groupForm.addControl('Email', new UntypedFormControl('', [Validators.required, Validators.email]));
    this.groupForm.addControl('HomePhone', new UntypedFormControl('', Validators.pattern('[0-9]{8,}')));
    this.groupForm.addControl('WorkPhone', new UntypedFormControl('', Validators.pattern('[0-9]{8,}')));
    this.groupForm.addControl('MobilePhone', new UntypedFormControl('', Validators.pattern('[0-9]{8,}')));
    this.groupForm.addControl('Address1', new UntypedFormControl(''));
    this.groupForm.addControl('Address2', new UntypedFormControl(''));
    this.groupForm.addControl('Suburb', new UntypedFormControl(''));
    this.groupForm.addControl('City', new UntypedFormControl(''));
    this.groupForm.addControl('State', new UntypedFormControl(''));
    this.groupForm.addControl('Postcode', new UntypedFormControl(''));
    this.groupForm.addControl('CountryCode', new UntypedFormControl(''));
    this.groupForm.addControl('EmployeeReference', new UntypedFormControl(''));
  }

  removeGroupForm() {
    this.groupForm.removeControl('BusinessUnitCode');
    this.groupForm.removeControl('Role');
    this.groupForm.removeControl('Name');
    this.groupForm.removeControl('FirstName');
    this.groupForm.removeControl('Title');
    this.groupForm.removeControl('DateOfBirth');
    this.groupForm.removeControl('Gender');
    this.groupForm.removeControl('Email');
    this.groupForm.removeControl('HomePhone');
    this.groupForm.removeControl('WorkPhone');
    this.groupForm.removeControl('MobilePhone');
    this.groupForm.removeControl('Address1');
    this.groupForm.removeControl('Address2');
    this.groupForm.removeControl('Suburb');
    this.groupForm.removeControl('City');
    this.groupForm.removeControl('State');
    this.groupForm.removeControl('Postcode');
    this.groupForm.removeControl('CountryCode');
    this.groupForm.removeControl('EmployeeReference');
  }

  updateSubmitTrigger() {
    document.getElementById('submitButton').click();
  }

  async updateUser() {
    if (this.groupForm.valid) {
      let reqParam = {
        BusinessUnitCode: this.groupForm.get('BusinessUnitCode').value,
        Role: this.groupForm.get('Role').value,
        Name: this.groupForm.get('Name').value,
        FirstName: this.groupForm.get('FirstName').value,
        Title: this.groupForm.get('Title').value,
        DateOfBirth: this.groupForm.get('DateOfBirth').value,
        Gender: this.groupForm.get('Gender').value,
        Email: this.groupForm.get('Email').value,
        HomePhone: this.groupForm.get('HomePhone').value,
        WorkPhone: this.groupForm.get('WorkPhone').value,
        MobilePhone: this.groupForm.get('MobilePhone').value,
        Address1: this.groupForm.get('Address1').value,
        Address2: this.groupForm.get('Address2').value,
        Suburb: this.groupForm.get('Suburb').value,
        City: this.groupForm.get('City').value,
        State: this.groupForm.get('State').value,
        Postcode: this.groupForm.get('Postcode').value,
        CountryCode: this.groupForm.get('CountryCode').value,
        EmployeeReference: this.groupForm.get('EmployeeReference').value
      }
      await this.loading.present();
      this.userService.updateUser(this.globService.convertRequestBody(reqParam), this.currentGroup.id).subscribe((result: any) => {

        this.getGroupLists();
      }, async (error: any) => {

        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  showCreate() {
    this.groupState = 'create';
    this.createGroupForm();
  }

  get f() {
    return this.groupForm.controls;
  }

  closeComponent() {
    this.PartnersComponent.emit({ type: 'close' });
  }
}
