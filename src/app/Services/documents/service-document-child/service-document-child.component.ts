import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DatePipe } from '@angular/common';
import { ServiceDocumentService } from './services/service-document.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/Shared/services';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';

@Component({
  selector: 'app-service-document-child',
  templateUrl: './service-document-child.component.html',
  styleUrls: ['./service-document-child.component.scss'],
  providers: [DatePipe]
})
export class ServiceDocumentChildComponent implements OnInit {

  @Input() ServiceReference: String = '';
  @Output('DocumentComponent') public DocumentComponent: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentDoc: any;
  @Input() docState: any = 'create';

  docForm: FormGroup;

  boolList: any[] = [
    { value: true, name: 'yes' },
    { value: false, name: 'no' }
  ];

  dateAuthor: any;

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

  date_authored_warning: string = '';

  constructor(
    private tranService: TranService,
    private docService: ServiceDocumentService,
    private formBuilder: FormBuilder,
    private matAlert: MatAlertService,
    public globService: GlobalService,    
    public datePipe: DatePipe,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<ServiceDocumentChildComponent>,
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      ServiceReference?: string,
    }
  ) {

    this.docForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Category: ["User", Validators.required],
      FileType: ['', Validators.required],
      Note: [''],
      Author: ['', Validators.required],
      DateAuthored: ['', Validators.required],
      UserEditable: true,
      ContactEditable: true,
      ContactVisible: true,
      Content: ['']
    });
    
    this.tranService.convertText('date_authored_warning').subscribe(value => {
      this.date_authored_warning = value;
    });
  }

  ngOnInit() {
    if (this.dlgData?.ServiceReference) {
      this.ServiceReference = this.dlgData.ServiceReference;
    }

    let d = new Date();
    this.dateAuthor = this.datePipe.transform(d, 'yyyy-MM-dd');
  }
  async createDocument() {
    let reqParam = {
      "Name": this.docForm.get("Name").value,
      "Category": this.docForm.get("Category").value,
      "FileType": this.docForm.get("FileType").value,
      "Note": this.docForm.get("Note").value,
      "Author": this.docForm.get("Author").value,
      "DateAuthored": this.docForm.get("DateAuthored").value,
      "UserEditable": this.docForm.get("UserEditable").value,
      "ContactEditable": this.docForm.get("ContactEditable").value,
      "ContactVisible": this.docForm.get("ContactVisible").value,
      "Content": this.docForm.get("Content").value
    }
    
    let d = new Date();
    let today = this.datePipe.transform(d, 'yyyy-MM-dd');
    if(this.datePipe.transform(reqParam.DateAuthored, 'yyyy-MM-dd') > 
      this.datePipe.transform(today, 'yyyy-MM-dd'))
    {      
      this.tranService.matErrorMessage(this.date_authored_warning, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
      return;
    }
    await this.spinnerService.loading();
    this.docService.createDocument(this.globService.convertRequestBody(reqParam), this.ServiceReference).subscribe(async (result: any) => {
      await this.spinnerService.end();
      this.dialogRef.close('created');
      // this.Close();
    }, async (error: any) => {
      console.log('error', error)
      await this.spinnerService.end();
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    })
  }

  Close() {
    this.dialogRef.close('close');
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
  openCreateFile() {
    document.getElementById('createFile').click();
  }
}
