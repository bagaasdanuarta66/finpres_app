import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 1. Impor ini untuk [(ngModel)]
import { IonicModule } from '@ionic/angular';   // <-- 2. Impor ini untuk semua komponen <ion-...>

import { ProgramProgressModalComponent } from './program-progress-modal.component';

@NgModule({
  declarations: [ProgramProgressModalComponent],
  imports: [
    CommonModule,
    FormsModule, // <-- 3. Daftarkan di sini
    IonicModule  // <-- 4. Daftarkan di sini
  ],
  exports: [ProgramProgressModalComponent]
})
export class ProgramProgressModalComponentModule {}