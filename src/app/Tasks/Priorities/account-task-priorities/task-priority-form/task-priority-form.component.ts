import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TasksPriorityFormService } from './services/task-priority-form.service';

@Component({
  selector: 'app-task-priority-form',
  templateUrl: './task-priority-form.component.html',
  styleUrls: ['./task-priority-form.component.scss'],
})
export class TaskPriorityFormComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Id: string = '';

  @Output('TaskPriorityFormComponent') TaskPriorityFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  taskPriorityForm: UntypedFormGroup;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private taskService: TasksPriorityFormService,
  ) {
    this.taskPriorityForm = this.formBuilder.group({
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
    this.taskService.getTaskPriorityDetail(this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.taskPriorityForm.get('Name').setValue(convResult?.name);
      this.taskPriorityForm.get('DisplayOrder').setValue(convResult?.displayorder);
      this.taskPriorityForm.get('Active').setValue(convResult?.active);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitForm() {
    if (this.taskPriorityForm.valid) {
      if (this.Id) {
        this.updateTaskPriority();
      } else {
        this.createTaskPriority();
      }
    }
  }

  async createTaskPriority() {
    await this.loading.present();
    const reqBody = {
      Name: this.taskPriorityForm.get('Name').value,
      DisplayOrder: this.taskPriorityForm.get('DisplayOrder').value,
      Active: this.taskPriorityForm.get('Active').value
    }
    this.taskService.createTaskPriority(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.TaskPriorityFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateTaskPriority() {
    const reqBody = {
      Name: this.taskPriorityForm.get('Name').value,
      DisplayOrder: this.taskPriorityForm.get('DisplayOrder').value,
      Active: this.taskPriorityForm.get('Active').value
    }
    await this.loading.present();
    this.taskService.updateTaskPriority(reqBody, this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.TaskPriorityFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('accountTaskPriorityFormSubmitButton').click();
  }

  goBack() {
    this.TaskPriorityFormComponent.emit({ type: 'list' });
  }

  get f() {
    return this.taskPriorityForm.controls;
  }

}
