
import { Injectable } from '@angular/core';
import { TranService } from './trans.service';

@Injectable({
    providedIn: 'root'
})
export class GridService {
    constructor( private tranService: TranService) {}     
    getDocmentWidth(elementName:any=null) {
      if(elementName==null){
        return Math.max(
          document.body.scrollWidth,
          document.documentElement.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.offsetWidth,
          document.documentElement.clientWidth
        );
      }
      else{
        let element = document.getElementById(elementName);
          if (typeof (element) !== 'undefined' && element !== null) {
              return element.offsetWidth;
            } 
      }
      }
      exportGridData(grid:any,format:any,title:any) {
        grid.exportview(format, title);
      }

      getGridWidth(columns:any) {
        var gridWidth = 0;
        if(columns!=null && columns !=undefined)
        {
            for (let i = 0; i < columns.length; i++) {
                if (columns[i]['width']) {
                    gridWidth += columns[i]['width'];
                }
            }
        }
        return gridWidth;
      }  

     getField(filedname,type:any,value)
     { 
        switch(type)
        {
            case 'text' : return {datafield: filedname, text:value};break;
            default:break;
        }       
     }
     getFieldWithCustomWidth(filedname,type:any,value,width)
     { 
        switch(type)
        {
            case 'text' : return {datafield: filedname,width:width, text:value,};break;
            default:break;
        }       
     }

     getFieldWithCustomCellRenderer(filedname,type:any,value,width,templateString,alignment)
     { 
        switch(type)
        {
            case 'text' : return   {
              datafield: filedname, width: width , text: value,  cellsalign: alignment,
               cellsrenderer: (): string => {
                   return templateString;
               }  
             };break;
            default:break;
        }       
     }
     getDataField(filedName, fieldType,autoHeight=null, autoWidth=null, autoRowHeight=null){

      return  { name: filedName, type: fieldType, autoHeight: autoHeight, autoRowHeight: autoRowHeight, autoWidth: autoWidth };
     }
     getTemplateField(fieldName,field){
      return  {
        text: '', datafield: fieldName,
        initwidget: (row: number, column: any, value: any, htmlElement: HTMLElement): void => {},
        createwidget: field
      }
     }
     convertGridText(columns){
        for (let i = 0; i < columns.length; i++) {
            this.tranService.convertText(columns[i].datafield).subscribe(value => {
              columns[i].text = value;
            });
        }
        return columns;
     }
     getCalculatedGridWidth(gridWidth:any,gridContentWidth:any,element:any=null) {
      if (this.getDocmentWidth(element) > gridWidth) {       
        gridContentWidth = gridWidth + 'px';     
        return {gridContentWidth:gridContentWidth,gridWidth:gridWidth}    ;
      } else { 
        return {gridContentWidth:gridContentWidth,gridWidth:'calc(100% - 2px)'};    
      
      }
    }
    getGridColumnWidth(grid:any,columns,columnsMaxWidth:any,list:any) {
     var gridWidth = 0; 
      for (const record of list) {
        for (const key in columnsMaxWidth) {
          if (record[key] && (columnsMaxWidth[key] < (record[key]).toString().length)) {
            columnsMaxWidth[key] = (record[key]).toString().length;            
          }
        }      
      }
      for (let list of columns) {
        this.tranService.convertText(list.datafield).subscribe(result => {
          if (columnsMaxWidth[list.datafield] < result.length) {
            grid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
            gridWidth += result.length * 8 + 10;
          } else {
            grid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
            gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
          }
        });
      }
      return gridWidth;
    } 

     getRowsHeight(groupList:any,defaultRowHeight:any,cdr:any) {
      let newLineCount = 0;
  
      for (const list of groupList) {
        const columnsNewLines = list.note.split('\\n').length;
        if (newLineCount < columnsNewLines) {
          newLineCount = columnsNewLines;
        }
      }
      var rowHeight=defaultRowHeight;
      const tempRowHeight = rowHeight;
      if (newLineCount === 0 || newLineCount === 1) {
          rowHeight = 28;
        if (tempRowHeight !== 0 && tempRowHeight !== rowHeight) {
          cdr.detectChanges();
        }
      } else {
        rowHeight = newLineCount * 28 ;
        if (tempRowHeight !== 0 && tempRowHeight !== rowHeight) {
          cdr.detectChanges();
        }
      }      
      return rowHeight;
    }
}