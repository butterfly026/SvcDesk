import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ImageFormService } from './services/image-form.service';

@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.scss'],
})
export class ImageFormComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ImageFormComponent') ImageFormComponent: EventEmitter<string> = new EventEmitter<string>();

  

  groupList: any[] = [];

  @ViewChild('fileInput') fileInput: ElementRef;
  newFile = {
    name: '',
    content: '',
    type: '',
  };

  titleEdit: boolean = false;
  originName: string = '';

  constructor(
    private imageService: ImageFormService,
    private loading: LoadingService,
    private tranService: TranService,
    
    public globService: GlobalService,
  ) {
    
  }

  ngOnInit() { }

  openFile() {
    document.getElementById('uploadFile').click();
  }

  uploadFileEvt(file: any) {
    if (file.target.files && file.target.files[0]) {
      const filename = file.target.files[0].name;
      this.newFile.type = filename.split('.').pop();
      this.newFile.name = filename.replace(/\.[^/.]+$/, '');
      this.originName = this.newFile.name;

      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.newFile.content = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);

      this.fileInput.nativeElement.value = '';
    }
  }

  cancelImage() {
    this.newFile.name = '';
    this.newFile.content = '';
    this.originName = '';
  }

  // async uploadImage() {
  //   if (this.newFile.content && this.newFile.content.length < 30000) {
  //     await this.loading.present();
  //     try {
  //       const reqData = {
  //         Name: this.newFile.name + '.' + this.newFile.type,
  //         Image: this.newFile.content,
  //       }
  //       const reqBody = {
  //         OperationId: '/Messages/Images#post',
  //         RequestBody: reqData
  //       }
  //       const result = await this.globService.operationAPIService(reqBody).toPromise();
  //       this.ImageFormComponent.emit('list');
  //     } catch (error) {
  //       this.tranService.errorMessage(error);
  //     }
  //     await this.loading.dismiss();
  //   }
  // }

  async uploadImage() {
    if (this.newFile.content && this.newFile.content.length < 30000) {
      await this.loading.present();
      try {
        const reqData = {
          Name: this.newFile.name + '.' + this.newFile.type,
          Image: this.newFile.content,
        }

        const result = await this.imageService.uploadImage('/Messages/Images', reqData).toPromise();
        this.ImageFormComponent.emit('list');
      } catch (error) {
        this.tranService.errorMessage(error);
      }
      await this.loading.dismiss();
    }
  }


  cancelChange() {
    this.titleEdit = !this.titleEdit;
    this.newFile.name = this.originName;
  }

  changeFileName() {
    if (this.newFile.name != '') {
      this.titleEdit = !this.titleEdit;
      this.originName = this.newFile.name;
    }
  }

  goBack() {
    this.ImageFormComponent.emit('list');
  }

}
