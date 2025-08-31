import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 1. IMPORT INI

import { IonicModule } from '@ionic/angular';

import { NotificationSenderPageRoutingModule } from './notification-sender-routing.module';

import { NotificationSenderPage } from './notification-sender.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // <-- 2. TAMBAHKAN INI
    IonicModule,
    NotificationSenderPageRoutingModule
  ],
  declarations: [NotificationSenderPage]
})
export class NotificationSenderPageModule {}