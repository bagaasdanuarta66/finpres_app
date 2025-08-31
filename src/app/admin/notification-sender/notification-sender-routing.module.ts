import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationSenderPage } from './notification-sender.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationSenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationSenderPageRoutingModule {}
