import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { DocumentsOwnService } from './services/documents-own.service';

@Component({
  selector: 'app-documents-own-list',
  templateUrl: './documents-own-list.component.html',
  styleUrls: ['./documents-own-list.component.scss'],
})
export class DocumentsOwnListComponent implements OnInit {
  @Input() viewType: string = '';
  @Input() currentService: string = '';
  @ViewChild('docOwnGrid') docOwnGrid: jqxGridComponent;
  @Output('docOwnComponent') docOwnComponent: EventEmitter<string> = new EventEmitter<string>();
  @Output('currentType') currentType: EventEmitter<string> = new EventEmitter<string>();

  

  groupList: any[] = [];

  selectIndex: number;
  selectedData: any;
  gridWidth: number = 0;
  gridContentWidth = '';

  rowList = ['10', '20', '50', '100'];
  maxPageRow: any;
  rowStep = '10';

  backSymbol = '⮜';
  forwardSymbol = '⮞';
  pageRowNumber = 1;

  SkipRecords = 0;
  TakeRecords = 10;

  startIndex = 0;
  endIndex: number;
  totalLength: number;
  keyPress: boolean = false;

  loadPage = false;

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', map: '0' },
      { name: 'label', type: 'string', map: '1' },
      { name: 'name', type: 'string', map: '2' },
      // { name: 'type', type: 'string', map: '3' },
      { name: 'updated', type: 'string', map: '3' },
      { name: 'updatedby', type: 'string', map: '4' },
      { name: 'created', type: 'string', map: '5' },
      { name: 'created_by', type: 'string', map: '6' }
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id' },
    { text: '', datafield: 'label' },
    { text: '', datafield: 'name' },
    // { text: '', datafield: 'type' },
    { text: '', datafield: 'updated' },
    { text: '', datafield: 'updatedby' },
    { text: '', datafield: 'created' },
    { text: '', datafield: 'created_by' }
  ];

  gridRecords: any = {};
  availProcess: boolean = false;
  showType: string = 'grid';

  docType = [
    { Id: 'my_documents', Value: '', },
    { Id: 'public_documents', Value: '', }
  ];

  docsParam = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
  };

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private docService: DocumentsOwnService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        list.text = result;
      });
    }
    this.setGridWidth();
    for (let list of this.docType) {
      this.tranService.convertText(list.Id).subscribe(result => {
        list.Value = result;
      });
    }
  }

  ngOnInit() {
    if (this.viewType === '') {
      this.showType = 'grid';
    } else {
      this.showType = this.viewType;
    }
    this.getGroupList();
  }

  refreshGrid() {
    this.docsParam.SkipRecords = 0;
    this.docsParam.TakeRecords = 10;
    this.pageRowNumber = 1;
    this.rowStep = '10';
    this.globService.globSubject.next('refresh-grid');
    this.getGroupList();
  }

  searchInputEvent(event) {
    if (event.keyCode === 13) {
      this.docsParam.SearchString = event.target.value;
      this.docsParam.SkipRecords = 0;
      this.docsParam.TakeRecords = 10;
      this.pageRowNumber = 1;
      this.rowStep = '10';
      this.SkipRecords = 0;
      this.getGroupList();
    }
  }

  async getGroupList() {
    this.groupList = [];
    const reqPara = {
      SkipRecords: this.startIndex,
      TakeRecords: this.rowStep,
      SearchString: this.docsParam.SearchString,
    };
    await this.loading.present();

    this.docService.getDocumentOwnList(reqPara).subscribe(async (result: any[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorToastMessage('no_managers');
      } else {
        let convertResult = this.globService.ConvertKeysToLowerCase(result);
        for (let list of convertResult) {
          if (list.img === null || typeof (list.img) === 'undefined' || list.img === '') {
            list.img = 'assets/imgs/person1.jpg'
          }
          list['typeImage'] = 'assets/imgs/document/' + this.getImageType(list.type);
          this.groupList.push(list);
        }
        if (this.showType === 'grid') {
          this.setGridData();
        }
      }
      this.totalLength = result.length;
      this.endIndex = this.startIndex + this.totalLength;
      if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
        this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
      } else {
        this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
      }
      this.docOwnComponent.emit('setMinHeight');
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  exportExcel() {
    this.docOwnGrid.exportview('xlsx', 'My Documents list');
  }

  exportPdf() {
    this.docOwnGrid.exportdata('pdf', 'My Documents list');
  }

  selectRow(event) {
    if (typeof (event.args.row.bounddata.id) !== 'undefined' && event.args.row.bounddata.id !== null) {
      this.availProcess = true;
      this.selectIndex = event.args.row.bounddata.boundindex;
      this.selectedData = this.docOwnGrid.getrowdata(this.selectIndex);
    } else {
      this.availProcess = false;
    }
  }

  setGridWidth() {
    this.gridWidth = 0;
    if (this.docOwnGrid) {
      let gridContent = document.getElementById('document-own-list-grid');
      if (typeof (gridContent) === 'undefined' || gridContent === null) {
        setTimeout(() => {
          this.setGridData();
        }, 10);
      } else {
        for (let list of this.docOwnGrid.attrColumns) {
          if (typeof (list.width) === 'string') {
            this.gridWidth = this.gridWidth + parseInt(list.width, 10);
          } else {
            this.gridWidth = this.gridWidth + list.width;
          }
        }
        if (gridContent.offsetWidth > this.gridWidth) {
          const tempData = this.gridContentWidth;
          this.gridContentWidth = this.gridWidth + 'px';
          if (tempData !== '' && tempData !== this.gridContentWidth) {
            this.cdr.detectChanges();
            this.setGridData();
          }
          return this.gridWidth;
        } else {
          const tempData = this.gridContentWidth;
          this.gridContentWidth = '100%';
          if (tempData !== '' && tempData !== this.gridContentWidth) {
            this.cdr.detectChanges();
            this.setGridData();
          }
          return 'calc(100% - 2px)';
        }
      }
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.cdr.detectChanges();
        this.setGridData();
      }
      return 'calc(100% - 2px)';
    }
  }

  setGridData() {

    if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
      this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
    } else {
      this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
    }

    this.endIndex = this.SkipRecords + parseInt(this.rowStep, 10);
    if (this.totalLength > 0) {
      if (this.SkipRecords > -1) {
        if (this.endIndex < this.totalLength) {
        } else {
          this.endIndex = this.totalLength;
        }
      }
    }

    for (const list of this.groupList) {
      const tempData = [
        list.id, list.label, list.name, this.globService.newDateFormat(list.updated),
        // list.type,
        list.updatedby, this.globService.newDateFormat(list.created), list.createdby
      ];
      this.source.localdata.push(tempData);
    }

    this.source.localdata.push([]);

    this.docOwnGrid.updatebounddata();
    this.source.localdata.length = 0;


    this.gridRecords = this.docOwnGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }

  setGridColumnWidth(list) {

    let columnsMaxWidth = {
      id: 0,
      label: 0,
      name: 0,
      // type: 0,
      updated: 0,
      updatedby: 0,
      created: 0,
      created_by: 0
    };

    for (const record of list) {
      if (record.id && columnsMaxWidth.id < record.id.length) {
        columnsMaxWidth.id = record.id.length;
      }
      if (record.label && columnsMaxWidth.label < record.label.length) {
        columnsMaxWidth.label = record.label.length;
      }
      if (record.name && columnsMaxWidth.name < record.name.length) {
        columnsMaxWidth.name = record.name.length;
      }
      // if (record.type && columnsMaxWidth.type < record.type.length) {
      //   columnsMaxWidth.type = record.type.length;
      // }
      if (record.updated && columnsMaxWidth.updated < record.updated.length) {
        columnsMaxWidth.updated = record.updated.length;
      }
      if (record.updatedby && columnsMaxWidth.updatedby < record.updatedby.length) {
        columnsMaxWidth.updatedby = record.updatedby.length;
      }
      if (record.created && columnsMaxWidth.created < record.created.length) {
        columnsMaxWidth.created = record.created.length;
      }
      if (record.created_by && columnsMaxWidth.created_by < record.created_by.length) {
        columnsMaxWidth.created_by = record.created_by.length;
      }
    }

    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        switch (list.datafield) {
          case 'id':
            if (columnsMaxWidth.id < result.length) {
              this.docOwnGrid.setcolumnproperty("id", "width", result.length * 8 + 20);
            } else {
              this.docOwnGrid.setcolumnproperty("id", "width", columnsMaxWidth.id * 8 + 10);
            }
            break;
          case 'label':
            if (columnsMaxWidth.label < result.length) {
              this.docOwnGrid.setcolumnproperty("label", "width", result.length * 8 + 20);
            } else {
              this.docOwnGrid.setcolumnproperty("label", "width", columnsMaxWidth.label * 8 + 10);
            }
            break;
          case 'name':
            if (columnsMaxWidth.name < result.length) {
              this.docOwnGrid.setcolumnproperty("name", "width", result.length * 8 + 20);
            } else {
              this.docOwnGrid.setcolumnproperty("name", "width", columnsMaxWidth.name * 8 + 10);
            }
            break;
          // case 'type':
          //   if (columnsMaxWidth.type < result.length) {
          //     this.docOwnGrid.setcolumnproperty("type", "width", result.length * 8 + 20);
          //   } else {
          //     this.docOwnGrid.setcolumnproperty("type", "width", columnsMaxWidth.type * 8 + 10);
          //   }
          //   break;
          case 'updated':
            if (columnsMaxWidth.updated < result.length) {
              this.docOwnGrid.setcolumnproperty("updated", "width", result.length * 8 + 20);
            } else {
              this.docOwnGrid.setcolumnproperty("updated", "width", columnsMaxWidth.updated * 8 + 10);
            }
            break;
          case 'updatedby':
            if (columnsMaxWidth.updatedby < result.length) {
              this.docOwnGrid.setcolumnproperty("updatedby", "width", result.length * 8 + 20);
            } else {
              this.docOwnGrid.setcolumnproperty("updatedby", "width", columnsMaxWidth.updatedby * 8 + 10);
            }
            break;
          case 'created':
            if (columnsMaxWidth.created < result.length) {
              this.docOwnGrid.setcolumnproperty("created", "width", result.length * 8 + 20);
            } else {
              this.docOwnGrid.setcolumnproperty("created", "width", columnsMaxWidth.created * 8 + 10);
            }
            break;
          case 'created_by':
            if (columnsMaxWidth.created_by < result.length) {
              this.docOwnGrid.setcolumnproperty("created_by", "width", result.length * 8 + 20);
            } else {
              this.docOwnGrid.setcolumnproperty("created_by", "width", columnsMaxWidth.created_by * 8 + 10);
            }
            break;
          default:
            break;
        }
      });
    }
  }

  outPagingComponent(event) {
    this.SkipRecords = event.SkipRecords;
    this.TakeRecords = event.TakeRecords;

    this.pageRowNumber = event.pageRowNumber;
    this.rowStep = event.rowStep;

    this.getGroupList();
  }

  gotoNew() {
    this.currentType.emit(this.showType);
    this.docOwnComponent.emit('add');
  }

  download() {
    
  }

  remove() {
  }

  goToService() {
    const index = this.selectIndex;
    this.currentType.emit(this.showType);
    this.docOwnComponent.emit('sitesservice' + this.groupList[index].id);
  }

  switchType() {
    if (this.showType == 'grid') {
      this.showType = 'box';
    } else {
      this.showType = 'grid';
      if (this.viewType === 'box') {
        this.getGroupList();
      }
      this.viewType = this.showType;
    }
  }

  downloadItem(index) {
  }

  removeItem(index) {
  }

  selectDocument(id) {
    this.docOwnComponent.emit('selectdocumentindex' + id + 'selectdocumentindex' + this.showType);
  }

  getFileType(value) {
    const types = value.split('.');
    return types[types.length - 1];
  }

  getImageType(value) {
    // let type = this.getFileType(value);
    let type = value;
    let returnValue = 'NoImageAvailable.png';
    switch (type) {
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
        // returnValue = 'NoImageAvailable.png';
        break;
    }
    return returnValue;
  }
}
