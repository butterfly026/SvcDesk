import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ServiceServiceGroupAssignListService } from './services/svc-svc-group-assign-list.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ServiceGroupItem, ServiceGroup, ServiceGroupServiceAssignment } from 'src/app/model';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

var rowData: any;

@Component({
  selector: 'app-svc-svc-group-assignment-history',
  templateUrl: './svc-svc-group-assignment-history.page.html',
  styleUrls: ['./svc-svc-group-assignment-history.page.scss'],
})
export class SvcSvcGroupAssignmentHistoryPage implements OnInit {


  @ViewChild('SvcSvcGroupAssignGrid') SvcSvcGroupAssignGrid: jqxGridComponent;
  @ViewChild('SvcSvcGroupAssignGrid2') SvcSvcGroupAssignGrid2: jqxGridComponent;

  isDisabled: boolean = true;

  pageTitle: string = '';
  
  serviceId: string = '';

  ServiceGroupId: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sSGALService: ServiceServiceGroupAssignListService,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();
    this.tranService.convertText('service_group_assignment').subscribe(value => {
      this.pageTitle = value;
    });
    this.serviceId = this.route.snapshot.params['Id'];

  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  goBack() {
    // this.navCtrl.pop();
  }

  goToAddService() {
    this.navCtrl.navigateForward(['ServiceGroups/service-add', this.ServiceGroupId]);
  }

  processServiceGroup(event) {
    if (event === 'close') {
      this.navCtrl.pop();
    } else {
      this.navCtrl.navigateForward(['ServiceGroups/service-add', event]);
    }
  }

}
