import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { DeviceAddService } from '../device-add/services/device-add.service';

import { ActivatedRoute } from '@angular/router';
import { DeviceUpdateService } from './services/device-update.service';
import { DeviceListItem } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-device-update',
  templateUrl: './device-update.page.html',
  styleUrls: ['./device-update.page.scss'],
})
export class DeviceUpdatePage implements OnInit {

  pageTitle: string = '';
  

  deviceForm: UntypedFormGroup;
  displayId: any;

  statusList = [
    {
      'text': 'Open',
      'value': 'Open'
    },
    {
      'text': 'status_2',
      'value': 'Status 2'
    },
    {
      'text': 'status_3',
      'value': 'Status 3'
    }
  ];

  typeList = [
    {
      'text': 'Laser',
      'value': 'Laser'
    },
    {
      'text': 'type_2',
      'value': 'Type 2'
    },
    {
      'text': 'type_3',
      'value': 'Type 3'
    }
  ];
  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private deviceService: DeviceUpdateService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private router: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('device_update').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.displayId = this.router.snapshot.params['Id'];

    this.deviceForm = this.formBuilder.group({
      Id: [''],
      ServiceProviderId1: [''],
      ServiceProviderId2: [''],
      Status: ['', Validators.required],
      Type: ['', Validators.required],
      Note: [''],
      Password: ['']
    });

    this.getDisplayItem();
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async getDisplayItem() {
    await this.loading.present();
    this.deviceService.getDeviceListFromID(this.displayId).subscribe(async (result: any[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_devices');
      } else {
        this.deviceForm.controls.Id.setValue(result[0].Id);
        this.deviceForm.controls.ServiceProviderId1.setValue(result[0].ServiceProviderId1);
        this.deviceForm.controls.ServiceProviderId2.setValue(result[0].ServiceProviderId2);
        this.deviceForm.controls.Status.setValue(result[0].Status);
        this.deviceForm.controls.Type.setValue(result[0].Type);
        this.deviceForm.controls.Note.setValue(result[0].Note);
        this.deviceForm.controls.Password.setValue(result[0].Password);
        this.deviceForm.controls.Id.disable();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async deviceUpdateSubmit() {
    await this.loading.present();
    this.deviceService.updateDevice().subscribe(async (result: any) => {
      
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
