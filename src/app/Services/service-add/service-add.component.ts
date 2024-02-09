import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ServiceAddService } from './services/service-add.service';
import { ServicePlanDetailComponent } from 'src/app/Plan/History/Service/components';

@Component({
  selector: 'app-new-service-add',
  templateUrl: './service-add.component.html',
  styleUrls: ['./service-add.component.scss'],
})
export class ServiceAddComponent implements OnInit {
  @Input() ContactCode: string = '';

  @Output('ServiceAddComponent') ServiceAddComponent: EventEmitter<string> = new EventEmitter<string>();

  

  addForm: UntypedFormGroup;

  serviceTypeList: any[] = [];
  serviceTypeWorkflow: any[] = [];
  userList: any[] = ['User', 'Test', 'Sales', 'Person', 'Initial'];
  availableNumberList = ['02134846', '15684684', '84843221', '54681541'];
  PortingIdentificationList: any[] = [];
  ServiceProviderList: any[] = ['Telstra', 'Optus'];
  planList = [
    { id: 'Plan 1', value: 'Plan 1' },
    { id: 'Plan 2', value: 'Plan 2' },
    { id: 'Plan 3', value: 'Plan 3' },
    { id: 'Plan 4', value: 'Plan 4' },
    { id: 'Plan 5', value: 'Plan 5' },
  ];
  optionList = [
    { id: 'Option 1', value: 'Option 1' },
    { id: 'Option 2', value: 'Option 2' },
    { id: 'Option 3', value: 'Option 3' },
    { id: 'Option 4', value: 'Option 4' },
    { id: 'Option 5', value: 'Option 5' },
  ];
  contractList = [
    { id: 'Standard', value: 'Standard' },
    { id: '5 year', value: '5 year' },
  ];
  attributeList = [
    { id: 'Bandwidth', name: 'Band Width', value: '120 NB', datatype: 'String', optional: false, lookupvaluelist: [], showSpinner: false },
    { id: 'MAC', name: 'MAC', value: '123.123.4554.89', datatype: 'String', optional: true, lookupvaluelist: [], showSpinner: false },
  ];
  chargeList: any[] = [
    { id: 'charge1', name: 'Access', price: '$50.00 per month', type: 'On-going', plan: 'MyPlan', option: 'Standard' },
    { id: 'charge2', name: '5 Additional Ports', price: '$340.00', type: 'One off', description: 'Additional Port Attribute' },
    { id: 'charge3', name: 'Consulting', price: '$200 p.h', type: '5 Hours', totalprice: '$1,000.00' },
  ];
  siteList: any[] = [
    { id: 'HeadOffice', name: 'Head Office' },
    { id: 'WareHouse', name: 'Ware House' },
  ];
  costCenterList: any[] = [
    { id: 'marketing', name: 'Marketing', value: '50%', enddate: '2021-12-31' },
    { id: 'support', name: 'Support', value: '50%', enddate: '2021-12-31' },
  ];




  initialStatusList: any[] = [];
  pSReferenceList: any[] = [];
  portingInformationList: any[] = [];
  addressList: any[] = [];
  relatedContactList: any[] = [];
  serviceGroupList: any[] = [];
  chargeOverrideList: any[] = [];
  psIdList: any[] = [];
  hardwareList: any[] = [
    { id: 'SKU1', name: 'Samsung S11', qty: 3, unitprice: 100, unittax: 2.33, serial: '123456789' },
    { id: 'SKU2', name: 'Nexus', qty: 5, unitprice: 130, unittax: 2.33, serial: 'xxxxxxxxx' },
    { id: 'SKU3', name: 'Pixel', qty: 7, unitprice: 150, unittax: 2.33, serial: 'rrqqeeffs' },
  ];

  firstForm: UntypedFormGroup;
  thirdForm: UntypedFormGroup;
  seventhForm: UntypedFormGroup;

  showSpinner: any = {};
  availCall: any = {};
  filteredLists: any = {};

