import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TasksGroupFormService } from './services/task-group-form.service';

@Component({
  selector: 'app-task-group-form',
  templateUrl: './task-group-form.component.html',
  styleUrls: ['./task-group-form.component.scss'],
})
export class TaskGroupFormComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Id: string = '';

  @Output('TaskGroupFormComponent') TaskGroupFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  taskGroupForm: UntypedFormGroup;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private taskService: TasksGroupFormService,
  ) {
    this.taskGroupForm = this.formBuilder.group({
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
    this.taskService.getTaskGroupDetail(this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.taskGroupForm.get('Name').setValue(convResult?.name);
      this.taskGroupForm.get('DisplayOrder').setValue(convResult?.displayorder);
      this.taskGroupForm.get('Active').setValue(convResult?.active);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitForm() {
    if (this.taskGroupForm.valid) {
      if (this.Id) {
        this.updateTaskGroup();
      } else {
        this.createTaskGroup();
      }
    }
  }

  async createTaskGroup() {
    await this.loading.present();
    const reqBody = {
      Name: this.taskGroupForm.get('Name').value,
      DisplayOrder: this.taskGroupForm.get('DisplayOrder').value,
      Active: this.taskGroupForm.get('Active').value
    }
    this.taskService.createTaskGroup(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.TaskGroupFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateTaskGroup() {
    const reqBody = {
      Name: this.taskGroupForm.get('Name').value,
      DisplayOrder: this.taskGroupForm.get('DisplayOrder').value,
      Active: this.taskGroupForm.get('Active').value
    }
    await this.loading.present();
    this.taskService.updateTaskGroup(reqBody, this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.TaskGroupFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('accountTaskGroupFormSubmitButton').click();
  }

  goBack() {
    this.TaskGroupFormComponent.emit({ type: 'list' });
  }

  get f() {
    return this.taskGroupForm.controls;
  }
}
