import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AccountNewService } from 'src/app/Accounts/new-account/services/new-account.service';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ContactFormItem, ContactTitles, RelatedContact, RelatedContactDetail, RelationshipType } from './related-contacts.types';
import { AlertService } from 'src/services/alert-service.service';
import { RelatedContactsService } from './services/related-contacts.service';
import { AlertController } from '@ionic/angular';
import { ContactAuthenticationComponent } from 'src/app/Authentication/contact-authentication/contact-authentication.component';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { IdentificationItem } from '../contacts-questions/contacts-questions.page.types';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RelatedContactsNewComponent } from './related-contacts-new/related-contacts-new.component';
import { takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/Shared/components';

@Component({
  selector: 'app-related-contacts',
  templateUrl: './related-contacts.component.html',
  styleUrls: ['./related-contacts.component.scss']
})
export class RelatedContactsComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('RelatedContactsComponent') RelatedContactsComponent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren(ContactAuthenticationComponent) authComponents: QueryList<ContactAuthenticationComponent>;
  @Input() Refresh: Boolean = true;
  @Input() permissions: PermissionType[] = [];

  dataSource: RelatedContact[] = [];
  totalCount: number;
  expandServiceList = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  searchOptions: SearchOption[] = [];

  eventParam = new Paging();


  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;
  csvFileName: string = '';
  
  groupList: ContactFormItem[] = [];
  contactForm: UntypedFormGroup;
  typeList: RelationshipType[] = [];
  titleList: ContactTitles[] = [];
  arrayLength: number = 0;

  areSure: string = '';
  warning: string = '';

  
  deletionMsg: MessageForRowDeletion = {
    header: '',
    message: ''
  }

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private alertCtrl: AlertController,
    private relateService: RelatedContactsService,
    public globService: GlobalService,
  ) {
    this.configInitialValues();
    
    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.areSure = value;
      this.deletionMsg.header = value;
    });
    this.tranService.convertText('ask_set_authentication').subscribe(value => {
      this.warning = value;
    });
    this.tranService.convertText('delete_confirm_related_contact').subscribe(value => {
      this.deletionMsg.message = value;
    });
    
    
  }

  private configInitialValues(): void {
    this.columns = [
      'Id',
      'Name',
      'Type',
      'Email',
      'Mobile',
    ];
  }

  ngOnInit() {
    this.csvFileName = 'Related Contacts - ' + this.ContactCode;
    this.getPermission();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getRelatedContactList()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getRelatedContactList();
  }
  
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/RelatedContacts', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Contacts/RelatedContacts', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getRelatedContactList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.closeComponent();
            }, 1000);
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.closeComponent();
            }, 1000);
          }
        }
      });
  }

  private async getRelatedContactList(){
    await this.loading.present();
    this.relateService.getRelatedContactsList(this.ContactCode)
      .subscribe({
        next: async (_result: RelatedContact[]) => {
          if (_result) {
            this.dataSource = _result.map((map: RelatedContact) => {
              map.Id = map.RelatedContactCode;
              map.Name = map.RelatedContact;
              let type = '';
              if(map.Relationships){
                map.Relationships.forEach(rel => {
                  type += type ? `, ${rel.Name}` : rel.Name;
                })
                map.Type = type;
              }
              return map as RelatedContact;
            });
          }
          await this.loading.dismiss();
        },
        error: async (err) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(err);
        }
      });
  }

  async removeContactForm(index: number, currentGroup: ContactFormItem) {
    
  }

  closeComponent() {
    this.RelatedContactsComponent.emit('close');
  }

  async updateRelatedContact(selectedData: RelatedContact) { 
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '450px',
      panelClass: 'dialog',
      data: {
        component: RelatedContactsNewComponent,
        ContactCode: this.ContactCode,
        EditMode: 'Update',
        Data: selectedData,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.askSetAuthentication(res);
      }
    });

  }

  async deleteRelatedContact(selectedData: RelatedContact ){
    await this.loading.present();
    this.relateService.deleteRelatedContact(this.ContactCode, selectedData.Id)
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.getRelatedContactList();
        },
        error: async (err) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(err);
        }
      });
  }

  async addNewRelatedContact(){
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '450px',
      panelClass: 'dialog',
      data: {
        component: RelatedContactsNewComponent,
        ContactCode: this.ContactCode,
        EditMode: 'New',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.askSetAuthentication(res);
      }
    });
  }

  async askSetAuthentication(relatedId: string){
    const alert = await this.alertCtrl.create({
      message: this.warning,
      subHeader: this.areSure,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.getRelatedContactList();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.setAuthenticationInfo(relatedId);
            
          }
        }
      ]
    });
    await alert.present();    
  }

  
  async setAuthenticationInfo(relatedId: string){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '450px',
      panelClass: 'dialog',
      data: {
        component: ContactAuthenticationComponent,
        ContactCode: this.ContactCode,
        RelatedId: relatedId,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getRelatedContactList();
    });

  }

}
