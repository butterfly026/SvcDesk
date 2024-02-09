import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { TerminationReceiveService } from './services/termination-receive-service';

@Component({
  selector: 'app-termination-receive',
  templateUrl: './termination-receive.component.html',
  styleUrls: ['./termination-receive.component.scss'],
})
export class TerminationReceiveComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('TerminationReceiveComponent') TerminationReceiveComponent: EventEmitter<string> = new EventEmitter<string>();

  
  noteData: string = '';

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private TRService: TerminationReceiveService,
    
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
  }
  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  goBack() {
    this.TerminationReceiveComponent.emit('close');
  }

  async submitTrigger() {
    await this.loading.present();
    this.TRService.getTerminateReverse().subscribe(async (result: any) => {
      await this.loading.dismiss();
      
      if (result === null) {
      } else {
        this.TerminationReceiveComponent.emit('close');
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

}
