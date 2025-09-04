import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCampaignPage } from './add-campaign.page';

const routes: Routes = [
  {
    path: '',
    component: AddCampaignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCampaignPageRoutingModule {}
