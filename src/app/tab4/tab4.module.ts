import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab4PageRoutingModule } from './tab4-routing.module';

import { Tab4Page } from './tab4.page';
import { ProgramProgressModalComponentModule } from '../components/program-progress-modal/program-progress-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4PageRoutingModule,
    ProgramProgressModalComponentModule
  ],
  declarations: [Tab4Page]
})
export class Tab4PageModule {}
