import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DeviceAddService } from './services/device-add.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-device-add',
  templateUrl: './device-add.page.html',
  styleUrls: ['./device-add.page.scss'],
})
export class DeviceAddPage implements OnInit {

  pageTitle: string = '';
  

  deviceForm: UntypedFormGroup;

  statusList = [
  ];

  typeList = [
  ];

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private deviceService: DeviceAddService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('device_add').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.deviceForm = this.formBuilder.group({
      ServiceProviderId1: [''],
      ServiceProviderId2: [''],
      Status: ['', Validators.required],
      Type: ['', Validators.required],
      Note: [''],
      Password: ['']
    });
    this.getDeviceStatusList();
    this.getDeviceTypeDisplayList();
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  getDeviceStatusList() {
    this.statusList = [];
    this.deviceService.getDeviceStatusList().subscribe((result: any) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_device_status');
      } else {
        // this.navCtrl.pop();
        for (const list of result) {
          this.statusList.push(list);
        }
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }

  getDeviceTypeDisplayList() {
    this.typeList = [];
    this.deviceService.getDeviceTypeDisplayList().subscribe((result: any) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_device_types');
      } else {
        // this.navCtrl.pop();
        for (const list of result) {
          this.typeList.push(list);
        }
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }

  async deviceAddSubmit() {
    await this.loading.present();
    const reqParam = {
      'ServiceProviderId1': this.deviceForm.controls.ServiceProviderId1.value,
      'ServiceProviderId2': this.deviceForm.controls.ServiceProviderId2.value,
      'StausId': this.deviceForm.controls.Status.value,
      'TypeId': this.deviceForm.controls.Type.value,
      // 'StausId': 1,
      // 'TypeId': 1,
      'Note': this.deviceForm.controls.Note.value,
      'Password': this.deviceForm.controls.Password.value
    }
    this.deviceService.AddNewDevice(reqParam).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      if (result === null) {
      } else {
        this.navCtrl.pop();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  get f() {
    return this.deviceForm.controls;
  }

  goBack() {
    this.navCtrl.pop();
  }

}
