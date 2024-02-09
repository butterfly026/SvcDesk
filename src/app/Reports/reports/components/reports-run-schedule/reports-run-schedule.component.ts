import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { UntypedFormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import * as underScore from 'underscore';
import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { jqxListBoxComponent } from 'jqwidgets-ng/jqxlistbox';
import { GlobalService } from 'src/services/global-service.service';
import { ReportsListService, ReportsScheduledService } from '../../services';
import { ReportEmail, ReportParameter } from '../../models';

@Component({
  selector: 'app-reports-run-scehdule',
  templateUrl: './reports-run-schedule.component.html',
  styleUrls: ['./reports-run-schedule.component.scss'],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ReportsRunScehduleComponent implements OnInit {

  @ViewChild('datePickerRunUntil') public datePickerC: ElementRef;
  @ViewChild('datePickerRunOnce') public datePickerK: ElementRef;
  @ViewChild('weekDaysListBox') public weekDaysListBox: jqxListBoxComponent;

  reportForm: FormGroup;
  scheduleType: string = 'weekly';
  monthDtArr: number[] = underScore.range(1, 32);
  selectedDays: Array<string> = [];
  weekDaysList: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  showDatePickerForStopRunningReport: boolean = false;
  reportType: 'ReportOnce' | 'ReportRegular';

  emails: Array<{ Selected?: boolean } & ReportEmail> = [];
  parameters: ReportParameter[] = [];
  
  private selectedDates: Array<string | number> = [];
  private monthData: number = 0;

  constructor(
    private tranService: TranService,
    private reportsListService: ReportsListService,
    private reportsScheduledService: ReportsScheduledService,
    private spinnerService: SpinnerService,

    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<ReportsRunScehduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ContactCode: string; ReportMode: string; editData: any; ReportId: string; ReportName: string; }
  ) {}

  ngOnInit(): void {
    this.reportForm = this.formBuilder.group({
      ReportId: this.data.ReportId,
      Comments: '',
      OutputFileName: 'string',
      Priority: 0,
      Emails: new FormArray([]),
      Parameters: new FormArray([]),
      DayOfMonth: null,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
      StopState: [{ disabled: true, value: '' }, Validators.required],
      From: this.data.ReportMode === 'Edit' ? [this.data.editData.from, Validators.required] : '',
      To: this.data.ReportMode === 'Edit' ? [new Date(), Validators.required] : '',
    });

    switch (this.data.ReportMode) {
      case 'Request':
        this.scheduleType = 'weekly';
        this.getParameters();
        break;
      case 'Edit':
        this.getParameters();
        if (this.data.editData.dayofmonth === 0) {
          this.scheduleType = 'weekly';
          for (let list of this.weekDaysList) {
            if (this.data.editData[list.toLowerCase()]) {
              this.selectedDays.push(list);
            }
          }
        } else {
          this.scheduleType = 'monthly';
          this.monthData = this.data.editData.dayofmonth;
        }
        this.selectScheduleType(this.scheduleType);
        break;
      default:
        break;
    }

    this.monthDtArr = underScore.range(1, this.getDaysInMonth() + 1);
  }

  get parametersFormControl(): FormArray {
    return this.reportForm.get('Parameters') as FormArray;
  }

  openPanel(name): void {
    this.reportType = name;
    name === 'ReportOnce'
      ? this.reportForm.get('From').enable()
      : this.reportForm.get('From').disable();
  }

  closePanel(name): void {
    if (name === 'reportOnce') {
      this.reportForm.get('From').disable();
    }
  }

  getClassName(day): string {
    if (day === this.monthData) {
      return 'selected-day' + ' jqx-fill-state-normal-' + this.globService.themeColor;
    } else {
      return '';
    }
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  selectScheduleType(value): void {
    if (value === 'weekly') {
      setTimeout(() => {
        if (this.selectedDays.length > 0) {
          for (let list of this.selectedDays) {
            this.weekDaysListBox.checkIndex(this.weekDaysList.indexOf(list));
          }
        }
      }, 1000);
    }
  }

  selectDate(value): void {
    (this.selectedDates.filter(day => day === value).length) ?
      this.selectedDates.splice(this.selectedDates.indexOf(value), 1) :
      this.selectedDates.push(value);
  };

  selectDay(value): void {
    (!value.args.item.checked) ? this.selectedDays.splice(this.selectedDays.indexOf(this.weekDaysList[value.args.index]), 1)
      : this.selectedDays.push(this.weekDaysList[value.args.index]);
  };

  changeStopState(): void {
    this.showDatePickerForStopRunningReport
      ? this.reportForm.get('StopState').enable()
      : this.reportForm.get('StopState').disable()
  }

  submit(): void {
    if (this.data.ReportMode === 'Request') {
      this.reportForm.get('Emails').setValue(
        this.emails.filter(s => s.Selected).map(s => ({ EmailId: s.Id, Log: true, Output: true }))
      );

      if (this.reportType === 'ReportRegular') {
        if (this.scheduleType === 'weekly') {
          for (let list of this.selectedDays) {
            this.reportForm.get(list).setValue(true);
          }
        } else {
          // this.reportForm.get('DayOfMonth').setValue(this.selectedDates);
        }
      }

      this.spinnerService.loading();
      this.reportsScheduledService.scheduleReport(this.reportForm.value)
        .subscribe({
          next: () => {
            this.spinnerService.end();
            this.dialogRef.close();
          },
          error: error => {
            this.spinnerService.end();
            this.tranService.errorMessage(error);
          }
        });
    }
  }

  private getDaysInMonth(): number {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    var date = new Date(year, month, 1);
    var days = 0;
    while (date.getMonth() === month) {
      days++;
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  private getParameters(): void {
    this.spinnerService.loading();
    this.reportsListService.getReport(this.data.ReportId).subscribe({
      next: result => {
        this.spinnerService.end();       
  
        result.Parameters.forEach(s => {
          this.parametersFormControl.push(this.formBuilder.group({
            ReportParameterId: { disabled: s.Locked, value: s.Id },
            Value: [{ disabled: s.Locked, value: s.Default }, !s.Optional ? Validators.required : null]
          }));
        });

        this.parameters = result.Parameters;
        this.emails = result.Emails;
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

}
