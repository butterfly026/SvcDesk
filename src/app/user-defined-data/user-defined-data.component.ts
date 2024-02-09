import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-user-defined-data',
  templateUrl: './user-defined-data.component.html',
  styleUrls: ['./user-defined-data.component.scss'],
})
export class UserDefinedDataComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() UserMode: string = '';
  @Output('UserDefinedDataComponent') UserDefinedDataComponent: EventEmitter<string> = new EventEmitter<string>();


  userState: string = 'list';
  usersData: any;
  
  UserDefinedId: any;

  OriginalDefinedList: any;

  constructor(
    
  ) {
    
  }

  ngOnInit() {

  }

  processComponents(event) {
    
    if (this.UserMode === '' || this.UserMode === 'list') {
      if (event === 'add') {
        this.userState = 'add';
      } else if (event === 'close-list') {
        this.UserDefinedDataComponent.emit('close');
      } else if (event === 'close') {
        this.userState = 'list';
      } else if (event.includes('update&&')) {
        let data = JSON.parse(event.split('update&&')[1]);
        this.usersData = data;
        this.userState = 'update';
        this.UserDefinedId = data.Id;
      } else if (event.includes('add&&')) {
        let data = JSON.parse(event.split('add&&')[1]);
        this.userState = 'add';
        this.OriginalDefinedList = data;
      }
    } else {
      this.UserDefinedDataComponent.emit(event);
    }
  }

}
