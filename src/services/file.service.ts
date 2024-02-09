import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class FileService {
    constructor() { }

  getFileType(value) {
    let type = value;
    let returnValue = 'NoImageAvailable.png';
    switch (type.toLowerCase()) {
      case 'psd':
        returnValue = 'NoImageAvailable.png';
        break;
      case 'jpg':
      case 'jpeg':
        returnValue = 'JPEG-icon.png';
        break;
      case 'png':
        returnValue = 'PNG-icon.png';
        break;
      case 'pdf':
      case 'PDF':
        returnValue = 'AdobeIcon.png';
        break;
      case 'doc': case 'docx':
        returnValue = 'WordIcon.jpg';
        break;
      default:      
        break;
    }
    return returnValue;
  }

  kb2Size(kbVal){
    var units=["KB", "MB", "GB", "TB"];
    var kounter=0;
    var mb= 1024;
    var div=kbVal/1;
    while(div>=mb){
        kounter++;
        div= div/mb;
    }
    return div.toFixed(1) + " " + units[kounter];
}
}





