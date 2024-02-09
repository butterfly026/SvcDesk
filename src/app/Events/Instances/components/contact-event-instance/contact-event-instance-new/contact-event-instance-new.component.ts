import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, combineLatest, of, timer } from 'rxjs';
import { debounceTime, takeUntil, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { ContactEventInstanceService } from 'src/app/Events/Instances/services';
import { EventTeam, EventTeamMember, GetContactEventDefinitionsRequest } from 'src/app/Events/Instances/models';
import { LcEventDefinition, LcEventDefinitionReason } from './contact-event-instance-new.types';
import { SpinnerService } from 'src/app/Shared/services';

@Component({
  selector: 'app-event-new',
  templateUrl: './contact-event-instance-new.component.html',
  styleUrls: ['./contact-event-instance-new.component.scss'],
})
export class ContactEventInstanceNew implements OnInit, OnDestroy {
  @Input() ContactCode: string = '';
  @Output() eventInstanceCreate: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('definitionInput') definitionInput: ElementRef<HTMLInputElement>;

  newEventForm: UntypedFormGroup;
  reasonList: LcEventDefinitionReason[] = [];
  definitionList: LcEventDefinition[] = [];
  selectedDefinition: LcEventDefinition;
  showSpinner: boolean = false;

  scheduledToList: EventTeam[] = [];
  teamScheduleToList: EventTeamMember[] = [];

  private reqData: GetContactEventDefinitionsRequest = {     
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
    SearchString:''
  };
  private availableCallForFirstTime: boolean = true;
  private availableCall: boolean = true;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private eventInstanceService: ContactEventInstanceService,
    private tranService: TranService,
    public globService: GlobalService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ContactEventInstanceNew>,
    @Inject(MAT_DIALOG_DATA) private data: { ContactCode: string }
  ) {

    this.tranService.translaterService();
    this.newEventForm = this.formBuilder.group({
      Definition: ['', Validators.required],
      Reason: [''],
      Note: [''],
      Due: [new Date()],
      ScheduledTo: [''],
      DepartmentScheduledTo: ['']
    });

     this.newEventForm.get('Reason').disable();
  }

  ngOnInit(): void {
    if (this.data?.ContactCode) {
      this.ContactCode = this.data.ContactCode;
    }

    this.getPermission();

    this.newEventForm.get('Definition').valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.unsubscribeAll$),
        filter(s => !!s)
      )
      .subscribe(result => {
        this.reqData.SearchString=result;
        if (this.availableCall && result.length>2) {          
          this.getDefinitions();
        }
        this.availableCallForFirstTime = false;
        this.availableCall = true;
      });
    
    this.newEventForm.get('ScheduledTo').valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((result: string) => {
        this.getMembers(result);
      });
    
    timer(100)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(() => {
        if (this.availableCallForFirstTime) {
          this.definitionInput.nativeElement.focus()
        }
      });

    timer(4000)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(() => {
        if (this.availableCallForFirstTime) {
          this.getDefinitions();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }
  
  goBack(val?: string): void {
    if (this.data?.ContactCode) {
      this.dialogRef.close(val);
    } else {
      this.eventInstanceCreate.emit('go-back');
    }
  }

  get f() {
    return this.newEventForm.controls;
  }

  get unschedulable(): boolean {
    return this.selectedDefinition.schedulable === 'No';
  }

  async selectDefinition(selectedDefenitionType): Promise<void> { 
    this.availableCall=false;
    this.selectedDefinition=this.definitionList.find(defenition=>defenition.name=selectedDefenitionType);   

    if (this.selectedDefinition.schedulable === 'Mandatory') {
      this.addValidators();
    }

    this.spinnerService.loading();
    
    combineLatest([
      this.eventInstanceService.getReasons(this.selectedDefinition.id),
      !this.unschedulable ? this.eventInstanceService.getTeams() : of([] as EventTeam[]),
    ])
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: async (result) => {      
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
  
        this.spinnerService.end();
      },
      error: async(error) => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    })
  }

  async eventSubmit(): Promise<void> {
    this.spinnerService.loading();
    
    const reqParam = {
      DefinitionId:this.selectedDefinition.id,      
      Note: this.newEventForm.get('Note').value,
      ReasonId: this.newEventForm.get('Reason').value,
      Due: this.newEventForm.get('Due').value,
      ScheduleToTeam: this.newEventForm.get('ScheduledTo').value,
      ScheduledToTeamMember: this.newEventForm.get('DepartmentScheduledTo').value,
      ScheduleStatus: 'Open'
    };
    this.eventInstanceService.createEvent(this.ContactCode, this.globService.convertRequestBody(reqParam))
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async (result: any) => {        
        this.spinnerService.end();
        this.goBack('ok');
      }, async (error: any) => {        
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      });
  }

  private addValidators(): void {
    this.newEventForm.get('Due').addValidators(Validators.required);
    this.newEventForm.get('ScheduledTo').addValidators(Validators.required);
    this.newEventForm.get('DepartmentScheduledTo').addValidators(Validators.required);
    this.cdr.detectChanges();
  }
  
  private getDefinitions(): void { 
    this.showSpinner = true;
    this.eventInstanceService.getDefinitions(this.ContactCode, this.reqData)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.definitionList = this.globService.ConvertKeysToLowerCase(result)?.items;
          if (!this.definitionList || this.definitionList.length === 0) {
            this.tranService.errorToastOnly('no_definitions');  
          }
          this.showSpinner = false;
        },
        error: (error) => {
          this.tranService.errorMessage(error);
          this.showSpinner = false;
        }
      });
  }

  private async getPermission(): Promise<void> {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Contacts/Events/New')
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async (_result) => {
        this.spinnerService.end();
      }, async (err) => {
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

  private async getMembers(eventTeamId): Promise<void> {
    this.spinnerService.loading();
    this.eventInstanceService.getMembers(eventTeamId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) => {
          this.teamScheduleToList = result.Member;
          this.spinnerService.end();
        },
        error: async (error) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        },
      })
  }
}
