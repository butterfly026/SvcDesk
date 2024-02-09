import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { AccountPlanDetailComponent } from 'src/app/Plan/History/Account/components';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-new-account-plan',
  templateUrl: './account-plan.component.html',
  styleUrls: ['./account-plan.component.scss'],
})
export class NewAccountPlanComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountPlanComponent') AccountPlanComponent: EventEmitter<any> = new EventEmitter<any>();

  

  planForm: UntypedFormGroup;

  planList: any[] = [
    { planid: '1', displayname: 'Plan' },
    { planid: '2', displayname: 'Test Plan' },
    { planid: '3', displayname: 'NBN 1000' },
    { planid: '4', displayname: 'Display Name' },
    { planid: '5', displayname: 'Happy' },
  ];

  optionList: any[] = [
    { id: 'option 1', name: 'Option 1' },
    { id: 'option 2', name: 'Option 2' },
    { id: 'option 3', name: 'Option 3' },
    { id: 'option 4', name: 'Option 4' },
    { id: 'option 5', name: 'Option 5' },
  ];

  availableCallPlan: boolean = true;
  availableDetail: boolean = false;

  filterPlanList = [];
  showSpinner: boolean = false;

  currentPlan: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalCtrl: ModalController,
    public globService: GlobalService,
  ) {
    
    this.planForm = this.formBuilder.group({
      Plan: ['', Validators.required],
      Option: ['', Validators.required]
    });


    this.planForm.get('Plan').valueChanges.pipe(debounceTime(1000)).subscribe(result => {
      if (result) {
        if (this.availableCallPlan) {
          this.getPlans(result);
        }
      }

      this.availableCallPlan = true;
    });

    this.planForm.valueChanges.subscribe(() => {
      this.globService.globSubject.next('validForm&&Plans&&' + this.planForm.valid);
    });
  }

  async ngOnInit() {
    this.getPlans('');
  }

  async getPlans(plan) {
    this.showSpinner = true; 
    for (let list of this.planList) {
      list.options = this.optionList;
    }
    this.filterPlanList = plan == '' ? this.planList : this.filter(plan);
    this.showSpinner = false;
  }

  filter(value) {
    if (value !== null && value !== '') {
      const filterValue = value.toLowerCase();

      return this.planList.filter(item => item.displayname.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  async selectPlan(event) {
    this.planForm.get('Option').reset();
    for (let list of this.planList) {
      if (list.planid === this.planForm.get('Plan').value) {
        this.currentPlan = list;
        this.planForm.get('Plan').setValue(list.displayname);
        this.optionList = list.options;
        let selectedOption = false;
        for (let option of this.optionList) {
          if (option.default) {
            selectedOption = true;
            this.planForm.get('Option').setValue(option.id);
          }
        }

        if (!selectedOption) {
          this.planForm.get('Option').setValue(this.optionList[0].id);
        }
        this.availableDetail = true;
        this.availableCallPlan = false;
        break;
      }
    }
  }

  showDetail() {
    // this.modalCtrl.dismiss(this.currentPlan);
    // this.PlanNewComponent.emit('planDetail&&' + this.currentPlan.planid);
    this.openPlanDetail();
  }

  async openPlanDetail() {
    const modal = await this.modalCtrl.create({
      component: AccountPlanDetailComponent,
      componentProps: {
        PlanId: this.currentPlan.planid,
      },
      cssClass: 'plan-detail-modal'
    });

    await modal.present();
  }

  prevForm() {
    this.AccountPlanComponent.emit('before');
  }

  nextForm() {
    document.getElementById('planSubmitButton').click();
  }

  submitPlanForm() {
    if (this.planForm.valid) {
      this.AccountPlanComponent.emit(this.planForm.value);
    }
  }

}
