import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, takeUntil } from 'rxjs/operators';
import { onMainContentChange, onPageReady, onSideNavChange } from '../../animations/service-new-nav-animations';
import { SidenavService } from '../../services/sidenav.service';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { Subject } from 'rxjs';
import { AlertService } from 'src/services/alert-service.service';
import { MatDialog } from '@angular/material/dialog';
import { MatAlertComponent } from 'src/app/Shared/components';
import { MatExpansionPanel } from '@angular/material/expansion';
import { NavMenuItem, ServiceConfiguration } from '../../models';

@Component({
  selector: 'app-service-new-main',
  templateUrl: './service-new-main.component.html',
  styleUrls: ['./service-new-main.component.scss'],
  animations: [ onSideNavChange, onPageReady, onMainContentChange ]
})
export class ServiceNewMainComponent implements OnInit, OnDestroy {
  @Input() ContactCode: string = '';
  @Input() ShowAskConfirm: boolean = false;
  @Output('ServiceNewMainComponent') ServiceNewMainComponent: EventEmitter<any> = new EventEmitter<any>();
  @Output('ScrollServiceNewComponent') ScrollServiceNewComponent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  serviceNewConfig: ServiceConfiguration;
  curMenu: string = '';
  isSideNavOver: boolean = false;
  canCloseWithoutConfirm: boolean = true;
  CycleLocked = [];
  public sideNavState: boolean;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  public menuList: NavMenuItem[] = [
    {name: 'ServiceType', id:'ServiceType', icon: 'details', enabled: true},
    {name: 'Porting', id:'Porting', icon: 'star', enabled: false},    
    {name: 'Attributes', id:'Attributes', icon: 'attribution', enabled: false},
    // {name: 'ServiceQualification', id:'ServiceQualification', icon: 'local_laundry_service', enabled: false},
    // {name: 'Status', id:'Status', icon: 'fact_check', enabled: false},
    // {name: 'ConnectionDate', id:'ConnectionDate', icon: 'edit_calendar', enabled: false},    
    // {name: 'Plans', id:'Plans', icon: 'next_plan', enabled: false},
    // {name: 'NetworkIdentifiers', id:'NetworkIdentifiers', icon: 'network_check', enabled: false},
    // {name: 'Features', id:'Features', icon: 'featured_play_list', enabled: false},
    // {name: 'Contracts', id:'Contracts', icon: 'assignment', enabled: false},
    // {name: 'NetworkElements', id:'NetworkElements', icon: 'settings_input_composite', enabled: false},
    // {name: 'AdditionalHardware', id:'AdditionalHardware', icon: 'hardware', enabled: false},
    {name: 'Addresses', id:'Addresses', icon: 'import_contacts', enabled: false},
    // {name: 'Sites', id:'Sites', icon: 'web', enabled: false},
    // {name: 'CostCenters', id:'CostCenters', icon: 'center_focus_strong', enabled: false},
    // {name: 'ServiceGroups', id:'ServiceGroups', icon: 'group', enabled: false},
    // {name: 'Charges', id:'Charges', icon: 'post_add', enabled: false},
    // {name: 'RelatedContacts', id:'RelatedContacts', icon: 'contacts', enabled: false},
    // {name: 'Documents', id:'Documents', icon: 'file_present', enabled: false},
    // {name: 'Notifications', id:'Notifications', icon: 'notifications_active', enabled: false},
  ]

  constructor(
    private observer: BreakpointObserver, 
    private loading: LoadingService,
    private tranService: TranService,
    public globService: GlobalService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private _sidenavService: SidenavService,
  ) { 
    for (let list of this.menuList) {
      list['selected'] = false;
      list['order'] = this.menuList.indexOf(list);
    }
    this._sidenavService.sideNavListener.subscribe( res => {
      this.sideNavState = res;
    })
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  ngOnInit() {
    this.getPermission();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ShowAskConfirm?.currentValue) {
      if (this.ShowAskConfirm == true) {
        if(this.canCloseWithoutConfirm){
          this.goBack(true);
        }else{
          const dialog = this.dialog.open(MatAlertComponent, {
            width: '100%',
            maxWidth: '450px',
            data: {
              Title: this.tranService.instant('AreYouSure'),
              ErrorMessage: this.tranService.instant('are_you_sure_close'),
              ButtonName: this.tranService.instant('Confirm'),
              ButtonOtherName: this.tranService.instant('Close')
            }
          });
      
          dialog.afterClosed().subscribe(res => {
            if (res === 'confirm') {
              this.goBack(true);
            }else{
              this.goBack(false);
            }
            this.ShowAskConfirm = false;
          })
        }
      }
    }
    
  }
  
  showDrawer(): void{
    this.sidenav.open();
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Services/New', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss(); 
          this.curMenu = 'ServiceType';         
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack(true);
            }, 1000);
          }
        }
      });
  }

  goBack(close: boolean): void{
    let reqData = {
      type: 'close',
      confirmedClose: close,
    }
    this.ServiceNewMainComponent.emit(reqData);
    
  }
  
  scrollToComponent(event: string): void{
    this.ScrollServiceNewComponent.emit(event);
  }

  processSubCommands(cmd: any): void{
    if(cmd?.type == 'ServiceConfigResponse'){
      this.serviceNewConfig = cmd.data;
      this.updateNavigationMenus();
    }else if(cmd?.type == 'menu_selected'){
        this.curMenu = cmd.data;
    }else if(cmd?.type == 'UserChangesData'){
      this.canCloseWithoutConfirm = this.canCloseWithoutConfirm  && !(cmd.data as boolean);
    }
    
  }

  private updateNavigationMenus(): void {
    const menuResult = this.serviceNewConfig;
    let tmpMenuList = [this.menuList[0]];
    Object.keys(menuResult).forEach(element => {
      const index = this.menuList.findIndex(item => item.id === element);
      if (index != -1) {
        const oldMenuItem = this.menuList[index];
        let configMenu = menuResult[element];
        if (!configMenu)
          return;
        else {
          configMenu.enabled = configMenu.Enabled;
          configMenu.order = configMenu.Order;
        }
        configMenu.id = element;
        configMenu.name = element;
        configMenu.icon = oldMenuItem.icon;

        tmpMenuList.push(configMenu);
      }

    });
    tmpMenuList.sort((a, b) => (a.order - b.order));
    this.menuList = tmpMenuList;
  }

}
