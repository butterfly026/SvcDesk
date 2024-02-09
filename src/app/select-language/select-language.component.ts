import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
})
export class SelectLanguageComponent implements OnInit {
  @Input() ComponentType: string = '';

  @Output('LanguageComponent') LanguageComponent: EventEmitter<string> = new EventEmitter<string>();

  lgList: any[] = [
    { id: 'en', name: 'en_tran' },
    { id: 'ru', name: 'ru_tran' },
    { id: 'ar', name: 'ar_tran' },
    { id: 'es', name: 'es_tran' },
  ];

  lgForm: UntypedFormGroup;


  themeList: any[] = [
    { value: 'base', name: 'base' },
    { value: 'classic', name: 'classic' },
    { value: 'bootstrap', name: 'bootstrap' },
    { value: 'orange', name: 'orange' },
    { value: 'energyblue', name: 'energyblue' },
    { value: 'darkblue', name: 'darkblue' },
    { value: 'summer', name: 'summer' },
    { value: 'metro', name: 'metro' },
    { value: 'office', name: 'office' },
    { value: 'metrodark', name: 'metrodark' },
    { value: 'shinyblack', name: 'shinyblack' },
    { value: 'highcontrast', name: 'highcontrast' },
    { value: 'material', name: 'material' },
  ];

  constructor(
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,

    private modalCtrl: ModalController,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.lgForm = this.formBuilder.group({
      // language: ['', Validators.required],
      // theme: ['']
    });
  }

  ngOnInit() {

    if (this.ComponentType === 'language') {
      this.lgForm.addControl('language', new UntypedFormControl('', Validators.required));
      this.lgForm.get('language').setValue(localStorage.getItem('set_lng'));
    }

    if (this.ComponentType === 'theme') {
      this.lgForm.addControl('theme', new UntypedFormControl('', Validators.required));
      this.lgForm.get('theme').setValue(this.globService.getCurrentTheme());
    }

  }

  changeLangauge() {
    if (this.lgForm.valid) {


      if (this.ComponentType === 'language') {
        localStorage.setItem('set_lng', this.lgForm.get('language').value);
        this.globService.globSubject.next('language_change');
        this.tranService.translaterService();
      }

      if (this.ComponentType === 'theme') {
        localStorage.setItem('currentTheme', this.lgForm.get('theme').value);
        this.globService.currentThemeSubject.next('change_theme');
      }

      this.LanguageComponent.emit('close');
      this.modalCtrl.dismiss();
    }
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  close() {
    this.LanguageComponent.emit('close');
    this.modalCtrl.dismiss();
  }

}
