import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-contacts-aliases-toolbar',
  templateUrl: './contacts-aliases-toolbar.component.html',
  styleUrls: ['./contacts-aliases-toolbar.component.scss'],
})
export class ContactsAliasesToolbarComponent {

  @Input() hideAliasHistory: boolean = false;
  @Input() hideNamesHistory: boolean = false;

  @Output() onClickAliasHistory = new EventEmitter<void>();
  @Output() onClickNamesHistory = new EventEmitter<void>();

  onAliasHistory(): void {
    this.onClickAliasHistory.emit();
  }

  onNamesHistory(): void {
    this.onClickNamesHistory.emit();
  }

}
