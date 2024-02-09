import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { onSideNavChange, animateText, onClickNavItem, animateBackText } from 'src/app/Services/service-new/animations/service-new-nav-animations';
import { NavMenuItem } from 'src/app/Services/service-new/models';
import { SidenavService } from 'src/app/Services/service-new/services/sidenav.service';

@Component({
  selector: 'app-account-left-side-menu',
  templateUrl: './account-left-side-menu.component.html',
  styleUrls: ['./account-left-side-menu.component.scss'],
  animations: [onSideNavChange, animateText, animateBackText, onClickNavItem]
})
export class AccountLeftSideMenuComponent implements OnInit {
  @Input() pages: NavMenuItem[] = [];
  @Input() curSelMenu: string = '';
  @Input() isAccountTypeSelected: boolean = false;
  @Output('AccountLeftSideMenuComponent') AccountLeftSideMenuComponent: EventEmitter<any> = new EventEmitter<any>();
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
    this.AccountLeftSideMenuComponent.emit(event);
    this.animationState = 'clicked';
  }


}
