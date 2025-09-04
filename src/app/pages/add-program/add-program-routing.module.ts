// src/app/pages/add-program/add-program-routing.module.ts

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProgramPage } from './add-program.page';

const routes: Routes = [
  {
    path: '',
    component: AddProgramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProgramPageRoutingModule {}