import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-service-group-component',
  templateUrl: './service-group-component.page.html',
  styleUrls: ['./service-group-component.page.scss'],
})
export class ServiceGroupComponentPage implements OnInit {

  SGComponentValue: string = '';
  ServiceId: string = '';
  ServiceName: string = '';
  ServiceGroupId: string = '';
  ContactCode: string = '';
  pageTitle: string = '';
  APIKey: string = '';

  constructor(
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private tranService: TranService,
    public globService: GlobalService,
  ) {
    this.ServiceId = this.router.snapshot.params['ServiceId'];
    this.ContactCode = this.router.snapshot.params['ContactCode'];
    this.APIKey = this.router.snapshot.params['APIKey'];
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

  getMyServiceState(event) {
    if (event.includes('ServiceGroup')) {
      switch (event.split('&')[0]) {
        case 'AddServiceGroup':
          this.SGComponentValue = 'AddServiceGroup';
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
    } else {
      this.ServiceGroupId = event;
      this.SGComponentValue = 'AssignServiceAdd'
    }
  }

  getAddRequest(event) {
    this.SGComponentValue = '';
  }

}
