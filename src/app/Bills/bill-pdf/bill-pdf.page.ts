import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-bill-pdf-page',
  templateUrl: './bill-pdf.page.html',
  styleUrls: ['./bill-pdf.page.scss'],
})
export class BillPdfPage implements OnInit {

  

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    
    public globService: GlobalService,
    private router: Router,
  ) {
    this.tranService.translaterService();
    
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  close() {
    this.navCtrl.pop();
  }

}
