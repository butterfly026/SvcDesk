import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';

import { FormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-phones',
  templateUrl: './contacts-phones.page.html',
  styleUrls: ['./contacts-phones.page.scss'],
})
export class ContactsPhonesPage implements OnInit {

  pageTitle: string = '';
  
  ContactCode: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private toast: ToastService,
    private alertCtrl: AlertController,
    private actRoute: ActivatedRoute,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('customer_contact_phones').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.ContactCode = this.actRoute.snapshot.params['Id'];
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processContactPhone(event) {
    if (event === 'close') {
      this.navCtrl.pop();
    }
  }

}
