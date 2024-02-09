import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ImageListService } from './services/image-list.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ImageListComponent') ImageListComponent: EventEmitter<string> = new EventEmitter<string>();

  

  groupList: any[] = []

  constructor(
    private tranService: TranService,
    
    private loading: LoadingService,
    private imageService: ImageListService,
    public globService: GlobalService,
    private alertCtrl: AlertController,
  ) {
    
  }

  async ngOnInit() {
    await this.getMessageList();
  }

  // async getMessageList() {
  //   const reqBody = {
  //     OperationId: '/Messages/Images#get',
  //   }

  //   await this.loading.present();

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
      
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
      

  //     for (let list of convResult.images) {
  //       this.groupList.push(list);
  //     }
  //     for (let list of this.groupList) {
  //       list['hover'] = false;
  //     }
  //   }, async (error: any) => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async getMessageList() {
    await this.loading.present();

    this.imageService.getMessage('/Messages/Images').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      for (let list of convResult.images) {
        this.groupList.push(list);
      }
      for (let list of this.groupList) {
        list['hover'] = false;
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  newImage() {
    this.ImageListComponent.emit('new');
  }

  overMessages(index) {
    this.groupList[index].hover = true;
  }

  leaveMessages(index) {
    this.groupList[index].hover = false;
  }

  // async deleteMessage(index) {
  //   const reqBody = {
  //     OperationId: '/Messages/Images/{Id}#delete',
  //     Parameters: [
  //       {
  //         Type: 'path',
  //         Name: 'Id',
  //         Value: this.groupList[index].id.toString()
  //       }
  //     ]
  //   }
  //   await this.loading.present();
  //   try {
  //     const result = await this.globService.operationAPIService(reqBody).toPromise();
  //     this.groupList.splice(index, 1);
  //   } catch (error) {
      
  //     this.tranService.errorMessage(error);
  //   }
  //   await this.loading.dismiss();
  // }

  async deleteMessage(index) {
    await this.loading.present();
    try {
      const result = await this.imageService.deleteMessage(this.groupList[index].id.toString(), '/Messages/Images/').toPromise();
      this.groupList.splice(index, 1);
    } catch (error) {
      
      this.tranService.errorMessage(error);
    }
    await this.loading.dismiss();
  }

  async deleteMessageAlert(index) {
    const headerStr = await this.tranService.convertText('are_you_sure').toPromise();
    const yesStr = await this.tranService.convertText('yes').toPromise();
    const noStr = await this.tranService.convertText('no').toPromise();
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: headerStr,
      buttons: [
        {
          text: yesStr,
          handler: () => {
            this.deleteMessage(index);
          }
        },
        {
          text: noStr,
          role: 'cancel',
        }
      ]
    });

    await alert.present();
  }

}
