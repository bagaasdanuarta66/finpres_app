import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-program-progress-modal',
  templateUrl: './program-progress-modal.component.html',
  standalone: false,
})
export class ProgramProgressModalComponent {
  @Input() programData: any;
  progressAmount: number | null = null;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    return this.modalCtrl.dismiss({ newProgress: this.progressAmount }, 'confirm');
  }
}