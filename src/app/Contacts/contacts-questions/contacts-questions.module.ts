import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsQuestionsPageRoutingModule } from './contacts-questions-routing.module';

import { ContactsQuestionsPage } from './contacts-questions.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactQuestionsModule } from './contacts-questions-component/ContactsQuestion.module';
import { ComponentsModule } from 'src/app/component/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialShareModule,
    JQWidgetModule,
    TranslaterModule,
    ContactsQuestionsPageRoutingModule,
    ContactQuestionsModule,
    ComponentsModule,
  ],
  declarations: [ContactsQuestionsPage]
})
export class ContactsQuestionsPageModule { }
