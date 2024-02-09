import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { DocumentService } from './services/document-service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit {

  @Input() ContactCode: string = '';
  

  @Output('DocumentComponent') public DocumentComponent: EventEmitter<string> = new EventEmitter<string>();

  docsParam = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
  };

  totalLength: any;

  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;

  documents: any[] = [];
  docForm: UntypedFormGroup;

  docState: string = 'view';
  currentDoc: any;

  boolList: any[] = [
    { value: true, name: 'yes' },
    { value: false, name: 'no' }
  ];

  @ViewChild('fileInput') fileInput: ElementRef;
  newFile: any = {
    name: '',
    content: ''
  }

  @ViewChild('createFile') createFile: ElementRef;
  createDoc: any = {
    name: '',
    content: ''
  }

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private docService: DocumentService,
    
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    
    this.docForm = this.formBuilder.group({});
  }

  async ngOnInit() {
    await this.loading.present();
    this.getDocuments();
  }

  getDocuments() {
    this.docState = 'view';
    this.DocumentComponent.emit('view');
    this.documents = [];
    this.docService.getAllDocuments(this.docsParam).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      const convertResult = this.globService.ConvertKeysToLowerCase(result);
      if (convertResult.documents === null) {
        this.tranService.errorToastMessage('no_reports');
      } else {

        this.totalLength = convertResult.count;
        this.documents = convertResult.documents;
        setTimeout(() => {
          this.DocumentComponent.emit('setBothHeight');
        }, 1000);

        for (let list of this.documents) {
          list.mode = false;
        }
      }
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  searchInputEvent(event) {
    if (event.keyCode === 13) {
      this.docsParam.SearchString = event.target.value;
      this.docsParam.SkipRecords = 0;
      this.docsParam.TakeRecords = 10;
      this.pageRowNumber = 1;
      this.rowStep = '10';
      this.SkipRecords = 0;
      this.getDocuments();
    }
  }

  outPagingComponent(event) {
    this.docsParam.SkipRecords = event.SkipRecords;
    this.docsParam.TakeRecords = event.TakeRecords;

    this.pageRowNumber = event.pageRowNumber;
    this.rowStep = event.rowStep;
    this.SkipRecords = event.SkipRecords;

    this.getDocuments();
  }

  goToDocDetail(index) {
    this.docState = 'edit';
    this.DocumentComponent.emit('edit');
    this.getDocDetail(this.documents[index].id);
    this.createDocumentForm();
  }

  async getDocDetail(docId) {
    await this.loading.present();
    this.docService.getDocumentDetail(docId).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      const convertResult = this.globService.ConvertKeysToLowerCase(result);
      if (convertResult === null) {
        this.tranService.errorToastMessage('no_reports');
      } else {
        this.currentDoc = convertResult;
        this.currentDoc.mode = false;
        this.docForm.get('name').setValue(this.currentDoc.name);
        this.docForm.get('note').setValue(this.currentDoc.note);
        this.docForm.get('author').setValue(this.currentDoc.author);
        this.docForm.get('dateauthored').setValue(this.currentDoc.dateauthored);
        this.docForm.get('editable').setValue(this.currentDoc.editable);
        this.docForm.get('contacteditable').setValue(this.currentDoc.contacteditable);
        this.docForm.get('contactvisible').setValue(this.currentDoc.contactvisible);
        this.docForm.get('name').disable();
        this.docForm.get('note').disable();
        this.docForm.get('author').disable();
        this.docForm.get('dateauthored').disable();
        this.docForm.get('editable').disable();
        this.docForm.get('contacteditable').disable();
        this.docForm.get('contactvisible').disable();

        this.newFile.name = this.currentDoc.filename + '.' + this.currentDoc.filetype;
      }
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  switchEdit() {
    this.currentDoc.mode = !this.currentDoc.mode;
    if (this.currentDoc.mode) {
      this.newFile.name = this.currentDoc.filename + '.' + this.currentDoc.filetype;
      this.docForm.get('name').enable();
      this.docForm.get('note').enable();
      this.docForm.get('author').enable();
      this.docForm.get('dateauthored').enable();
      this.docForm.get('editable').enable();
      this.docForm.get('contacteditable').enable();
      this.docForm.get('contactvisible').enable();
    } else {
      this.docForm.get('name').disable();
      this.docForm.get('note').disable();
      this.docForm.get('author').disable();
      this.docForm.get('dateauthored').disable();
      this.docForm.get('editable').disable();
      this.docForm.get('contacteditable').disable();
      this.docForm.get('contactvisible').disable();
    }
  }

  async deleteDocument() {
    await this.loading.present();
    this.docService.deleteDocumentDetai(this.currentDoc.id).subscribe((result: any) => {
      
      this.removeDocumentForm();
      this.getDocuments();
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitUpdate() {
    document.getElementById('submitButton').click();
  }

  async updateDocument() {
    if (this.docForm.valid) {
      let reqparam = {
        Name: this.docForm.get('name').value,
        FileType: '',
        Note: this.docForm.get('note').value,
        Author: this.docForm.get('author').value,
        DateAuthored: this.docForm.get('dateauthored').value,
        Editable: this.docForm.get('editable').value,
        ContactEditable: this.docForm.get('contacteditable').value,
        ContactVisible: this.docForm.get('contactvisible').value,
        Content: '',
        Filename: '',
      };
      if (this.currentDoc.filename + '.' + this.currentDoc.filetype === this.newFile.name) {
        reqparam.FileType = this.currentDoc.filetype;
        reqparam.Content = this.currentDoc.content;
        reqparam.Filename = this.currentDoc.filename;
      } else {
        const nameArr = this.newFile.name.split('.');
        reqparam.FileType = nameArr[nameArr.length - 1];
        reqparam.Content = this.newFile.content.split('base64,')[1];
        reqparam.Filename = this.newFile.name.split('.' + reqparam.FileType)[0];
      }

      await this.loading.present();
      this.docService.updateDocumentDetail(this.currentDoc.id, this.globService.convertRequestBody(reqparam)).subscribe(async (result: any) => {
        
        await this.loading.dismiss();

        this.currentDoc.filetype = reqparam.FileType;
        this.currentDoc.content = reqparam.Content;
        this.currentDoc.filename = reqparam.Filename;
        this.switchEdit();

      }, async (error: any) => {
        
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  getImageType(value) {
    let type = value;
    let returnValue = 'NoImageAvailable.png';
    switch (type.toLowerCase()) {
      case 'psd':
        returnValue = 'NoImageAvailable.png';
        break;
      case 'jpg':
      case 'jpeg':
        returnValue = 'JPEG-icon.png';
        break;
      case 'png':
        returnValue = 'PNG-icon.png';
        break;
      case 'pdf':
      case 'PDF':
        returnValue = 'AdobeIcon.png';
        break;
      case 'doc': case 'docx':
        returnValue = 'WordIcon.jpg';
        break;
      default:
        // returnValue = 'NoImageAvailable.png';
        break;
    }
    return returnValue;
  }

  downloadDocument() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    var downloadUrl = 'data:application/octet-stream;base64,' + this.currentDoc.content;
    a.href = downloadUrl;
    a.download = this.currentDoc.filename + '.' + this.currentDoc.filetype;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  }

  backMain() {
    if (this.docState !== 'view') {
      this.removeDocumentForm();
    }
    this.docState = 'view';
    this.DocumentComponent.emit('view');
  }

  uploadFileEvt(file: any) {
    if (file.target.files && file.target.files[0]) {
      this.newFile.name = file.target.files[0].name;

      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.newFile.content = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);

      this.fileInput.nativeElement.value = "";
    } else {
      this.newFile.name = this.currentDoc.filename + '.' + this.currentDoc.filetype;
    }
  }

  openFile() {
    document.getElementById('uploadFile').click();
  }

  async createDocument() {
    if (this.docForm.valid && this.createDoc.name !== '') {
      let reqparam = {
        Name: this.docForm.get('name').value,
        FileType: '',
        Note: this.docForm.get('note').value,
        Author: this.docForm.get('author').value,
        DateAuthored: this.docForm.get('dateauthored').value,
        Editable: this.docForm.get('editable').value,
        ContactEditable: this.docForm.get('contacteditable').value,
        ContactVisible: this.docForm.get('contactvisible').value,
        Content: '',
        Filename: '',
      };

      const nameArr = this.createDoc.name.split('.');
      reqparam.FileType = nameArr[nameArr.length - 1];
      reqparam.Content = this.createDoc.content.split('base64,')[1];
      reqparam.Filename = this.createDoc.name.split('.' + reqparam.FileType)[0];

      await this.loading.present();
      this.docService.createDocument(this.globService.convertRequestBody(reqparam)).subscribe(async (result: any) => {
        
        this.switchCreateDoc();
        this.getDocuments();
      }, async (error: any) => {
        
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  submitCreateDoc() {
    document.getElementById('createDocumentButton').click();
  }

  createFileEvent(file) {
    if (file.target.files && file.target.files[0]) {
      this.createDoc.name = file.target.files[0].name;

      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.createDoc.content = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);

      this.createFile.nativeElement.value = '';
    } else {
      this.createDoc.name = '';
    }
  }

  openCreateFile() {
    document.getElementById('createFile').click();
  }

  removeDocumentForm() {
    this.docForm.removeControl('name');
    this.docForm.removeControl('note');
    this.docForm.removeControl('author');
    this.docForm.removeControl('dateauthored');
    this.docForm.removeControl('editable');
    this.docForm.removeControl('contacteditable');
    this.docForm.removeControl('contactvisible');
  }

  createDocumentForm() {
    this.docForm.addControl('name', new UntypedFormControl('', Validators.required));
    this.docForm.addControl('note', new UntypedFormControl('', Validators.required));
    this.docForm.addControl('author', new UntypedFormControl('', Validators.required));
    this.docForm.addControl('dateauthored', new UntypedFormControl('', Validators.required));
    this.docForm.addControl('editable', new UntypedFormControl('', Validators.required));
    this.docForm.addControl('contacteditable', new UntypedFormControl('', Validators.required));
    this.docForm.addControl('contactvisible', new UntypedFormControl('', Validators.required));
  }

  switchCreateDoc() {
    if (this.docState === 'create') {
      this.backMain();
    } else {
      this.docState = 'create';
      this.DocumentComponent.emit('create');
      this.createDocumentForm();
    }
  }

}
