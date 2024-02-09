import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-event-instance',
  templateUrl: './event-instance.component.html',
  styleUrls: ['./event-instance.component.scss'],
})
export class EventInstanceComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Mode: string = 'List';
  @Output('EventInstanceComponent') EventInstanceComponent: EventEmitter<string> = new EventEmitter<string>();

  Refresh: Boolean = true;
  pagingParam: any = {
    pageRowNumber: 1,
    rowStep: '10',
    SkipRecords: 0,
  };
  
  private ViewType: string = 'list';

  ngOnInit(): void {
    this.ViewType = this.Mode;   
  }

  
  processEvent(event): void { 
    if (this.ViewType === 'list') {
      if (!event.includes('&')) {
        if (event === 'close') {
          this.ViewType = 'list';          
          this.pagingParam.pageRowNumber = 1;
          this.pagingParam.rowStep = '10';
          this.pagingParam.SkipRecords = 0;
        } else if (event === 'go-back') {
          this.EventInstanceComponent.emit('close');
        } else if (event === 'eventDetail') {
          this.ViewType = 'detail';
        }
      } else {
        let data = event.split('&');
        if (data[0] === 'eventDetail') {
          this.ViewType = 'detail';
          this.pagingParam.pageRowNumber = parseInt(data[2], 10);
          this.pagingParam.rowStep = data[3];
          this.pagingParam.SkipRecords = parseInt(data[4], 10);
        }
      }
      this.Mode=this.ViewType;
    } else {    
      if (event === 'go-back') {
        this.EventInstanceComponent.emit('close')
      } else {
        this.EventInstanceComponent.emit(event);
      }
    }
  }
}
