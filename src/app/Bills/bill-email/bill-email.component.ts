import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { MatChipList, MatChipInputEvent } from '@angular/material/chips';
import { jqxEditorComponent } from 'jqwidgets-ng/jqxeditor';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { BillEmailService } from './services/bill-email.service';
import { SpinnerService } from 'src/app/Shared/services';

@Component({
  selector: 'app-bill-email',
  templateUrl: './bill-email.component.html',
  styleUrls: ['./bill-email.component.scss'],
})
export class BillEmailComponent implements OnInit {
  

  @ViewChild('emailBody') emailBody: jqxEditorComponent;

  @ViewChild('toInput') toInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipListTo') chipListTo: MatChipList;


  emailGroup: UntypedFormGroup;

  phoneType: string = '';

  filterToList: any[] = [];

  emailList: any[] = [];

  visible = true;
  selectable = true;
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  toList: any[] = [];

  chipStateTo: string = '';

  constructor(
    private emailService: BillEmailService,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<BillEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ContactCode: string; billId: string; billNumber: string}
  ) {
    this.tranService.translaterService();

    this.emailGroup = this.fromBuilder.group({
      'toInput': [''],
      'subject': ['', Validators.required],
      'attachmentNew': [''],
      'body': [''],
      'template': [''],
      'dueDate': [''],
    });

    this.emailGroup.get('toInput').valueChanges.subscribe((result: any) => {

      this.filterToList = result ? this._filter(result.toString()) : this.emailList.slice();
    });
  }

  ngOnInit() {
    this.getEmailLists();

    this.emailGroup.get('subject').setValue(`Bill ${this.data.billNumber}`);
  }

  getChipValid(value) {
    switch (value) {
      case 'to':
        if (this.toList.length === 0) {
          this.chipListTo.errorState = true;
          this.chipStateTo = 'required';
        } else {
          this.chipListTo.errorState = false;
          this.chipStateTo = '';
          for (let list of this.toList) {
            let tempCtrl = new UntypedFormControl('', Validators.email);
            tempCtrl.setValue(list.email);
            if (!tempCtrl.valid) {
              this.chipListTo.errorState = true;
              this.chipStateTo = 'invalid';
            }
          }
        }
        break;

      default:
        break;
    }
  }

  async getEmailLists() {
    this.spinnerService.loading();
    this.emailService.getEmailLists(this.data.billId.toString()).subscribe(async (result: any) => {
      this.spinnerService.end();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      for (let list of convResult) {
        const temp = {
          email: list.address,
          id: 0,
        }
        this.emailList.push(temp);
        this.filterToList.push(temp);
      }
    }, async (error: any) => {
      this.spinnerService.end();
      this.tranService.errorMessage(error);
    })
  }

  validateFruits(to: UntypedFormControl) {
    if (to.value && to.value.length === 0) {
      return {
        validateFruitsArray: { valid: false }
      };
    }

    return null;
  }

  add(event: MatChipInputEvent, type: string): void {
    const input = event.input;
    const value = event.value;
    let tempCtrl = new UntypedFormControl('', Validators.email);
    tempCtrl.setValue(value);
    if ((value || '').trim()) {
      switch (type) {
        case 'to':
          if (tempCtrl.valid) {
            this.toList.push({ email: value.trim(), color: '', id: null });
          } else {
            this.toList.push({ email: value.trim(), color: 'warn', id: null });
          }
          this.getChipValid('to');
          break;
        default:
          break;
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove(index: number, type: string): void {
    switch (type) {
      case 'to':
        this.toList.splice(index, 1);
        this.getChipValid('to');
        break;
      default:
        break;
    }
  }

  selected(event, type: string) {
    let tempCtrl = new UntypedFormControl('', Validators.email);
    switch (type) {
      case 'to':
        if (tempCtrl.valid) {
          this.toList.push({ email: event.option.viewValue, color: '', id: this.getEmailId(event.option.viewValue) });
        } else {
          this.toList.push({ email: event.option.viewValue, color: '', id: this.getEmailId(event.option.viewValue) });
        }
        this.toInput.nativeElement.value = '';
        this.emailGroup.get('toInput').setValue(null);
        break;
      default:
        break;
    }
  }

  // addOnBlurTo(event: FocusEvent, type: string) {
  //   const target: HTMLElement = event.relatedTarget as HTMLElement;
  //   if (!target || target.tagName !== 'MAT-OPTION') {
  //     let matChipEvent: MatChipInputEvent;
  //     switch (type) {
  //       case 'to':
  //         matChipEvent = { input: this.toInput.nativeElement, value: this.toInput.nativeElement.value };
  //         this.add(matChipEvent, 'to');
  //         break;

  //       default:
  //         break;
  //     }
  //   }
  // }

  addOnBlurTo(event: MatChipInputEvent, type: string) {
   
    if (event) {
          this.add(event, 'to');         
    }
  }

  getEmailId(value) {
    let emailId = null;
    for (let list of this.emailList) {
      if (list.email === value) {
        emailId = list.id;
      }
    }
    return emailId;
  }

  private _filter(value: string): string[] {
    if (value !== null && value !== '') {
      const filterValue = value.toLowerCase();

      return this.emailList.filter(item => item.email.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  get f() {
    return this.emailGroup.controls;
  }

  getFormValidate() {
    if (this.emailGroup.valid && this.toList.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  HTMLEncode(str) {
    var i = str.length,
      aRet = [];

    while (i--) {
      var iC = str[i].charCodeAt();
      if (iC < 65 || iC > 127 || (iC > 90 && iC < 97)) {
        aRet[i] = '&#' + iC + ';';
      } else {
        aRet[i] = str[i];
      }
    }
    return aRet.join('');
  }

  async emailSend() {
    if (this.emailGroup.valid) {
      this.spinnerService.loading();
      const reqParam = this.globService.convertRequestBody({
        Recipients: [
        ],
        Subject: this.emailGroup.get('subject').value,
        // Body: this.emailBody.val(),
        // Body: this.emailGroup.get('body').value,
        Body: this.HTMLEncode(this.emailBody.val()),
        BodyFormat: 'TEXT',
        Importance: 'MEDIUM',
        AttachPDF: true,
        AttachXLS: false,
        Images: []
      })

      // if (this.EmailType === 'test-email') {
      //   reqParam.Body = this.emailBody.val();
      // }

      for (let list of this.toList) {
        const tempRecipient = {
          Id: list.id,
          Type: 'TO',
          Address: list.email,
          RequestDeliveryReceipt: false
        }
        reqParam.Recipients.push(tempRecipient);
      }

      this.emailService.emailSend(reqParam, this.data.billId).subscribe(async (result: any) => {
        this.spinnerService.end();

        this.goBack();
      }, async (error: any) => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      })
    }
  }

  triggerSubmit() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.dialogRef.close();
  }

}
