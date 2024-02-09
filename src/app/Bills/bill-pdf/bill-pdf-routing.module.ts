import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillPdfPage } from './bill-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: BillPdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillPdfPageRoutingModule {}
