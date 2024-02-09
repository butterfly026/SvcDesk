import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animateBackText, animateText, onClickNavItem, onSideNavChange } from '../../../animations/service-new-nav-animations';
import { SidenavService } from '../../../services/sidenav.service';
import { NavMenuItem } from '../../../models/navmenu.types';

@Component({
  selector: 'app-service-new-left-menu',
  templateUrl: './service-new-left-menu.component.html',
  styleUrls: ['./service-new-left-menu.component.scss'],
  animations: [onSideNavChange, animateText, animateBackText, onClickNavItem]
})
export class ServiceNewLeftMenuComponent implements OnInit {
  @Input() pages: NavMenuItem[] = [];
  @Input() curSelMenu: string = '';
  @Output('ServiceNewLeftMenuComponent') ServiceNewLeftMenuComponent: EventEmitter<any> = new EventEmitter<any>();
  public sideNavState: boolean = false;
  public linkText: boolean = false;
  public animationState: string;

  constructor(private _sidenavService: SidenavService) { }

  ngOnInit() {
  }

  onSinenavToggle(): void {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavListener.next(this.sideNavState)
  }

  onSelectMenuItem(selectedMenu: string): void {
    this.curSelMenu = selectedMenu;
    let event = {
      type: 'menu_selected',
      data: selectedMenu
    }
    this.ServiceNewLeftMenuComponent.emit(event);
    this.animationState = 'clicked';
  }


}
