import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from 'src/services/global-service.service';
import { TaskDocument } from '../account-task-list.types';
import { AccountTasksListService } from '../services/task-list.service';

@Component({
  selector: 'app-account-task-document-new',
  templateUrl: './account-task-document-new.component.html',
  styleUrls: ['./account-task-document-new.component.scss'],
  providers: [DatePipe]
})
export class AccountTaskDocumentNewComponent implements OnInit {


  @ViewChild('createFile') createFile: ElementRef;
  docForm: UntypedFormGroup;
  dateAuthor: string;
  taskDoc: any = {
    name: '',
    content: ''
  }
  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<AccountTaskDocumentNewComponent>,    
    private docService: AccountTasksListService,
    public globService: GlobalService,
  ) {
    this.docForm = this.formBuilder.group({

      Author: ['', Validators.required],
      DateAuthored: ['', Validators.required],
      UserEditable: [false],
      ContactEditable: [false],
      ContactVisible: [false],
      Note: [''],
      Name: [''],
      FileType: [''],
      Content: [''],
    });
    
    this.docForm.get('Author').disable();
    this.docForm.get('DateAuthored').disable();
    this.docForm.get('UserEditable').disable();
    this.docForm.get('ContactEditable').disable();
    this.docForm.get('ContactVisible').disable();
    this.docForm.get('Note').disable();
    this.docForm.get('Name').disable();
    this.docForm.get('FileType').disable();
    this.docForm.get('Content').disable();
  }

  ngOnInit(): void {
    let d = new Date();
    this.dateAuthor = this.datePipe.transform(d, 'yyyy-MM-dd');
  }



  createFileEvent(file) {
    if (file.target.files && file.target.files[0]) {
      const selectedFiles = file.target.files as FileList;
      let name = selectedFiles[0].name;
      this.taskDoc.name = name;
      this.docForm.get('Name').setValue(name);
      this.docForm.get('FileType').setValue(name.split('.')[1].toLowerCase());
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.taskDoc.content = e.target.result;
        this.docForm.get('Content').setValue(btoa(e.target.result));
      };
      reader.readAsBinaryString(file.target.files[0]);

      this.createFile.nativeElement.value = '';

      this.docForm.get('Author').enable();
      this.docForm.get('DateAuthored').enable();
      this.docForm.get('UserEditable').enable();
      this.docForm.get('ContactEditable').enable();
      this.docForm.get('ContactVisible').enable();
      this.docForm.get('Note').enable();
      this.docForm.get('Name').enable();
      this.docForm.get('FileType').enable();
      this.docForm.get('Content').enable();
    } else {
      this.taskDoc.name = '';
    }
  }
  openCreateFile(): void {
    document.getElementById('createFile').click();
  }

  saveDocument(): void {
    const doc: TaskDocument = {
      Name: this.docForm.get('Name').value,
      Category: '',
      FileType: this.docForm.get('FileType').value,
      Note: this.docForm.get('Note').value,
      Author: this.docForm.get('Author').value,
      DateAuthored: this.docForm.get('DateAuthored').value,
      UserEditable: this.docForm.get('UserEditable').value,
      ContactEditable: this.docForm.get('ContactEditable').value,
      ContactVisible: this.docForm.get('ContactVisible').value,
      Content: this.docForm.get('Content').value
    }
    const dlgRet = {
      result: 'success',
      data: doc,
    }
    this.dialogRef.close(dlgRet);
  }

  close(): void {
    this.dialogRef.close();
  }

}
