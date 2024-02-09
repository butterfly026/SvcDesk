import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { type } from 'os';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { DocumentsAddService } from './services/documents-add.service';

@Component({
  selector: 'app-documents-add',
  templateUrl: './documents-add.component.html',
  styleUrls: ['./documents-add.component.scss'],
})
export class DocumentsAddComponent implements OnInit {

  @Output('docAddComponent') docAddComponent: EventEmitter<string> = new EventEmitter<string>();

  
  aggregationPoint: boolean = false;
  allocationType: string = '';

  saveState: boolean = false;

  addForm: UntypedFormGroup;

  typeList = [
    { Id: 'doc', Text: 'doc', Value: '' },
    { Id: 'pdf', Text: 'pdf', Value: '' },
  ];

  uploadUrl: string = '';
  docList = [];

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private docService: DocumentsAddService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.addForm = this.formBuilder.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      surName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required, Validators.pattern('[0-9]{8,}')],
      roleSelect: ['', Validators.required],
    });

    for (let list of this.typeList) {
      this.tranService.convertText(list.Id).subscribe(result => {
        list.Value = result;
      });
    }

    this.addNewForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.docAddComponent.emit('setMinHeight');
    }, 1000);
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  addNewForm() {
    const index = this.docList.length - 1;
    if (index > -1) {
      this.addForm.addControl('label' + index, new UntypedFormControl(''));
      this.addForm.addControl('name' + index, new UntypedFormControl('', Validators.required));
      this.addForm.addControl('type' + index, new UntypedFormControl('', Validators.required));

      this.addForm.get('name' + index).setValue(this.docList[index]);
      this.addForm.get('type' + index).setValue(this.getFileType(this.docList[index]));
    }
  }

  removeForm(index) {
    this.addForm.removeControl('label' + index);
    this.addForm.removeControl('name' + index);
    this.addForm.removeControl('type' + index);
  }

  getFileType(value) {
    const types = value.split('.');
    return types[types.length - 1];
  }

  async addFormSubmit() {
    if (this.addForm.valid) {
      const reqData = {
        Title: this.addForm.get('title').value,
        FirstName: this.addForm.get('firstName').value,
        SurName: this.addForm.get('surName').value,
        Email: this.addForm.get('email').value,
        Phone: this.addForm.get('phone').value,
        RolesSelect: this.addForm.get('roleSelect').value,
        Status: 'Open',
      };

      await this.loading.present();
      this.docService.addDocument(this.globService.convertRequestBody(reqData)).subscribe(async (result: any) => {
        
        await this.loading.dismiss();
        if (result === null) {
        } else {
          this.docAddComponent.emit('close');
        }
      }, async (error: any) => {
        
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  get f() {
    return this.addForm.controls;
  }

  triggerSubmit() {
    document.getElementById('submitButton').click();
  }

  closeAdd() {
    this.docAddComponent.emit('close');
  }

  onSelect(event) {
    const args = event.args;
    this.docList.push(args.file);
    this.addNewForm();
  }

  onRemove(event) {
    
    const file = event.args.file;
    let index = -1;
    for (let i = 0; i < this.docList.length; i++) {
      if (this.docList[i] === file) {
        index = i;
      }
    }
    this.docList.splice(index, 1);
    this.removeForm(index);
  }

}
