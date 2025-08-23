import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AIBantuanPage } from './aibantuan.page';

const routes: Routes = [
  {
    path: '',
    component: AIBantuanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AIBantuanPageRoutingModule {}
