import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactsQuestionsComponentComponent } from './contacts-questions-component.component';
import { QuestionService } from '../services/question-service';
import { QuestionNewComponent } from './question-new/question-new.component';
import { IdentificationNewComponent } from './identification-new/identification-new.component';
import { IdentificationService } from '../services/identification-service';
import { SharedModule } from 'src/app/Shared/shared.module';
import { IdentificationListTableComponent } from './identification-list-table/identification-list-table.component';
import { QuestionListTableComponent } from './question-list-table/question-list-table.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        SharedModule,
    ],
    exports: [
        ContactsQuestionsComponentComponent,
        QuestionNewComponent,
        IdentificationNewComponent,
    ],
    declarations: [
        ContactsQuestionsComponentComponent,
        QuestionNewComponent,
        IdentificationNewComponent,
        IdentificationListTableComponent,
        QuestionListTableComponent,
    ],
    providers: [
        QuestionService,
        IdentificationService,
    ]
})
export class ContactQuestionsModule { }
