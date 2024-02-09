import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject, combineLatest, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { ContactEventInstanceService } from 'src/app/Events/Instances/services';
import { EventDefinitionDetails, EventTeam, EventTeamMember, ScheduleStatus } from 'src/app/Events/Instances/models';
import { LcEventDefinitionReason } from 'src/app/Events/Instances/components/contact-event-instance/contact-event-instance-new/contact-event-instance-new.types';
import { EditContactEventInstance } from './service-event-instance-edit.types';
import { SpinnerComponent } from 'src/app/Shared/components';
import { SpinnerService } from 'src/app/Shared/services';
import { FormatStringPipe } from 'src/app/Shared/pipes';

@Component({
  selector: 'app-service-event-instance-edit',
  templateUrl: './service-event-instance-edit.component.html',
  styleUrls: ['./service-event-instance-edit.component.scss'],
})
export class ServiceEventInstanceEdit implements OnInit, OnDestroy {

  newEventForm: UntypedFormGroup;
  reasonList: LcEventDefinitionReason[] = [];
  selectedDefinition: EventDefinitionDetails;

  scheduledToList: EventTeam[] = [];
  teamScheduleToList: EventTeamMember[] = [];
  scheduleStatusList: ScheduleStatus[] = ['Closed', 'Failed', 'Open', 'In Progress', 'Cancelled'];

  spinnerRef: MatDialogRef<SpinnerComponent>;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private eventInstanceService: ContactEventInstanceService,
    private tranService: TranService,
    private globService: GlobalService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private formatStringPipe: FormatStringPipe,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ServiceEventInstanceEdit>,
    @Inject(MAT_DIALOG_DATA) public data: EditContactEventInstance
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.newEventForm = this.formBuilder.group({
      Definition: [''],
      Reason: [this.data.eventInstance.Reason],
      Note: [ this.formatStringPipe.transform(this.data.eventInstance.Note)],
      Due: [new Date(this.data.eventInstance.Due)],
      ScheduledTo: [this.data.eventInstance.ScheduledTo],
      ScheduleStatus: [this.data.eventInstance.ScheduleStatus],
      DepartmentScheduledTo: [this.data.eventInstance.DepartmentScheduledTo]
    });

    this.newEventForm.get('ScheduledTo').valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((result: string) => {
        this.getMembers(result);
      })

    this.newEventForm.get('Definition').disable();
    this.newEventForm.get('Reason').disable();
    this.getPermission();       
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }
  
  goBack(): void {
    this.dialogRef.close();
  }

  get unschedulable(): boolean {
    return this.selectedDefinition?.Schedulable === 'No';
  }
  
  eventSubmit(): void {
    this.spinnerService.loading();

    this.eventInstanceService
      .updateEvent(
        this.data.eventInstance.Id,
        {
          ScheduleStatus: this.newEventForm.get('ScheduleStatus').value,
          Due: this.newEventForm.get('Due').value,
          Note: this.newEventForm.get('Note').value,
          ScheduleToTeam: this.newEventForm.get('ScheduledTo').value,
          ScheduledToTeamMember: this.newEventForm.get('DepartmentScheduledTo').value,
          SuppressTriggers: true
        }
      )
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => {
          this.spinnerService.end();
          this.dialogRef.close('ok');
        },
        error: (error) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
          setTimeout(() => {
            this.alertService.closeAllAlerts();
          }, 200);            
        }
      });
  }

  private initializeData(): void {
    this.eventInstanceService.getDefinitionDetails(this.data.eventInstance.DefinitionId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {

          if (result.Schedulable === 'Mandatory') {
            this.addValidators();
          }
          
          this.selectedDefinition = result;
          this.newEventForm.get('Definition').setValue(this.selectedDefinition.Name);
          this.getReasons();
        },
        error: (error) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);  

          setTimeout(() => {
            this.goBack();
          }, 1000);
        }
      });
  }
  
  private addValidators(): void {
    this.newEventForm.get('Due').addValidators(Validators.required);
    this.newEventForm.get('ScheduledTo').addValidators(Validators.required);
    this.newEventForm.get('ScheduleStatus').addValidators(Validators.required);
    this.newEventForm.get('DepartmentScheduledTo').addValidators(Validators.required);
    this.cdr.detectChanges();
  }
  
  private getReasons(): void { 
    combineLatest([
      this.eventInstanceService.getReasons(this.selectedDefinition.Id),
      !this.unschedulable ? this.eventInstanceService.getTeams() : of([] as EventTeam[]),
    ])
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: (result) => {   
        this.spinnerService.end();

        if (result[0]) {
          this.reasonList = this.globService.ConvertKeysToLowerCase(result[0]);
          if (this.reasonList.length > 0) {
            this.newEventForm.get('Reason').enable();      
            this.newEventForm.get('Reason').addValidators(Validators.required);
            this.cdr.detectChanges();
          }
        }
        if (result[1]) {
          this.scheduledToList = result[1];
        }
  
        this.getMembers(this.data.eventInstance.ScheduledTo);
      },
      error: (error) => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);  
      }
    })
  }
 
  private getPermission(): void {
    this.spinnerService.loading();

    this.globService.getAuthorization('/Contacts/Events/Update')
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((_result) => {
        this.initializeData();
      }, (err) => {
        this.spinnerService.end();

        const errResult = this.globService.ConvertKeysToLowerCase(err);
        this.tranService.errorMessage('resource_forbidden');  
        if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
          this.alertService.closeAllAlerts();
          this.newEventForm.disable();
          setTimeout(() => {
            this.goBack();
          }, 1000);
        }
      });
  }

  private getMembers(eventTeamId): void {
    this.spinnerService.loading();

    this.eventInstanceService.getMembers(eventTeamId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.teamScheduleToList = result.Member;
          this.spinnerService.end();
        },
        error: (error) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);  
        },
      })
  }
}
