import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AIBantuanPageRoutingModule } from './aibantuan-routing.module';

import { AIBantuanPage } from './aibantuan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AIBantuanPageRoutingModule
  ],
  declarations: [AIBantuanPage]
})
export class AIBantuanPageModule {}
