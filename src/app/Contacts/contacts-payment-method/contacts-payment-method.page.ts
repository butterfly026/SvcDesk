import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contacts-payment-method',
  templateUrl: './contacts-payment-method.page.html',
  styleUrls: ['./contacts-payment-method.page.scss'],
})
export class ContactsPaymentMethodPage implements OnInit {

  ContactCode: string = '';
  pageTitle: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    public globService: GlobalService,
    private navCtrl: NavController,
  ) {
    this.ContactCode = this.activatedRoute.snapshot.params['Id'];
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processPayment(event) {
    if(event == 'close') {
      this.navCtrl.pop();
    }
  }

}
