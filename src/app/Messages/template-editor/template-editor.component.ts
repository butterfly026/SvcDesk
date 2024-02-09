import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements OnInit {

  jwtToken:string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5zZWxjb21tLmNvbS8yMDIxLzA2L2lkZW50aXR5L3NlbGNvbW0tdXNlci9hcGkta2V5LWlkIjo0MSwiY3NuIjoiRGVtbzMiLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IkdMVVVQRTVUT0ZFVEZKUE5GWjRNN1NORU81SVg3WUlIIiwiaWF0IjoxNjMwOTk2NDU1LCJpc3MiOiJTZWxlY3RTb2Z0d2FyZS5TZWxjb21tLlVzZXIuQXBpS2V5LlN0YWdpbmciLCJhdWQiOiJTZWxlY3RTb2Z0d2FyZS5TZWxjb21tLldlYkFwaS5TdGFnaW5nIn0.ikrQCU0SFjEO7Fosr2-hw-1MLADYjIV6CsemZ8zKYIQ';
  editorContent:string = ''
  templateContent:string = ''
  replacedContent:string = ''
  constructor() { }
  ngOnInit() {}

}
