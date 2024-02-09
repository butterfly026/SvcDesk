import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ProductNewService } from './services/product-new-service';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.scss'],
})
export class ProductNewComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ProductType: string = '';
  @Input() ProductData: any;
  @Output('ProductNewComponent') ProductNewComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  productForm: UntypedFormGroup;
  totalPrice: number = 0;
  totalPriceStr: string = '';

  productList = [];
  filterProductList: any[] = [];

  availableCall: boolean = true;
  showSpinner: boolean = false;
  currentProduct: any;
  productId: any;

  quentityOptions = {
    align: 'left',
    allowNegative: true,
    decimal: '.',
    precision: 0,
    prefix: '',
    suffix: '',
    thousands: ',',
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private tranService: TranService,
    private loading: LoadingService,
    public globService: GlobalService,
    private modalCtrl: ModalController,
    private pNService: ProductNewService,
  ) {
    this.productForm = this.formBuilder.group({
      productId: ['', Validators.required],
      quantity: [1, Validators.required],
      unitPrice: [null, Validators.required],
      taxPrice: [{ value: null, disabled: true },],
      overrideDescription: ['',],
      serial: [''],
      note: ['']
    });

    this.totalPriceStr = this.globService.getCurrencyConfiguration(0);

    this.productForm.get('quantity').valueChanges.subscribe((result: any) => {
      if (result) {
        if (result < 0) {
          this.productForm.get('quantity').setValue(Math.abs(result));
        }
        this.getTotalCharge();
      }
    });

    this.productForm.get('taxPrice').valueChanges.subscribe((result: any) => {
      if (result) {
        if (result < 0) {
          this.productForm.get('taxPrice').setValue(Math.abs(result));
        }
        this.getTotalCharge();
      }
    });

    this.productForm.get('unitPrice').valueChanges.subscribe((result: any) => {
      if (result) {
        if (result < 0) {
          this.productForm.get('unitPrice').setValue(Math.abs(result));
        }

      } else {
        this.productForm.get('unitPrice').setErrors({ invalid: true });
      }
      this.getTotalCharge();
    });

    this.productForm.get('unitPrice').valueChanges.pipe(debounceTime(1000)).subscribe((result: any) => {
      if (result) {
        this.getProductTax(Math.abs(result));
      }
    });

    this.productForm.get('productId').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
      
      if (result) {
        if (this.availableCall) {
          this.showSpinner = true;
          await this.getProductList();
          this.showSpinner = false;
          this.filterProductList = this.filter(result);
          if (this.filterProductList.length === 0) {
            this.productForm.get('productId').setValue(null);
          } else {
          }
        }
        this.availableCall = true;
      }
    });
  }

  ngOnInit() {
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  async optionSelected(event) {
    this.availableCall = false;
    this.currentProduct = this.productForm.get('productId').value;
    this.productId = '';
    for (let list of this.filterProductList) {
      if (this.currentProduct === list.name) {
        this.productId = list.id;
        this.productForm.get('unitPrice').setValue(list?.price);
        this.productForm.get('taxPrice').setValue(list?.tax);
      }
    }

    if (this.productList.filter(it => it.name === this.productForm.get('productId').value).length === 0) {
      this.productForm.get('productId').setErrors({ invalid: true });
    } else {
      for (let list of this.filterProductList) {
        if (this.productForm.get('productId').value === list.name) {
          this.productId = list.id;
        }
      }
    }
  }

  get f() {
    return this.productForm.controls;
  }

  // async getProductList() {
  //   const reqBody = {
  //     OperationId: '/Inventory/Available/Products#get',
  //   }
  //   try {
  //     const result = await this.globService.operationAPIService(reqBody).toPromise();

  //     this.productList = this.globService.ConvertKeysToLowerCase(JSON.parse(result)).items;
  //     if (this.ProductType === 'update') {
  //       for (let list of this.productList) {
  //         if (this.ProductData?.productid === list.id) {
  //           this.productForm.get('productId').setValue(list.name);
  //         }
  //       }
  //       this.productForm.get('quantity').setValue(this.ProductData?.quantity);
  //       this.productForm.get('unitPrice').setValue(this.ProductData?.unitprice);
  //       this.productForm.get('overrideDescription').setValue(this.ProductData?.overridedescription);
  //       this.productForm.get('serial').setValue(this.ProductData?.serial);
  //       this.productForm.get('note').setValue(this.ProductData?.note);
  //     } else {
  //     }
  //   } catch (error) {
  //     this.tranService.errorMessage(error);
  //   }
  // }

  async getProductList() {
    try {
      const result = await this.pNService.getProducts('/Inventory/Available/Products').toPromise();
      this.productList = this.globService.ConvertKeysToLowerCase(result).items;
      if (this.ProductType === 'update') {
        for (let list of this.productList) {
          if (this.ProductData?.productid === list.id) {
            this.productForm.get('productId').setValue(list.name);
          }
        }
        this.productForm.get('quantity').setValue(this.ProductData?.quantity);
        this.productForm.get('unitPrice').setValue(this.ProductData?.unitprice);
        this.productForm.get('overrideDescription').setValue(this.ProductData?.overridedescription);
        this.productForm.get('serial').setValue(this.ProductData?.serial);
        this.productForm.get('note').setValue(this.ProductData?.note);
      } else {
      }
    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  getTotalCharge() {
    this.totalPrice = this.productForm.get('quantity').value * this.productForm.get('unitPrice').value - this.productForm.get('taxPrice').value;
    this.totalPriceStr = this.globService.getCurrencyConfiguration(this.totalPrice);
  }

  getIds() {

  }

  async getProductTax(Amount) {
    await this.loading.present();
    this.pNService.ProductTax(this.ContactCode, Amount).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      // this.productForm.get('taxPrice').setValue(Math.abs(result));
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }

  submitTrigger() {
    document.getElementById('financialProductNewSubmitButton').click();
  }

  submitForm() {
    if (this.productForm.valid) {
      let data = this.productForm.value;
      data.totalPrice = this.totalPrice;
      data.productidVal = this.productId;

      this.modalCtrl.dismiss({ type: 'list', data: data });

    }
  }

  goBack() {
    this.modalCtrl.dismiss({ type: 'close' });
  }

}
