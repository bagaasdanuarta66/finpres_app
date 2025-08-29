// src/app/notifications/notifications-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsPage } from './notifications.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class NotificationsPageRoutingModule {}
