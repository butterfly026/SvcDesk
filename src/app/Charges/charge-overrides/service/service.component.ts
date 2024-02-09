import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {

  @Input() ViewMode: string = 'List';
  @Input() ServiceReference: string = '';
  @Input() ServiceId: string = '';

  @Output('ServiceComponent') ServiceComponent: EventEmitter<string> = new EventEmitter<string>();

  pageType: string = 'service-list';

  pagingParam: any = {
    pageRowNumber: 1,
    rowStep: '10',
    SkipRecords: 0,
  };

  serviceDetail: any;

  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {
  }

  processComponent(event) {
    if (!event.includes('&')) {
      if (event === 'close') {
        this.pageType = 'service-list';
        this.pagingParam.pageRowNumber = 1;
        this.pagingParam.rowStep = '10';
        this.pagingParam.SkipRecords = 0;
      } else if (event === 'go-back') {
        this.ServiceComponent.emit('close');
      }
    } else {
      let data = event.split('&');
      if (data[0] === 'serviceUpdate') {
        this.serviceDetail = JSON.parse(data[1]);
        this.pageType = 'update';
      } else if (data[0] === 'new') {
        this.pageType = 'new';
      }
      this.pagingParam.pageRowNumber = parseInt(data[2], 10);
      this.pagingParam.rowStep = data[3];
      this.pagingParam.SkipRecords = parseInt(data[4], 10);
    }
  }

}
