import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-service-add-attribute',
  templateUrl: './service-add-attribute.component.html',
  styleUrls: ['./service-add-attribute.component.scss'],
})
export class ServiceAddAttributeComponent implements OnInit {

  @Input() AttributeList: any = [];

  @Output('ServiceAddAttributeComponent') ServiceAddAttributeComponent: EventEmitter<string> = new EventEmitter<string>();

  


  attributeForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    
    public globService: GlobalService,
  ) {
    this.attributeForm = this.formBuilder.group({});
    
  }

  ngOnInit() {
    for (let i = 0; i < this.AttributeList.length; i++) {
      const list = this.AttributeList[i];
      this.attributeForm.addControl(list.id, new UntypedFormControl(''));
      if (!list.optional) {
        this.attributeForm.get(list.id).setValidators(Validators.required);
      }

      if (list.type === 'email') {
        this.attributeForm.get(list.id).setValidators(Validators.email);
      }

      this.attributeForm.get(list.id).updateValueAndValidity();

      this.attributeForm.get(list.id).setValue(list.value);
    }
  }

  submitAttributeForm() {
    if (this.attributeForm.valid) {
      this.ServiceAddAttributeComponent.emit(JSON.stringify(this.attributeForm.value));
    }
  }

  prevForm() {
    this.ServiceAddAttributeComponent.emit('third');
  }

  nextForm() {
    document.getElementById('attributeSubmitButton').click();
  }

}
