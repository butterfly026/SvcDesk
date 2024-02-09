import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TasksResolutionFormService } from './services/resolution-form.service';

@Component({
  selector: 'app-task-resolution-form',
  templateUrl: './resolution-form.component.html',
  styleUrls: ['./resolution-form.component.scss'],
})
export class ResolutionFormComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Id: string = '';

  @Output('ResolutionFormComponent') ResolutionFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  taskResolutionForm: UntypedFormGroup;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private taskService: TasksResolutionFormService,
  ) {
    this.taskResolutionForm = this.formBuilder.group({
      Name: ['', Validators.required],
      DisplayOrder: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      Active: [null, Validators.required]
    });
  }

  ngOnInit() {
    if (this.Id !== '') {
      this.getTaskGroupDetail();
    }
  }

  async getTaskGroupDetail() {
    await this.loading.present();
    this.taskService.getTaskResolutionDetail(this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.taskResolutionForm.get('Name').setValue(convResult?.name);
      this.taskResolutionForm.get('DisplayOrder').setValue(convResult?.displayorder);
      this.taskResolutionForm.get('Active').setValue(convResult?.active);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitForm() {
    if (this.taskResolutionForm.valid) {
      if (this.Id) {
        this.updateTaskResolution();
      } else {
        this.createTaskResolution();
      }
    }
  }

  async createTaskResolution() {
    await this.loading.present();
    const reqBody = {
      Name: this.taskResolutionForm.get('Name').value,
      DisplayOrder: this.taskResolutionForm.get('DisplayOrder').value,
      Active: this.taskResolutionForm.get('Active').value
    }
    this.taskService.createTaskResolution(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.ResolutionFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateTaskResolution() {
    const reqBody = {
      Name: this.taskResolutionForm.get('Name').value,
      DisplayOrder: this.taskResolutionForm.get('DisplayOrder').value,
      Active: this.taskResolutionForm.get('Active').value
    }
    await this.loading.present();
    this.taskService.updateTaskResolution(reqBody, this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.ResolutionFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('accountTaskResolutionFormSubmitButton').click();
  }

  goBack() {
    this.ResolutionFormComponent.emit({ type: 'list' });
  }

  get f() {
    return this.taskResolutionForm.controls;
  }

}
