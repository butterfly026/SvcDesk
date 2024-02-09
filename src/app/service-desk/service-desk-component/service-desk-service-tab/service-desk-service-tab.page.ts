import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ContactItemList } from 'src/app/model';
import { jqxTabsComponent } from 'jqwidgets-ng/jqxtabs';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService } from 'src/services';

import { ServiceDeskServiceTabService } from './services/service-desk-service-tab.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-service-desk-service-tab',
  templateUrl: './service-desk-service-tab.page.html',
  styleUrls: ['./service-desk-service-tab.page.scss'],
})
export class ServiceDeskServiceTabPage implements OnInit {

  serviceList: Array<ContactItemList> = [];

  @Input() ContactCode: string = '';
  @Output('setScrollServiceList') public setScrollServiceList: EventEmitter<string> = new EventEmitter<string>();
  @Output('getServiceDetailLavel') public getServiceDetailLavel: EventEmitter<string> = new EventEmitter<string>();


  @ViewChild('jqxTabs') jqxTabs: jqxTabsComponent;
  @ViewChild('unorderedList') unorderedList: ElementRef;
  index: number = 0;

  tabList = [];

  selectedIndex = 0;
  listLength = 0;

  currentScrollTop = 0;
  loadState = false;
  tabAvail: boolean = false;

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private sDSTService: ServiceDeskServiceTabService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {
    // this.getContactList();
    this.globService.globSubject.subscribe((result: any) => {
      if (result === 'load_end') {
        this.enableTabSelectable();
      }
    });
  }

  getContactList() {
    this.sDSTService.getContactItemList(this.ContactCode).subscribe((result: ContactItemList[]) => {
      
      for (const list of result) {
        if (list.DisplayGroup === 'SERVICE') {
          this.serviceList.push(list);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  addNewTab(en: any) {
    this.getServiceDetailLavel.emit(en + 'ServiceListNew');
  }

  selectTabs(en) {
    this.selectedIndex = en.index;
    this.cdr.detectChanges();
  }

  enableTabSelectable() {
    this.tabAvail = true;
  }

  disableTabSelectable() {
    this.tabAvail = false;
  }

  setScrollTop() {
    this.disableTabSelectable();
    const contentElement = document.getElementById('serviceDeskSplitter1');
    this.currentScrollTop = contentElement.scrollTop;
  }

  loadEnd(en: any) {
  }


  closeTab(index) {
    this.setScrollTop();
    this.tabList.splice(index, 1);
    this.selectedIndex = 0;
  }

  tabclick(event: any): void {
    if (event.args.item === this.unorderedList.nativeElement.children.length - 1) {
      const length = this.unorderedList.nativeElement.children.length;
      this.jqxTabs.addAt(event.args.item, 'Sample title ' + this.index, 'Sample content number: ' + this.index);
      this.index++;
    }
  };

  getDetailLabel(en: any) {
    this.getServiceDetailLavel.emit(en);
  }

}
