import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab4Page } from './tab4.page';
import { Tab4PageRoutingModule } from './tab4-routing.module';
import { ProgramProgressModalComponent } from '../components/program-progress-modal/program-progress-modal.component';

// Impor komponen yang baru dibuat
import { AddProgramFormComponent } from '../components/add-program-form/add-program-form.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Tab4PageRoutingModule
  ],
  // Daftarkan kedua halaman/komponen di sini
  declarations: [
    Tab4Page, 
    AddProgramFormComponent,
    ProgramProgressModalComponent // <-- TAMBAHKAN INI
  ]
})
export class Tab4PageModule {}