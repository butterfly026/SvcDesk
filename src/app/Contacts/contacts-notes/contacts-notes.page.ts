import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-notes',
  templateUrl: './contacts-notes.page.html',
  styleUrls: ['./contacts-notes.page.scss'],
})
export class ContactsNotesPage implements OnInit {

  pageTitle: string = '';
  

  ContactCode: string = '';

  constructor(
    private navCtrl: NavController,
    private tranService: TranService,
    
    private actRoute: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.tranService.convertText('contacts_note').subscribe(result => {
      this.pageTitle = result;
    });
    this.ContactCode = this.actRoute.snapshot.params['Id'];
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

}
