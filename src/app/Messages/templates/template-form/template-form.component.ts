import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TemplatesService } from './services/template.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss'],
})
export class TemplateFormComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Id: string = '';

  @Output('TemplateFormComponent') TemplateFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();


  templateForm: UntypedFormGroup;

  onOffStates={
    contacts:false,
    services:false,
    print:false,
    sms:false,
    email:false
  }

  templatesList: any[] = [];
  templateCategoryList: any[] = []; // ?
  currentTemplate: any;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private templatesService: TemplatesService,
  ) {
    this.templateForm = this.formBuilder.group({
      Id: [null, [Validators.min(0), Validators.max(1000)]],
      ParentId: [null],
      Name: ['', Validators.required],
      DisplayOrder: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      ServiceProviderChargeId: [''],
    });
  }

  ngOnInit() {
    this.getTemplates();
    if (this.Id !== '') {
      this.getTemplateDetail();
    }
  }
  async getTemplateDetail() {
    this.templateCategoryList = [];
    await this.loading.present();
    this.templatesService.getTemplateDetail(this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.currentTemplate = convResult;
      this.templateForm.get('Id').setValue(convResult?.Id);
      this.templateForm.get('Id').disable();
      if (convResult?.parentId) {
        this.templateForm.get('ParentId').setValue((convResult?.parentId).toString());
      }
      this.templateForm.get('Name').setValue(convResult?.name);
      this.templateForm.get('DisplayOrder').setValue(convResult?.displayorder);
      this.templateForm.get('ServiceProviderChargeId').setValue(convResult?.serviceproviderchargeId);
      // const tempList = this.groupList.filter(it => it.parentId !== null && it.parentId !== this.currentGroup?.parentId);
      this.templateCategoryList = this.templatesList.filter(it => it.Id !== this.currentTemplate?.Id);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitForm() {
    if (this.templateForm.valid) {
      if (this.Id) {
        this.updateTemplate();
      } else {
        this.createTemplate();
      }
    }
  }
  async createTemplate() {
    await this.loading.present();
    const reqBody = {
      Id: this.templateForm.get('Id').value,
      ParentId: parseInt(this.templateForm.get('ParentId').value),
      Name: this.templateForm.get('Name').value,
      DisplayOrder: this.templateForm.get('DisplayOrder').value,
      ServiceProviderChargeId: this.templateForm.get('ServiceProviderChargeId').value
    }
    this.templatesService.createTemplate(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.TemplateFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateTemplate() {
    const reqBody = {
      ParentId: parseInt(this.templateForm.get('ParentId').value),
      Name: this.templateForm.get('Name').value,
      DisplayOrder: this.templateForm.get('DisplayOrder').value,
      ServiceProviderChargeId: this.templateForm.get('ServiceProviderChargeId').value
    }
    await this.loading.present();
    this.templatesService.updateTemplate(reqBody, this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.TemplateFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('templateFormSubmitButton').click(); // change this
  }

  goBack() {
    this.TemplateFormComponent.emit({ type: 'list' });
  }

  get f() {
    return this.templateForm.controls;
  }

  async getTemplates() {
    this.templatesList = [];
    this.templateCategoryList = [];
    await this.loading.present();
    this.templatesService.getTemplates('').subscribe(async (result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_templates');
      } else {
        for (const list of convResult) {
          this.templatesList.push(list);
        }     
        this.templateCategoryList = this.templatesList.filter(it => it.Id !== this.currentTemplate?.Id);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }
}

