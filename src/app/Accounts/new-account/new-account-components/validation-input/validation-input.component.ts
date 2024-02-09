import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AccountNewService } from '../../services/new-account.service';
import { TranService } from 'src/services';
import { ValidationResponse, ValidationRuleResult } from '../../new-account.types';

@Component({
  selector: 'app-validation-input',
  templateUrl: './validation-input.component.html',
  styleUrls: ['./validation-input.component.scss']
})
export class ValidationInputComponent implements OnInit, OnChanges {

  
  @Input() inputFormControl: FormControl;
  @Input() placeHolder: string;
  @Input() requiredErrorMessage: string;
  @Input() inputType: string;
  @Input() validationCode: string;

  errorMsgs: ValidationRuleResult[] = [];
  warningMsgs: ValidationRuleResult[] = [];
  inProgress: boolean = false;
  isInitiated: boolean = false;
  network_error_msg: string = '';
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private accountSvc: AccountNewService,
    private tranService: TranService,
  ){

  }

  ngOnInit(): void {    
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.validationCode?.currentValue && this.inputFormControl) {
      this.checkValidationCode(this.inputFormControl.value, this.validationCode);
    }
    if (changes.inputFormControl?.currentValue && !this.isInitiated){
      this.inputFormControl.valueChanges
      .pipe(takeUntil(this.unsubscribeAll$), 
        debounceTime(1000))
      .subscribe((result: any) => {        
        if(result){
          this.checkValidationCode(result, this.validationCode);
        } else {
          this.warningMsgs = [];
        }
      });
      this.isInitiated = true;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async checkValidationCode(value: string, validationCode: string): Promise<void>{
    if(!validationCode || !value) return;
    this.inProgress = true;    
    this.accountSvc.checkValidation(validationCode, value).subscribe(async (_result: ValidationResponse) => {      
      this.inProgress = false;
      this.errorMsgs = [];
      this.warningMsgs = _result?.Results?.filter(s => s.Result == 'Warning') ;
      this.errorMsgs = _result?.Results?.filter(s => s.Result == 'Error') ;
      if(!_result.Valid){
        this.inputFormControl.setErrors({ 'invalid': true });        
        this.inputFormControl.markAsTouched();
      } else {
        this.inputFormControl.setErrors(null);
      }      
      
      
    }, async (err) => {
      this.inProgress = false;
      this.inputFormControl.setErrors({ 'invalid_network': true });   
      this.tranService.errorMessage(err);      
    });
  }

}
