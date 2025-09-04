// src/app/pages/add-program/add-program.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddProgramPageRoutingModule } from './add-program-routing.module';
import { AddProgramPage } from './add-program.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddProgramPageRoutingModule
  ],
  declarations: [AddProgramPage]
})
export class AddProgramPageModule {}