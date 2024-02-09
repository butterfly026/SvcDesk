import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ContactsAccountHierarchyService } from './services/contacts-account-hierarchy.service';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';

import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-account-hierarchy',
  templateUrl: './contacts-account-hierarchy.page.html',
  styleUrls: ['./contacts-account-hierarchy.page.scss'],
})
export class ContactsAccountHierarchyPage implements OnInit {

  @ViewChild('AccountHierarchyTree') AccountHierarchyTree: jqxTreeComponent;


  pageTitle: string = '';
  

  treeList = [];
  treeData = [];

  treeViewContentHeight = '';

  selectedId = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private aHService: ContactsAccountHierarchyService,
    
    private cdr: ChangeDetectorRef,
    private alertCtrl: AlertController,
    private toast: ToastService,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('account_hierarchy').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.setHeightExpander();
    this.getTreeData();

  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async getTreeData() {
    await this.loading.present();
    this.aHService.getTreeList().subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_account_hierarchy');
      } else {
        this.treeList = result;
        this.treeData = result;
        // this.setGridData();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  Select(en: any) {
  }

  setHeightExpander() {
    const jqxTreeElement = document.getElementById('no-border');
    let customHeader;
    if (jqxTreeElement !== null) {

      const treeChild = jqxTreeElement.getElementsByClassName('jqx-widget jqx-widget-content jqx-tree');
      if (treeChild !== null) {
        for (let i = 0; i < treeChild.length; i++) {
          customHeader = treeChild[i].clientHeight;
          const tem = this.treeViewContentHeight;
          this.treeViewContentHeight = treeChild[i].clientHeight + 'px';
          if (tem !== this.treeViewContentHeight) {
            this.cdr.detectChanges();
          }
        }
      }
      return customHeader;
    } else {
      const tem = this.treeViewContentHeight;
      this.treeViewContentHeight = '100%';
      if (tem !== '' && tem !== this.treeViewContentHeight) {
        this.cdr.detectChanges();
      }
      return '100%';
    }
  }

}
