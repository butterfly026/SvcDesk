import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-admin-document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.scss'],
})
export class AdminDocumentComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('AdminDocument') AdminDocument: EventEmitter<string> = new EventEmitter<string>();

  
  showClose: boolean = true;

  constructor(
    public globService: GlobalService,
  ) {
    
  }

  ngOnInit() { }

  processDocuments(event) {
    if (event === 'view' || event === 'setBothHeight') {
      this.showClose = true;
    } else {
      this.showClose = false;
    }
  }

  close() {
    this.AdminDocument.emit('close');
  }
}
