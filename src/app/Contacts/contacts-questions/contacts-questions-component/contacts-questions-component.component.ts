import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { Permission, PermissionType } from 'src/app/Shared/models';


@Component({
  selector: 'app-contacts-questions-component',
  templateUrl: './contacts-questions-component.component.html',
  styleUrls: ['./contacts-questions-component.component.scss'],
})
export class ContactsQuestionsComponentComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('QuestionIdComponent') QuestionIdComponent: EventEmitter<string> = new EventEmitter<string>();
  
  @Input() identPermissions: PermissionType[] = [];
  @Input() questionPermissions: PermissionType[] = [];

  constructor(
    private tranService: TranService,
    
    private loading: LoadingService,
    private alertCtrl: AlertController,
    private alertService: AlertService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
  }

  ngOnInit() {
    this.getPermission();
  }

  private formatPermissions(value: Permission[], type: number): void {
    if(type == 0)
      this.identPermissions = value.map(s => s.Resource.replace('/Contacts/Identifications/Documents', "").replace('/', "") as PermissionType);
    else if(type == 1)
      this.questionPermissions = value.map(s => s.Resource.replace('/Contacts/Identifications/SecurityQuestions', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Contacts/Identifications', true)      
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();   
          this.formatPermissions(_result, 0);
          this.formatPermissions(_result, 1);
          if (!this.identPermissions.includes('') && !this.questionPermissions.includes('')) {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.close();
            }, 1000);
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {            
            setTimeout(() => {
              this.close();
            }, 1000);
          }
        }
      });
  }

  close() {
    this.QuestionIdComponent.emit('close');
  }

}
