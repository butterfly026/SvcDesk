import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import {EditorLibModule} from '../../../libs/editor-lib'
import { TemplateEditorComponent } from "./template-editor.component";
import { TemplateEditorService } from "./services/template-editor.service";

@NgModule({
  declarations: [TemplateEditorComponent],
  imports: [
    CommonModule,IonicModule,
    EditorLibModule
  ],
  exports:[TemplateEditorComponent],
  providers: [ TemplateEditorService]
})
export class TemplateEditorModule { }
