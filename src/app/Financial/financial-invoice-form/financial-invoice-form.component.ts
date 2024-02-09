import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { FinancialInvoiceFormService } from './services/financial-invoice-form.service';


@Component({
  selector: 'app-financial-invoice-form',
  templateUrl: './financial-invoice-form.component.html',
  styleUrls: ['./financial-invoice-form.component.scss'],
})
export class FinancialInvoiceFormComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() FinancialId: string = '';
  @Output('FinancialInvoiceFormComponent') FinancialInvoiceFormComponent: EventEmitter<string> = new EventEmitter<string>();


  groupForm: UntypedFormGroup;

  categoryList = [];

  reasonList = [];
  minDate: Date = new Date();

  chargePrice = 0;
  productPrice = 0;

  chargeList: any[] = [];
  productList: any[] = [];


  noteForm: UntypedFormGroup;
  firstSurcharge: boolean = false;
  termList: any[] = [];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private invoiceService: FinancialInvoiceFormService,

    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService
  ) {

    this.tranService.translaterService();
    this.groupForm = this.formBuilder.group({
      Number: [{ value: '', disabled: true }, Validators.required],
      Amount: ['', Validators.required],
      Tax: ['', Validators.required],
      Date: [this.minDate, Validators.required],
      DueDate: ['', Validators.required],
      Category: ['',],
      OtherRef: ['',],
      Reason: ['',],
    });

    this.noteForm = this.formBuilder.group({
      note: ['',]
    });

    this.groupForm.get('Amount').valueChanges.subscribe((result: any) => {
      if (result === 0) {
        this.groupForm.get('Amount').setErrors({ 'required': false })
      }
    });

    this.groupForm.get('Date').valueChanges.pipe(debounceTime(1000)).subscribe((result: any) => {
      
      this.getTermsList();
    });

    this.getTermsList();
  }

  async ngOnInit() {
    this.getReasonList();
    this.getCategories();
    this.getInvoiceNumber();
  }

  async getReasonList() {
    this.reasonList = [];
    await this.loading.present();
    this.invoiceService.FinantialTransactionsReasons().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.reasonList = convResult;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getCategories() {
    this.categoryList = [];
    await this.loading.present();
    this.invoiceService.FinantialTransactionsCategories('I').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      for (let list of convResult) {
        this.categoryList.push(list);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }

  async getInvoiceNumber() {
    await this.loading.present();
    this.invoiceService.getInvoiceNumber('I').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      this.groupForm.get('Number').setValue(convResult.number);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }



  get f() {
    return this.groupForm.controls;
  }

  async submitForm() {
    if (this.groupForm.valid) {
      const reqData = {
        Number: this.groupForm.get('Number').value ?? null,
        Date: this.groupForm.get('Date').value ?? null,
        DueDate: this.groupForm.get('DueDate').value ?? null,
        Amount: this.groupForm.get('Amount').value ?? null,
        TaxAmount: this.groupForm.get('Tax').value ?? null,
        ReasonId: this.groupForm.get('Reason').value ?? null,
        OtherReference: this.groupForm.get('OtherRef').value ?? null,
        CategoryId: this.groupForm.get('Category').value ?? null,
        SourceId: 'MN',
        StatusId: 'AP',
        CreateDocument: true,
        Email: false,
        Charges: [
        ],
        Products: [
        ]
      }

      const endStr = await this.tranService.convertText('on_going').toPromise();

      for (let list of this.chargeList) {
        const charge = {
          DefinitionId: list.code,
          Amount: list.total_price,
          From: list.start.replace(' ', 'T'),
          To: list.end,
          Note: list.additional_description
        };

        if (list.end === endStr) {
          charge.To = '9999-01-01T00:00:00';
        } else {
          charge.To = list.end.replace(' ', 'T');
        }
        reqData.Charges.push(charge);
      }

      for (let list of this.productList) {
        const charge = {
          ProductId: list.productid,
          Description: list.overridedescription,
          Quantity: list.quantity,
          UnitPrice: list.unitprice,
          UnitTax: list.unitprice,
          Note: list.note,
          Ids: [
          ]
        }
        reqData.Products.push(charge);
      }

      await this.loading.present();
      this.invoiceService.FinantialTransactionsAddInvoice(reqData, this.ContactCode).subscribe(async (result: any) => {
        await this.loading.dismiss();
        this.FinancialInvoiceFormComponent.emit('financials');
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      })
    }
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.FinancialInvoiceFormComponent.emit('financials');
  }

  processCharge(event) {
    if (event.type === 'totalPrice') {
      this.chargePrice = 0;
      this.chargeList = event.data;
      for (let list of event.data) {
        this.chargePrice += list.total_price;
      }
      this.groupForm.get('Amount').setValue(this.chargePrice + this.productPrice);
    }
  }

  processProduct(event) {
    if (event.type === 'totalPrice') {
      this.productPrice = 0;
      this.productList = event.data;
      for (let list of event.data) {
        this.productPrice += list.totalprice;
      }
      this.groupForm.get('Amount').setValue(this.chargePrice + this.productPrice);
    }
  }

  async getTermsList() {
    this.termList = [];
    await this.loading.present();
    this.invoiceService.getTermsList(this.ContactCode).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      for (let list of convResult?.termsprofileshistory) {
        if (list.to.toLowerCase() === 'on going') {
          if (new Date(list?.from).getTime() < new Date(this.f.Date.value).getTime()) {
            this.termList.push(list);
          }
        } else {
          if (new Date(list?.from).getTime() < new Date(this.f.Date.value).getTime() && new Date(this.f.Date.value).getTime() < new Date(list?.to).getTime()) {
            this.termList.push(list);
          }
        }
      }
      if (this.termList.length > 0) {
        this.termList.sort((b, a) => {
          return new Date(a.from).getTime() - new Date(b.from).getTime();
        });
        if (this.termList[0].termunit.toLowerCase() === 'day') {
          let currentDate = new Date(this.f.Date.value);
          currentDate.setDate(currentDate.getDate() + this.termList[0].term);
          this.groupForm.get('DueDate').setValue(currentDate);
        } else if (this.termList[0].termunit.toLowerCase() === 'month') {
          let currentDate = new Date(this.f.Date.value);
          currentDate.setMonth(currentDate.getMonth() + this.termList[0].term);
          this.groupForm.get('DueDate').setValue(currentDate);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

}
