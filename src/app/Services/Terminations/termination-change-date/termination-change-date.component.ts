import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-termination-change-date',
  templateUrl: './termination-change-date.component.html',
  styleUrls: ['./termination-change-date.component.scss'],
})
export class TerminationChangeDateComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('TerminationChangeDate') TerminationChangeDate: EventEmitter<string> = new EventEmitter<string>();

  
  noteData: string = '';

  changeForm: UntypedFormGroup;
  forwardState = false;
  currentDate: string = '28/09/2005 10:07:09 AM';

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.changeForm = this.formBuilder.group({
      newDate: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  SubmitTerminate() {

  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.TerminationChangeDate.emit('close');
  }
}