  selectedWorkflow: any;
  state: any = {};
  projectValues: any = {};

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private service: ServiceAddService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private modalCtrl: ModalController,
  ) {
    this.tranService.translaterService();
    

    this.addForm = this.formBuilder.group({
      ServiceId: ['',],
      ServiceTypeId: ['',],
      InitialStatusId: ['',],
      ConnectDatetime: ['',],
      UserLabel: ['',],
      ParentServiceReference: ['',],
      Plans: ['',],
      Attributes: ['',],
      PortingInformation: ['',],
      Sites: ['',],
      Addresses: ['',],
      RelatedContacts: ['',],
      CostCenters: ['',],
      Contracts: ['',],
      ServiceGroups: ['',],
      Charges: ['',],
      ChargeOverrides: ['',],
      PreferredServiceIds: ['',],
      Hardware: ['',],
    });

    // This is for the first form
    this.firstForm = this.formBuilder.group({
      ServiceTypeId: ['',],
      SalesPerson: ['',],
    });

    this.firstForm.get('ServiceTypeId').valueChanges.subscribe(result => {
      if (result) {
        if (this.firstForm.contains('ServiceTypeWorkflow')) {
          this.firstForm.get('ServiceTypeWorkflow').reset();
        } else {
          this.firstForm.addControl('ServiceTypeWorkflow', new UntypedFormControl(''));
        }
        this.getServiceTypeWorkflow();
      }
    });

    this.firstForm.get('SalesPerson').valueChanges.subscribe(async (result: any) => {
      if (result) {
        if (this.availCall.SalesPerson) {
          await this.getSalesPerson(result);
        }

        this.availCall.SalesPerson = true;
      }
    });

    this.projectValues.formStep = 'first';

    this.thirdForm = this.formBuilder.group({
      Plan: [''],
      Option: [''],
      Contract: [''],
      ContractNumber: [''],
      ContractEndDate: [''],
    });

    this.thirdForm.get('Plan').valueChanges.subscribe(async (result) => {
      if (result) {
        if (this.availCall.Plan) {
          this.filterLists('Plan', result);
        }

        this.availCall.Plan = true;
      }
    });

    this.seventhForm = this.formBuilder.group({
      Site: [''],
    });
  }

  ngOnInit() {
    this.getServiceTypes();
  }

  // This is for the first form
  get fFirst() {
    return this.firstForm.controls;
  }

  async getServiceTypes() {
    await this.loading.present();
    this.service.getServiceTypes().subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.serviceTypeList = this.globService.ConvertKeysToLowerCase(result);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getServiceTypeWorkflow() {
    await this.loading.present();
    const serviceTypeId = this.firstForm.get('ServiceTypeId').value;
    this.service.getServiceTypeWorkflow(serviceTypeId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.serviceTypeWorkflow = this.globService.ConvertKeysToLowerCase(result).workflows;
      this.firstForm.get('ServiceTypeWorkflow').valueChanges.subscribe(result => {
        if (result) {
          if (!this.firstForm.contains('ServiceNumber')) {
            this.firstForm.addControl('ServiceNumber', new UntypedFormControl());
          } else {
            this.firstForm.get('ServiceNumber').reset();
          }
          this.selectedWorkflow = this.serviceTypeWorkflow.filter(option => option.id == result)[0];
          this.PortingIdentificationList = this.selectedWorkflow.portingidentification;

          switch (this.selectedWorkflow.servicenumberstate) {
            case 'Mandatory':
              this.firstForm.get('ServiceNumber').setValidators([Validators.required]);
              break;
            case 'ReadOnly':
              this.firstForm.get('ServiceNumber').disable();
              break;
            default:
              break;
          }

          switch (result) {
            case 'Port':
              if (!this.firstForm.contains('ServiceProvider')) {
                this.firstForm.addControl('ServiceProvider', new UntypedFormControl());
              } else {
                this.firstForm.get('ServiceProvider').reset();
              }
              if (!this.firstForm.contains('AccountNumber')) {
                this.firstForm.addControl('AccountNumber', new UntypedFormControl());
              } else {
                this.firstForm.get('AccountNumber').reset();
              }
              if (!this.firstForm.contains('DOB')) {
                this.firstForm.addControl('DOB', new UntypedFormControl());
              } else {
                this.firstForm.get('DOB').reset();
              }
              if (!this.firstForm.contains('PortingIdentification')) {
                this.firstForm.addControl('PortingIdentification', new UntypedFormControl());
              } else {
                this.firstForm.get('PortingIdentification').reset();
              }

              this.firstForm.get('PortingIdentification').valueChanges.subscribe(result => {
                if (result) {
                  if (this.selectedWorkflow.hasnumber) {
                    if (!this.firstForm.contains('IdNumber')) {
                      this.firstForm.addControl('IdNumber', new UntypedFormControl());
                    } else {
                      this.firstForm.get('IdNumber').reset();
                    }
                  }
                }
              });
              break;
            default:
              break;
          }
        }
      });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  searchServiceNumber() {
    this.state.search = true;
    this.projectValues.availServiceNumber = '';
  }

  async getSalesPerson(result) {
    this.showSpinner.SalesPerson = true;
    this.filterLists('SalesPerson', result);
    this.showSpinner.SalesPerson = false;
  }

  // This is for the third form

  get fThird() {
    return this.thirdForm.controls;
  }

  submitThirdForm() {
    if (this.thirdForm.valid) {
      this.projectValues.formStep = 'fourth';
    }
  }

  // Here is global for all forms

  processComponents(component, event) {
    switch (component) {
      case 'address':
        if (event !== 'Invalid') {
          const addressData = event;
          this.projectValues.formStep = 'eighth';
        }
        break;
      case 'attribute':
        if (event === 'third') {
          this.prevForm(event);
        } else {
          const attributeFormData = JSON.parse(event);
          this.nextForm('fifth');
        }
        break;
      case 'related_contact':
        if (event === 'eighth') {
          this.prevForm(event);
        } else {
          const relatedContactFormData = event;
          this.nextForm('tenth');
        }
        break;
      default:
        break;
    }
  }

  async goToDetails(detailValue) {
    switch (detailValue) {
      case 'plan':
        const modal = await this.modalCtrl.create({
          component: ServicePlanDetailComponent,
          componentProps: {
            // PlanId: this.thirdForm.get('Plan').value,
            PlanId: '13',
            ServiceReference: '856',
          },
          cssClass: 'plan-detail-modal'
        });

        await modal.present();
        break;
      case 'contract':
        break;
      case 'new_site':
        break;
      default:
        break;
    }
  }

  selectSearchResult(fieldName) {
    switch (fieldName) {
      case 'availServiceNumber':
        this.firstForm.get('ServiceNumber').setValue(this.projectValues.availServiceNumber);
        this.state.search = false;
        break;
      default:
        break;
    }
  }

  closeSearchField(fieldName) {
    switch (fieldName) {
      case 'availServiceNumber':
        this.state.search = false;
        break;
      default:
        break;
    }
  }

  filterLists(fieldName, result) {
    switch (fieldName) {
      case 'SalesPerson':
        this.filteredLists[fieldName] = this.userList.filter(option => option.toLowerCase().includes(result.toLowerCase()));
        break;
      case 'availServiceNumber':
        this.filteredLists[fieldName] = this.availableNumberList.filter(option => option.toLowerCase().includes(result.toLowerCase()));
        break;
      case 'Plan':
        this.filteredLists[fieldName] = this.planList.filter(option => option.id.toLowerCase().includes(result.toLowerCase()));
        break;
      default:
        break;
    }
  }

  selectAutocompleteField(fieldName) {
    switch (fieldName) {
      case 'SalesPerson':
        this.availCall[fieldName] = false;
        break;
      case 'availServiceNumber':
        this.availCall[fieldName] = false;
        break;
      case 'Plan':
        this.availCall[fieldName] = false;
        this.thirdForm.get('Option').reset();
        break;
      default:
        break;
    }
  }

  clearField(fieldName) {
    switch (fieldName) {
      case 'SalesPerson':
        this.firstForm.get(fieldName).reset();
        break;
      case 'availServiceNumber':
        this.projectValues.availServiceNumber = '';
        break;
      case 'Plan':
        this.firstForm.get(fieldName).reset();
        break;
      default:
        break;
    }
  }

  nextForm(formName) {
    switch (formName) {
      case 'second':
        document.getElementById('serviceAddFirstButton').click();
        break;
      case 'fourth':
        document.getElementById('thirdFormSubmitButton').click();
        break;
      case 'eighth':
        this.globService.globSubject.next('ServiceAddAddressSubmit');
        break;

      default:
        this.projectValues.formStep = formName;
        break;
    }
  }

  prevForm(formName) {
    this.projectValues.formStep = formName;
  }

  submitFirstForm() {
    if (this.firstForm.valid) {
      this.projectValues.formStep = 'second';
    }
  }
















  triggerSubmit() {
    document.getElementById('submitButton').click();
  }

  async submitForm() {
    if (this.addForm.valid) {
      let reqData = {
        ServiceId: this.addForm.get('ServiceId').value,
        ServiceTypeId: this.addForm.get('ServiceTypeId').value,
        InitialStatusId: this.addForm.get('InitialStatusId').value,
        ConnectDatetime: this.addForm.get('ConnectDatetime').value,
        UserLabel: this.addForm.get('UserLabel').value,
        ParentServiceReference: this.addForm.get('ParentServiceReference').value,
        Plans: [],
        Attributes: [],
        PortingInformation: {},
        Sites: [],
        Addresses: [],
        RelatedContacts: [],
        CostCenters: [],
        Contracts: [],
        ServiceGroups: [],
        Charges: [],
        ChargeOverrides: [],
        PreferredServiceIds: [],
        Hardware: []
      }

      await this.loading.present();
      this.service.serviceAdd(reqData).subscribe(async (result: any) => {
        await this.loading.dismiss();
        this.closeAdd();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      })
    }
  }

  closeAdd() {
    this.ServiceAddComponent.emit('close');
  }

}
