// src/app/pages/add-campaign/add-campaign.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- 1. IMPORT

import { IonicModule } from '@ionic/angular';

import { AddCampaignPageRoutingModule } from './add-campaign-routing.module';

import { AddCampaignPage } from './add-campaign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <-- 2. TAMBAHKAN DI SINI
    IonicModule,
    AddCampaignPageRoutingModule
  ],
  declarations: [AddCampaignPage]
})
export class AddCampaignPageModule {}