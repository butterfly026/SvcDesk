import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ContactMethodsService } from './services/contact-methods.service';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { UtilityService } from 'src/app/utility-method.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contact-methods',
  templateUrl: './contact-methods.page.html',
  styleUrls: ['./contact-methods.page.scss'],
})
export class ContactMethodsPage implements OnInit {

  @Input() ContactNumber: string;
  @Output('componentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();

  pageTitle: string = '';
  

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private contactService: ContactMethodsService,
    
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService,
    public globService: GlobalService,
  ) {
    
  }

  ngOnInit() {
  }

  goBack() {
    this.componentValue.emit('service_desk')
  }

}
