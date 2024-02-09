import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {

  @Output('docComponent') docComponent: EventEmitter<string> = new EventEmitter<string>();

  docState: string = 'own_list';
  usersData: any;
  viewType: string = '';
  currentService: string = 'my_documents';
  showClose: boolean = true;
  
  constructor(
    public globService: GlobalService,
  ) {
    
  }

  ngOnInit() {
    this.docState = 'own_list';
  }

  setCurrentDoc() {
    this.showClose = false;
    if (this.currentService === 'my_documents') {
      this.docState = 'own_list';
      this.showClose = true;
    } else if (this.currentService === 'public_documents') {
      this.docState = 'public_list';
      this.showClose = true;
    }
  }

  processDocuments(event) {
    if (event === 'setMinHeight') {
      this.docComponent.emit(event);
    } else if (event === 'add') {
      this.docState = 'add';
    } else if (event === 'close') {
      this.setCurrentDoc();
    } else if (event.includes('selectdocumentindex')) {
      this.currentService = event.split('selectdocumentindex')[1];
      this.viewType = event.split('selectdocumentindex')[2];
      this.setCurrentDoc();
    } else {
      let data = JSON.parse(event);
      this.usersData = data;
      // this.docState = 'update';
    }
  }

  getCurrentUserType(event) {
    this.viewType = event;
  }

  close() {
    this.docComponent.emit('close');
  }

}
