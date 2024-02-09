import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsQuestionsPage } from './contacts-questions.page';

const routes: Routes = [
  {
    path: '',
    component: ContactsQuestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsQuestionsPageRoutingModule {}
