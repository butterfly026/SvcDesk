import { UntypedFormBuilder, UntypedFormControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, ChangeDetectorRef, } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoadingService, TranService, GridService, FileService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AccountDocumentService } from './services/account-document-service';
@Component({
  selector: 'app-account-document',
  templateUrl: './account-document.component.html',
  styleUrls: ['./account-document.component.scss'],
  providers: [DatePipe]
})
export class AccountDocumentComponent implements OnInit {

  @Input() AccountCode: string = '';  
  @Input() currentDoc: any; 
  @Input() docState:any='create';

  @Output('AccountDocumentComponent') public AccountDocumentComponent: EventEmitter<any> = new EventEmitter<any>();

  docForm: UntypedFormGroup;

  dateAuthor: any;
  documentList: any[] = [];
  
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
    private docService: AccountDocumentService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public globService: GlobalService
    
  ) {    

    this.docForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Category: ["User", Validators.required],
      FileType: ['', Validators.required],
      Note: [''],
      Author: ['', Validators.required],
      DateAuthored: ['', Validators.required],
      UserEditable: true,
      AccountEditable: true,
      AccountVisible: true,
      Content: ['']
    });
  }

  async ngOnInit() {  
    let d = new Date();
    this.dateAuthor = this.datePipe.transform(d, 'yyyy-MM-dd');
       
  }

  async createDocument() {
    console.log('doc: ', this.docForm.value);
    let reqParam = {
      "Name": this.docForm.get("Name").value,
      "Category": this.docForm.get("Category").value,
      "FileType": this.docForm.get("FileType").value,
      "Note": this.docForm.get("Note").value,
      "Author": this.docForm.get("Author").value,
      "DateAuthored": this.docForm.get("DateAuthored").value,
      "UserEditable": this.docForm.get("UserEditable").value,
      "AccountEditable": this.docForm.get("AccountEditable").value,
      "AccountVisible": this.docForm.get("AccountVisible").value,
      "Content": this.docForm.get("Content").value
    }
    this.Close();
    await this.loading.present();
    this.docService.createDocument(this.globService.convertRequestBody(reqParam), this.AccountCode).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.tranService.errorToastMessage(result);
      this.AccountDocumentComponent.emit({ type: 'created', id: result.Id });
      // this.Close();
    }, async (error: any) => { 
      console.log('error', error)
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }
  Close(){
    this.AccountDocumentComponent.emit('close');
  }
  submitCreateDoc() {
    document.getElementById('createDocumentButton').click();
  }
  createFileEvent(file) {
    if (file.target.files && file.target.files[0]) {
      const selectedFiles = file.target.files as FileList;
      let name = selectedFiles[0].name;
      this.createDoc.name = name;
      this.docForm.get('Name').setValue(name);
      this.docForm.get('FileType').setValue(name.split('.')[1].toLowerCase());
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.createDoc.content = e.target.result;
        this.docForm.get('Content').setValue(btoa(e.target.result));
      };
      reader.readAsBinaryString(file.target.files[0]);

      this.createFile.nativeElement.value = '';
    } else {
      this.createDoc.name = '';
    }
  }

  openCreateFile(inputId) {
    document.getElementById(inputId).click();
  }

  prevForm() {
    this.AccountDocumentComponent.emit('before');
  }

  nextForm() {
    this.AccountDocumentComponent.emit(this.docForm.value);
  }
  addDocument(){
    this.documentList.push({
      createFileCtrl: 'createFile' + this.documentList.length,
      
    })
  }
}
