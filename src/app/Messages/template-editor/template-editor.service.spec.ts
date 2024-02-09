import { TestBed } from '@angular/core/testing';

import { TemplateEditorService } from './services/template-editor.service';

describe('TemplateEditorService', () => {
  let service: TemplateEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
