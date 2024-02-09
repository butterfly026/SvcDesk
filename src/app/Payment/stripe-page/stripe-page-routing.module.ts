import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripePagePage } from './stripe-page.page';

const routes: Routes = [
  {
    path: '',
    component: StripePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripePagePageRoutingModule {}
