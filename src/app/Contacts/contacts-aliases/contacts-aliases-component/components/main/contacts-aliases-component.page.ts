import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { AliasType, ContactNames, Titles, ContactNameUpdate } from 'src/app/model';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { Permission } from 'src/app/Shared/models';
import { DialogComponent, MatAlertComponent } from 'src/app/Shared/components';
import { ContactsAliasesService } from '../../services';
import { ContactsNamesPermissionType } from '../../models';
import { ContactAliasHistoryPage, ContactNameHistoryPage } from '..';

@Component({
  selector: 'app-contacts-aliases-component',
  templateUrl: './contacts-aliases-component.page.html',
  styleUrls: ['./contacts-aliases-component.page.scss'],
})
export class ContactsAliasesComponentPage implements OnInit, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('ContactAliasesComponent') ContactAliasesComponent: EventEmitter<string> = new EventEmitter<string>();

  formGroup: UntypedFormGroup;
  saveState: boolean = false;
  typeList: AliasType[] = [];
  titleList: Titles[] = [];
  contactType: 'P' | 'B' = 'B';

  private permissions: string[] = [];
  private orignalValue: ContactNameUpdate;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private contactsAliasesService: ContactsAliasesService,
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.getPermission();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get contactAliasesFormControl(): FormArray {
    return this.formGroup.get('ContactAliases') as FormArray;
  }

  checkPermission(value: ContactsNamesPermissionType): boolean {
    return this.permissions.includes(value);
  }
  
  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  goBack(): void {
    this.saveState 
      ? this.presentAlert() 
      : this.ContactAliasesComponent.emit('close');
  }

  addNewGroup(): void {
    this.contactAliasesFormControl.push(this.formBuilder.group({
      TypeCode: ['', Validators.required],
      Alias: ['', Validators.required]
    }));
  }

  deleteGroup(index): void {
    this.contactAliasesFormControl.removeAt(index);
  }

  goToAliasHistory(): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '650px',
      panelClass: 'dialog',
      data: {
        component: ContactAliasHistoryPage,
        ContactCode: this.ContactCode
      }
    });
  }

  goToNameHistory(): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '650px',
      panelClass: 'dialog',
      data: {
        component: ContactNameHistoryPage,
        ContactCode: this.ContactCode
      }
    });
  }
 
  submitGroup(): void {
    this.spinnerService.loading();
    this.contactsAliasesService.ContactNamesUpdate(this.formGroup.value, this.ContactCode)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: () => {
        this.spinnerService.end();
        this.ContactAliasesComponent.emit(this.formGroup.value?.Name);
        this.saveState = false;
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Names', "").replace('/', "") as ContactsNamesPermissionType);
  }

  private presentAlert(): void {
    const dialog = this.dialog.open(MatAlertComponent, {
      width: '100%',
      maxWidth: '450px',
      data: {
        Title: this.tranService.instant('your_change_lost'),
        ErrorMessage: this.tranService.instant('are_you_sure'),
        ButtonName: this.tranService.instant('Yes'),
        ButtonOtherName: this.tranService.instant('Close')
      }
    });

    dialog.afterClosed().subscribe(res => {
      if (res === 'confirm') {
        this.ContactAliasesComponent.emit('close');
      }
    })
  }

  private setFormData(data: ContactNames): void {
    this.formGroup = this.formBuilder.group({
      ContactKey: '',
      ContactAliases: new FormArray([]),
      Name: [data.Name, Validators.required],
      Title: [{ disabled: this.contactType === 'B', value: data.Title }, Validators.required],
      Initials: { disabled: this.contactType === 'B', value: data.Initials },
      FirstName: [{ disabled: this.contactType === 'B', value: data.FirstName }, Validators.required]
    });

    data.ContactAliases.forEach(s => {
      this.contactAliasesFormControl.push(this.formBuilder.group({
        TypeCode: [s.TypeCode, Validators.required],
        Alias: [s.Alias, Validators.required]
      }))
    });

    this.orignalValue = this.formGroup.value;
    this.formGroup.valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(res => this.saveState = JSON.stringify(this.orignalValue) !== JSON.stringify(res));
  }

  private getAliasType(): void {
    this.spinnerService.loading();
    this.contactsAliasesService.AliasTypes()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: AliasType[]) => {
          this.spinnerService.end();
          this.typeList = result;
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private getTitles(): void {
    this.spinnerService.loading();
    this.contactsAliasesService.Titles()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Titles[]) => {
          this.spinnerService.end();
          this.titleList = result;
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private getContactNames() {
    this.spinnerService.loading();
    this.contactsAliasesService.ContactNames(this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('no_contacts_aliases');
          } else {
            this.contactType = result.ContactType;
            this.setFormData(result);
          }
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Contacts/Names', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(result => {
        this.formatPermissions(result);
        this.spinnerService.end();
        if (this.checkPermission('')) {
          this.getContactNames();
          if (!this.checkPermission('Update')) {
            this.formGroup.disable();
          }
  
          if (this.checkPermission('Aliases')) {
            this.getAliasType();
          }

          this.getTitles();
        } else {
          this.tranService.errorMessage('resource_forbidden');
          setTimeout(() => this.goBack(), 1000);
        }
      }, err => {
        this.spinnerService.end();
        const errResult = this.globService.ConvertKeysToLowerCase(err);
        this.tranService.errorMessage('resource_forbidden');
        if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
          this.formGroup.disable();
          setTimeout(() => this.goBack(), 1000);
        }
      });
  }
}
