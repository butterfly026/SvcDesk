import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';
import { ComponentOutValue } from '../model';

declare var CKEDITOR;

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
})
export class HtmlEditorComponent implements OnInit {

  @Output('HtmlEditorComponent') HtmlEditorComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  title = 'app-demo';
  tokens: string[] = [];
  editorContent: string = '';
  templateContent: string = '';

  constructor(
    public globService: GlobalService,
  ) {

  }

  ngOnInit() {
    // const observableTokens = this.http.get<string[]>('http://localhost:5000/api/maileditor/tokens');
    // observableTokens.subscribe(tokens => this.tokens = tokens);

    // const observableHtml = this.http.get<any>('http://localhost:5000/api/maileditor/mail-content');
    // observableHtml.subscribe(result => {
    //   this.templateContent = result.html
    //   this.editorContent = result.html
    // });
  }

  submit() {
    // const observableHtml = this.http.post<any>('http://localhost:5000/api/maileditor/replace-tokens', { content: this.editorContent });
    // observableHtml.subscribe(result => this.replacedContent = result.html);
  }

  cancelForm() {
    this.HtmlEditorComponent.emit({ type: 'close' });
  }

  change(event) {
    const editResult = CKEDITOR.currentInstance.getData();
    this.editorContent = editResult;
  }

}
