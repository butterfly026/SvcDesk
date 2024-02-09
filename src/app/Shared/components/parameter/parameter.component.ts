import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ReportParameter } from 'src/app/Reports/reports/models';
import { TranService } from 'src/services';
import { ParameterService } from '../../services';
import { ParameterDataItem } from '../../models';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss'],
})
export class ParameterComponent implements OnChanges {

  @Input() parameter: ReportParameter;
  @Input() formGroup: FormGroup;

  parameterDataList: ParameterDataItem[];
  showSpinner: boolean = false;

  private apiUrl: string;
  private availableCallAutoComplete: boolean = true;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private parameterService: ParameterService,
    private tranService: TranService
  ){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.parameter?.currentValue) {
      this.apiUrl = this.parameter.URL?.split('#')?.[0];

      if (this.apiUrl) {
        switch (changes.parameter.currentValue.DataType) {
          case 'LazyList':
            this.configLazylist();
            break;
          case 'List':
            this.getDataList();
          default:
            break;
        }      
      }
      
    }
  }

  selectAutoCompleteItem(item: ParameterDataItem): void {
    this.availableCallAutoComplete = false;
    this.formGroup.get('Value').setValue(item.Id + ' : ' + item.Name);
  }

  private configLazylist(): void {
    this.formGroup.get('Value').valueChanges
      .pipe(debounceTime(1000), takeUntil(this.unsubscribeAll$))
      .subscribe(s => {
        if (this.availableCallAutoComplete) {
          this.getAutoCompleteList(s);
        } else {
          this.availableCallAutoComplete = true;
        }
      });
  }

  private getDataList(): void {
    this.showSpinner = true;

    this.parameterService.getDataList(this.apiUrl)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.parameterDataList = result;
          this.showSpinner = false;
        },
        error: error => {
          this.showSpinner = false;
          this.tranService.errorMessage(error);
        }
      })
  }

  private getAutoCompleteList(searchString: string): void {
    this.showSpinner = true;
    this.parameterService.getAutoCompleteList(searchString, this.apiUrl)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.parameterDataList = result;
          this.showSpinner = false;
        },
        error: error => {
          this.showSpinner = false;
          this.tranService.errorMessage(error)
        }
      })
  }
}
