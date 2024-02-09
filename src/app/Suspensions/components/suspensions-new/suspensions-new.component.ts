import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Permission, PermissionType } from 'src/app/Shared/models';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { SuspensionsService } from '../../services';
import { SuspensionReason, SuspensionType } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-suspensions-new',
  templateUrl: './suspensions-new.component.html',
  styleUrls: ['./suspensions-new.component.scss'],
})
export class SuspensionsNewComponent implements OnInit, OnDestroy {

  @Input() ServiceReference: string;
  @Output() SuspensionsNewComponent = new EventEmitter<string>();

  suspensionForm: FormGroup;

  suspensionReasons: SuspensionReason[] = [];
  suspensionTypes: SuspensionType[] = [];
  private permissions: PermissionType[];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private suspensionsService: SuspensionsService,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.suspensionForm = this.formBuilder.group({
      SuspensionTypeId: ['', Validators.required],
      ReasonId: ['', Validators.required],
      Scheduled: ['', Validators.required],
      Note: '',
      Set: true,
      BulkApply: '',
    });

    this.suspensionForm.get('SuspensionTypeId').valueChanges.subscribe(res => {
      this.suspensionReasons = this.suspensionTypes.find(s => s.Id == res).Reasons;
    });

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
    this.SuspensionsNewComponent.emit('close');
  }

  SubmitTerminate(): void {
    this.spinnerService.loading();
    this.suspensionsService.requestSuspension(this.suspensionForm.value, this.ServiceReference)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => {
          this.spinnerService.end();
          this.goBack();
        },
        error: (error) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Suspensions/New', "").replace('/', "") as PermissionType);
  }

  private getSuspensionTypes(): void {
    this.suspensionsService.getSuspensionTypes(this.ServiceReference)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.suspensionTypes = result;
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private async getPermission(): Promise<void> {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Services/Suspensions/New', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getSuspensionTypes();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => this.SuspensionsNewComponent.emit('close'), 1000);
          }
        },
        error: error => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => this.SuspensionsNewComponent.emit('close'), 1000);
          }
        }
      });
  }

}
