import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AddressifyService } from './services/addressfiy-service';

@Component({
  selector: 'app-addressify',
  templateUrl: './addressify.component.html',
  styleUrls: ['./addressify.component.scss'],
})
export class AddressifyComponent implements OnInit {

  @Input() AddressType: string = '';
  @Input() UpdateAddress: any;
  @Input() AddressSubject: Subject<any> = new Subject<any>();

  @Output('AddressOutput') AddressOutput: EventEmitter<any> = new EventEmitter<any>();

  
  addressMode: string = '';
  typeList: any[] = [];
  availAddress: boolean = false;
  showClear: boolean = false;
  showSpinner: boolean = false;
  addressLists: any[] = [];

  addressTimer;
  addressForm: UntypedFormGroup;

  constructor(
    private tranService: TranService,
    private addressService: AddressifyService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.addressForm = this.formBuilder.group({});
  }

  ngOnInit() {

    if (this.UpdateAddress) {
      this.addressMode = 'normal';
      this.addressForm.addControl('Address1', new UntypedFormControl('',));
      this.addressForm.addControl('Address2', new UntypedFormControl('',));
      this.addressForm.addControl('Suburb', new UntypedFormControl('',));
      this.addressForm.addControl('City', new UntypedFormControl('',));
      this.addressForm.addControl('State', new UntypedFormControl('',));
      this.addressForm.addControl('Postcode', new UntypedFormControl('',));
      this.addressForm.addControl('CountryCode', new UntypedFormControl('',));

      this.addressForm.get('Address1').setValue(this.UpdateAddress.address1);
      this.addressForm.get('Address2').setValue(this.UpdateAddress.address2);
      this.addressForm.get('Suburb').setValue(this.UpdateAddress.suburb);
      this.addressForm.get('City').setValue(this.UpdateAddress.city);
      this.addressForm.get('State').setValue(this.UpdateAddress.state);
      this.addressForm.get('Postcode').setValue(this.UpdateAddress.postcode);
      this.addressForm.get('CountryCode').setValue(this.UpdateAddress.countrycode);
    } else {
      if (this.AddressType === 'ADDRESSIFY') {
        this.addressMode = 'component';
        this.addressForm.addControl('AutoCompleteAddress', new UntypedFormControl('', Validators.required));
        this.addressForm.addControl('addressType', new UntypedFormControl('', Validators.required));
      } else {
        this.addressMode = 'normal';
        this.addressForm.addControl('Address1', new UntypedFormControl('',));
        this.addressForm.addControl('Address2', new UntypedFormControl('',));
        this.addressForm.addControl('Suburb', new UntypedFormControl('',));
        this.addressForm.addControl('City', new UntypedFormControl('',));
        this.addressForm.addControl('State', new UntypedFormControl('',));
        this.addressForm.addControl('Postcode', new UntypedFormControl('',));
        this.addressForm.addControl('CountryCode', new UntypedFormControl('',));
      }
    }

    this.getAddressTypeList();

    this.AddressSubject.subscribe((result: any) => {
      
      if (result === 'formsubmit') {
        document.getElementById('submit-address').click();
      } else {
      }
    });

    this.globService.globSubject.subscribe((result: any) => {
      if (result === 'ServiceAddAddressSubmit') {
        document.getElementById('submit-address').click();
      }
    })
  }

  getAddressTypeList() {
    this.addressService.ContactAddressTypes().subscribe((result: any) => {
      
      this.typeList = this.globService.ConvertKeysToLowerCase(result);
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });
  }

  addresskeyDown() {
    this.availAddress = false;
    if (this.addressForm.get('AutoCompleteAddress').value) {
      this.showClear = true;
    } else {
      this.showClear = false;
    }
  }

  addresKyeUp(event) {
    this.availAddress = true;
    clearTimeout(this.addressTimer);
    switch (event.keyCode) {
      case 37:
      case 38:
      case 39:
      case 40:
      case 13:
      case 20:
      case 17:
      case 27:
      case 18:
      case 91:
      case 16:
        break;
      default:
        if (this.addressForm.get('AutoCompleteAddress').value.length === 8) {
          this.getAddressList(this.addressForm.get('AutoCompleteAddress').value);
        }
        this.addressTimer = setTimeout(() => {
          if (this.availAddress && this.addressForm.get('AutoCompleteAddress').value !== '') {
            this.getAddressList(this.addressForm.get('AutoCompleteAddress').value);
          }
        }, 1000);
        break;
    }

    if (this.addressForm.get('AutoCompleteAddress').value) {
      this.showClear = true;
    } else {
      this.showClear = false;
    }

  }

  getAddressList(termValue) {
    this.showSpinner = true;
    const reqParam = {
      Term: termValue
    }
    this.addressLists = [];
    this.availAddress = false;

    this.addressService.getAustraliaAddressList(reqParam).subscribe((result: any) => {
      
      this.showSpinner = false;
      setTimeout(() => {
        this.addressLists = this.globService.ConvertKeysToLowerCase(result);
      }, 500);
    }, (error: any) => {
      
      this.showSpinner = false;
      this.tranService.errorMessage(error);
    });
  }

  focustOutAddress() {
    this.showSpinner = false;
  }

  clearSearch() {
    this.showClear = false;
    this.addressLists = [];
    this.addressForm.get('AutoCompleteAddress').reset();
  }

  getAustraliaAddressDetail(termValue) {
    const reqParam = {
      Term: termValue
    }
    this.addressService.getAustraliaAddressDetail(reqParam).subscribe((result: any) => {
      
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });
  }

  createAddress() {
    if (this.addressForm.valid) {
      let param;
      if (this.addressMode === 'component') {
        const reqParam = {
          Term: this.addressForm.get('AutoCompleteAddress').value
        }
        this.addressService.getAustraliaAddressDetail(this.globService.convertRequestBody(reqParam)).subscribe((result: any) => {
          
          const convertResult = this.globService.ConvertKeysToLowerCase(result);
          param = {
            Address1: convertResult.buildingname + convertResult.leveltype + convertResult.levelnumber + convertResult.unittype +
              convertResult.unitnumber + convertResult.streetline,
            Address2: convertResult.suburb,
            Suburb: convertResult.suburb,
            City: '',
            State: convertResult.state,
            Postcode: convertResult.postcode,
            CountryCode: 'AU',
          }
          this.AddressOutput.emit(this.globService.convertRequestBody(param));
        }, (error: any) => {
          
          this.tranService.errorMessage(error);
        });
      } else {
        param = {
          Address1: this.addressForm.get('Address1').value,
          Address2: this.addressForm.get('Address2').value,
          Suburb: this.addressForm.get('Suburb').value,
          City: this.addressForm.get('City').value,
          State: this.addressForm.get('State').value,
          Postcode: this.addressForm.get('Postcode').value,
          CountryCode: this.addressForm.get('CountryCode').value,
        }
        this.AddressOutput.emit(this.globService.convertRequestBody(param));
      }
    } else {
      this.AddressOutput.emit('Invalid');
    }
  }

}
