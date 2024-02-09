import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceEnquiryPasswordService } from './services/enquiry-password.service';

@Component({
  selector: 'app-service-enquiry-password',
  templateUrl: './service-enquiry-password.component.html',
  styleUrls: ['./service-enquiry-password.component.scss'],
})
export class ServiceEnquiryPasswordComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ServiceReference: string = '';
  @Output('EnquiryPassword') EnquiryPassword: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  formGroup: FormGroup;
  showForm: boolean = false;

  constructor(
    private formBulider: FormBuilder,
    private loading: LoadingService,
    private enquiryPasswordService: ServiceEnquiryPasswordService,
    private tranService: TranService,
    public globService: GlobalService,
    private alertService: AlertService,
  ) {
    this.formGroup = this.formBulider.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getPermission();
  }

  async getPermission() {
    this.showForm = false;
    await this.loading.present();
    this.globService.getAuthorization('/Services/EnquiryPassword').subscribe(async (_result) => {
      await this.loading.dismiss();
      this.showForm = true;
      this.getPasswordConfiguration();
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      console.log('errResult', errResult);
      if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
        this.tranService.errorMessage('You do not have permission for this feature. Please contact your Administrator');
        this.alertService.closeAllAlerts();
        this.showForm = false;
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } else {
        this.showForm = true;
      }
    });
  }

  async getPasswordConfiguration() {
    await this.loading.present();
    this.enquiryPasswordService.getEnquiryPassword(this.ServiceReference).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.formGroup.get('password').setValue(convResult.enquirypassword);
    }, async (error: any) => {
      await this.loading.dismiss();
      console.log(error);
      this.tranService.errorMessage(error);
    });
  }

  async putEnquiryPassword() {
    if (this.formGroup.valid) {
      const reqBody = {
        EnquiryPassword: this.formGroup.get('password').value
      }
      await this.loading.present();
      this.enquiryPasswordService.putEnquiryPassword(this.ServiceReference, reqBody).subscribe(async (result: any) => {
        await this.loading.dismiss();
        console.log(result);
        this.EnquiryPassword.emit({ type: 'password' });
        this.tranService.convertText('enquiry_pass_changed').subscribe((result: string) => {
          this.tranService.errorMessage(result);
        });
        setTimeout(() => {
          this.goBack();
        }, 1000);
      }, async (error: any) => {
        await this.loading.dismiss();
        console.log(error);
        this.tranService.errorMessage(error);
      });
    }
  }

  submitForm() {
    document.getElementById('ServiceEnquiryPasswordSubmitButton').click();
  }

  goBack() {
    this.EnquiryPassword.emit({ type: 'close' });
  }
}
