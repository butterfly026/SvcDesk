import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { pairwise, startWith, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { NewAccountService } from '../../services';
import {
  AccountConfiguration, 
  AccountContactPhonesFormGroup, 
  AccountTypeFormGroup, 
  AccountDetailsFormGroup, 
  AccountPhone, 
  AccountEmailsFormGroup, 
  AccountEmail, 
  AccountAddressesFormGroup, 
  AccountAddress, 
  AccountOptionsFormGroup,
  AccountIdentificationDocumentFormGroup,
  AccountSecurityQuestionsFormGroup,
  AccountSecurityQuestionFormGroup,
  AccountAuthenticationFormGroup,
  AccountAddressFormGroup, 
  AccountEmailFormGroup, 
  AccountIdentificationDocumentsFormGroup, 
  AccountPhoneFormGroup,
  CreateAccountRequestBody,
  IdentificationDocument,
  AccountSecurityQuestion,
  AccountAuthentication
} from '../../models';

@Component({
  selector: 'app-new-account-prototype',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss'],
})
export class NewAccountPrototypeComponent implements OnInit {

  @Input() ContactCode: string = '';
  
  @ViewChild('stepper') stepper: MatStepper;

  accountConfiguration: AccountConfiguration;
  currentStepIndex: number;
  isSubmitStage: boolean;

  accountTypeFormGroup: FormGroup<AccountTypeFormGroup>;
  accountDetailsFormGroup: FormGroup<AccountDetailsFormGroup>;
  accountContactPhonesFormGroup: FormGroup<AccountContactPhonesFormGroup>;
  accountEmailsFormGroup: FormGroup<AccountEmailsFormGroup>;
  accountAddressesFormGroup: FormGroup<AccountAddressesFormGroup>;
  accountOptionsFormGroup: FormGroup<AccountOptionsFormGroup>;
  accountIdentificationDocumentsFormGroup: FormGroup<AccountIdentificationDocumentsFormGroup>;
  accountSecurityQuestionsFormGroup: FormGroup<AccountSecurityQuestionsFormGroup>;
  accountAuthenticationFormGroup: FormGroup<AccountAuthenticationFormGroup>;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private formBuilder: FormBuilder,
    private newAccountService: NewAccountService,
    private spinnerService: SpinnerService,
    private tranService: TranService,
  ) { }

  ngOnInit() {
    this.accountTypeFormGroup = this.formBuilder.group({
      AccountType: ['', Validators.required],
    });

    this.accountDetailsFormGroup = this.formBuilder.group({
      Id: ['', Validators.required],
      BusinessUnitCode: ['', Validators.required],
      StatusId: ['', Validators.required],
      Key: '',
      Name: ['', Validators.required],
      SubTypeId: '',
      TradingName: ['', Validators.required],
      Gender: ['', Validators.required],
      DateOfBirth: ['', Validators.required],
      FirstName: ['', Validators.required],
      Title: ['', Validators.required],
    });

    this.accountContactPhonesFormGroup = this.formBuilder.group({
      ContactPhones: this.formBuilder.array<FormGroup<AccountPhoneFormGroup>>([])
    });

    this.accountEmailsFormGroup = this.formBuilder.group({
      Emails: this.formBuilder.array<FormGroup<AccountEmailFormGroup>>([])
    });

    this.accountAddressesFormGroup = this.formBuilder.group({
      Addresses: this.formBuilder.array<FormGroup<AccountAddressFormGroup>>([])
    });

    this.accountOptionsFormGroup = this.formBuilder.group({
      BillingCycleCode: ['', Validators.required],
      TaxId: ['', Validators.required],
      TimeZoneId: ['', Validators.required],
      CreditLimit: ['', Validators.required],
      CreditStatusId: ['', Validators.required],
      ChannelPartnerId: ['', Validators.required],
      PaperBill: ['', Validators.required],
      EmailBill: ['', Validators.required]
    });

    this.accountIdentificationDocumentsFormGroup = this.formBuilder.group({
      IdentificationItem: this.formBuilder.array<FormGroup<AccountIdentificationDocumentFormGroup>>([])
    });

    this.accountSecurityQuestionsFormGroup = this.formBuilder.group({
      IdentificationQuestions: this.formBuilder.array<FormGroup<AccountSecurityQuestionFormGroup>>([])
    });

    this.accountAuthenticationFormGroup = this.formBuilder.group({
      LoginId: ['', Validators.required],
      Email: ['', [Validators.email, Validators.required]],
      Mobile: ['', [Validators.required]],
      Password: ['', Validators.required],
      ChangePasswordOnFirstLogin: false,
    });

    this.accountTypeFormGroup.controls.AccountType.valueChanges
      .pipe(
        startWith(''),
        pairwise(),
        takeUntil(this.unsubscribeAll$)
      )
      .subscribe(([prev, next] )=> {
        if (prev) {
          this.stepper.steps.forEach((s, i) => i > 0 ? s.reset() : null);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  changeStep(event: StepperSelectionEvent): void {
    this.currentStepIndex = event.selectedIndex;
    this.isSubmitStage = event.selectedIndex + 2 === event.selectedStep._stepper._steps.length;
  }

  goToPriviousStage(): void {
    this.stepper.previous();
  }

  goToNextStage(): void {
    if (this.isSubmitStage) {
      this.stepper.steps.get(this.currentStepIndex)._markAsInteracted();
      if (this.stepper.steps.get(this.currentStepIndex).stepControl.status === 'VALID') {
        this.createAccount();
      }
    } else {
      this.stepper.next();
    }
  }

  updateAccountConfiguration(event: AccountConfiguration): void {
    this.accountConfiguration = event;
  }

  private get requestBody(): CreateAccountRequestBody {
    const { Id, BusinessUnitCode, StatusId, Key, Name, SubTypeId, TradingName, Gender, DateOfBirth, FirstName, Title } = this.accountDetailsFormGroup.value;
    const { BillingCycleCode, TaxId, TimeZoneId, CreditLimit, CreditStatusId, ChannelPartnerId, PaperBill, EmailBill } = this.accountOptionsFormGroup.value;
    const Addresses = this.accountAddressesFormGroup.value.Addresses.map(s => ({ ...s, PhoneTypes: s.AddressTypes.map(t => ({ Code: t })) })) as AccountAddress[];
    const ContactPhones = this.accountContactPhonesFormGroup.value.ContactPhones.map(s => ({ ...s, PhoneTypes: s.PhoneTypes.map(t => ({ Code: t })) })) as AccountPhone[];
    const Emails = this.accountEmailsFormGroup.value.Emails.map(s => ({ ...s, PhoneTypes: s.EmailTypes.map(t => ({ Code: t })) })) as AccountEmail[];
    const IdentificationItem = this.accountIdentificationDocumentsFormGroup.value.IdentificationItem as IdentificationDocument[];
    const IdentificationQuestions = this.accountSecurityQuestionsFormGroup.value.IdentificationQuestions as AccountSecurityQuestion[];
    const Authentication = this.accountAuthenticationFormGroup.value as AccountAuthentication;

    return {
      Id, BusinessUnitCode, StatusId, Key, Name, SubTypeId, TradingName, Gender, DateOfBirth, FirstName, Title,
      BillingCycleCode, TaxId, TimeZoneId, CreditLimit, CreditStatusId, ChannelPartnerId, PaperBill, EmailBill,
      Addresses, ContactPhones, Emails, IdentificationItem, IdentificationQuestions, Authentication,
      ParentId: null, 
      UserDefinedData: null, 
      ExternalPayId: null, 
      BusinessNumber: null
    }
  }

  private createAccount(): void {
    this.spinnerService.loading();
    (
      this.accountTypeFormGroup.controls.AccountType.value === 'person'
        ? this.newAccountService.createPersonalAccount(this.requestBody)
        : this.newAccountService.createCorporateAccount(this.requestBody)
    )
    .pipe(
      takeUntil(this.unsubscribeAll$),
      finalize(() => this.spinnerService.end())
    )
    .subscribe({
      next: () => this.stepper.next(),
      error: error => this.tranService.errorMessage(error)
    })
  }

}
