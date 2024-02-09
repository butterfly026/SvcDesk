import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddContractPage } from './add-contract.page';

const routes: Routes = [
  {
    path: '',
    component: AddContractPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddContractPageRoutingModule {}
