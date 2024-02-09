import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranService, LoadingService } from 'src/services';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-oe-home',
  templateUrl: './oe-home.page.html',
  styleUrls: ['./oe-home.page.scss'],
})
export class OeHomePage implements OnInit {

  ContactCode: string = '';
  UserName: string = '';
  

  switchMode: string = '';

  constructor(
    private router: Router,
    private tranService: TranService,
    private loading: LoadingService,
    

    @Inject(APP_CONFIG) public config: IAppConfig,
    public globService: GlobalService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    this.UserName = this.tokens.UserCode;
    this.ContactCode = this.tokens.UserCode;

    this.tranService.translaterService();
    
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  goToProduct() {
    this.switchMode = 'product';
  }

  goToOrderManagement() {
    this.switchMode = 'OrderManagement';
  }

  processOrderEntry(event) {
    
    if (event === 'close') {
      this.switchMode = '';
    }
  }

}
