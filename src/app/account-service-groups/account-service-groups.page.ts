import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { AccountServiceGroupService } from './services/account-service-group.service';


@Component({
  selector: 'app-account-service-groups',
  templateUrl: './account-service-groups.page.html',
  styleUrls: ['./account-service-groups.page.scss'],
})
export class AccountServiceGroupsPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountServiceControl') AccountServiceControl: EventEmitter<string> = new EventEmitter<string>();

  SGComponentValue: string = '';
  ServiceId: string = '';
  ServiceName: string = '';
  ServiceGroupId: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private aSGLService: AccountServiceGroupService,
    
    private cdr: ChangeDetectorRef,
  ) {

    this.tranService.translaterService();
  }

  ngOnInit() {

  }


  getMyServiceState(event) {
    if (event === 'setMinHeight') {
      this.AccountServiceControl.emit('setMinHeight');
    } else if (event === 'setBothHeight') {
      this.AccountServiceControl.emit('setBothHeight');
    } else if (event.includes('ServiceGroup')) {
      switch (event.split('&')[0]) {
        case 'AddServiceGroup':
          if (this.SGComponentValue === '') {
            this.SGComponentValue = 'AddServiceGroup';
            this.cdr.detectChanges();
          }
          break;
        case 'UpdateServiceGroup':
          this.SGComponentValue = 'UpdateServiceGroup';
          this.ServiceId = event.split('&')[1];
          break;
        case 'ServicesServiceGroup':
          this.SGComponentValue = 'ServicesServiceGroup';
          this.ServiceId = event.split('&')[1];
          break;
        case 'BarServiceGroup':
          this.SGComponentValue = 'BarServiceGroup';
          this.ServiceId = event.split('&')[1];
          this.ServiceName = event.split('&')[2];
          break;
        case 'UnbarServiceGroup':
          this.SGComponentValue = 'UnbarServiceGroup';
          this.ServiceId = event.split('&')[1];
          this.ServiceName = event.split('&')[2];
          break;
        default:
          break;
      }
    }
  }

  getServicesEvent(event) {
    if (event === 'close') {
      this.SGComponentValue = 'ServicesServiceGroup'
    } else if (event === 'closeServices') {
      this.SGComponentValue = '';
    } else if (event === 'setMinHeight') {
      this.AccountServiceControl.emit('setMinHeight');
    } else {
      this.ServiceGroupId = event;
      this.SGComponentValue = 'AssignServiceAdd'
    }
  }

  getAddRequest(event) {
    if (event === 'setMinHeight') {
      this.AccountServiceControl.emit('setMinHeight');
    } else if (event === 'close') {
      this.SGComponentValue = '';
    }
  }

}
