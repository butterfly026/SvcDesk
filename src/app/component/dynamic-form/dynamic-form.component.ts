import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {

  @Input() FormControlType: string = '';
  @Input() FormControlName: string = '';
  @Input() FormControlMandatory: boolean = false;

  showSpinner: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  accountNumberSelected(event) {

  }

}
