import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { TerminationReverseService } from './services/termination-reverse-service';

@Component({
  selector: 'app-termination-reverse',
  templateUrl: './termination-reverse.component.html',
  styleUrls: ['./termination-reverse.component.scss'],
})
export class TerminationReverseComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('TerminationReverseComponent') TerminationReverseComponent: EventEmitter<string> = new EventEmitter<string>();

  pageTitle: string = '';

  
  debitRunId: string = '';

  noteData: string = '';

  all: boolean = false;
  children: boolean = false;
  sameServiceType: boolean = false;
  sibiling: boolean = false;

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private TRService: TerminationReverseService,
    
    private router: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('reverse_termination').subscribe(value => {
      this.pageTitle = value;
    });
    
  }

  ngOnInit() {
  }

  goBack() {
    this.TerminationReverseComponent.emit('close');
  }

  async submitTrigger() {
    await this.loading.present();
    this.TRService.getTerminateReverse().subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      if (result === null) {
      } else {
        this.TerminationReverseComponent.emit('close');
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

}
