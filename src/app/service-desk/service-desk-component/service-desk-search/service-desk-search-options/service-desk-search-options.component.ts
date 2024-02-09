import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { ServiceDeskSearchService } from '../services/service-desk-search.service';

@Component({
  selector: 'app-service-desk-search-options',
  templateUrl: './service-desk-search-options.component.html',
  styleUrls: ['./service-desk-search-options.component.scss'],
})
export class ServiceDeskSearchOptionsComponent implements OnInit {
  @Output('ServiceDeskSearchOptionsComponent') ServiceDeskSearchOptionsComponent: EventEmitter<string> = new EventEmitter<string>();
  
  @Input() SearchForAccounts: boolean = true;
  @Input() AutoOpenIfFindOne: boolean = true;
  searchOptionsForm: UntypedFormGroup;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private loading: LoadingService,
    private tranService: TranService,
    private searchService: ServiceDeskSearchService,
    ) {
   }

  ngOnInit() {
    this.searchOptionsForm = this.formBuilder.group({
      SearchForAccounts: [this.SearchForAccounts],
      AutoOpenIfFindOne: [this.AutoOpenIfFindOne]
    });
    this.searchOptionsForm.get('SearchForAccounts').valueChanges.subscribe((result: any) => {
      this.ServiceDeskSearchOptionsComponent.emit('SearchForAccounts&' + (result ? 'true' : 'false'));
      this.SearchForAccounts = result;
      this.saveSearchOptions();
    });
    this.searchOptionsForm.get('AutoOpenIfFindOne').valueChanges.subscribe((result: any) => {
      this.ServiceDeskSearchOptionsComponent.emit('AutoOpenIfFindOne&' + (result ? 'true' : 'false'));
      this.AutoOpenIfFindOne = result;
      this.saveSearchOptions();
    });
    
  }
  async saveSearchOptions(){
    
    await this.loading.present();
    let reqData={
      AccountsOnly: this.SearchForAccounts,
      AutomaticallyLoadSingleResult: this.AutoOpenIfFindOne,
    }
    this.searchService.savePersonalisationConfig(reqData).subscribe(async (result) => {
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  searchSubmit(){

  }

}
