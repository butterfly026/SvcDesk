import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NavController, } from '@ionic/angular';
import { TranService } from 'src/services';

import { ServiceGroup, APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';

import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-service-group-list',
  templateUrl: './service-group-list.page.html',
  styleUrls: ['./service-group-list.page.scss'],
})
export class ServiceGroupListPage implements OnInit {

  @ViewChild('ServiceGroupListGrid') ServiceGroupListGrid: jqxGridComponent;

  groupList: Array<ServiceGroup> = [];
  isDisabled: boolean = true;

  pageTitle: string = '';
  
  ContactCode: string = '';

  constructor(
    private navCtrl: NavController,
    private tranService: TranService,
    
    private convertService: ConvertDateFormatService,
    @Inject(APP_CONFIG) public config: IAppConfig,
    public globService: GlobalService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    this.ContactCode = this.tokens.UserCode;
    this.tranService.translaterService();
    this.tranService.convertText('service_group_list').subscribe(value => {
      this.pageTitle = value;
    });

    
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.navigateRoot(['auth/signin']);
  }

}
