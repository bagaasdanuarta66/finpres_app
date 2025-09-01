// src/app/admin/notification-sender/notification-sender.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotificationSenderPageRoutingModule } from './notification-sender-routing.module';
import { NotificationSenderPage } from './notification-sender.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationSenderPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NotificationSenderPage]
})
export class NotificationSenderPageModule {}