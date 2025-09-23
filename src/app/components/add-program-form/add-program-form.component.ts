import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-program-form',
  templateUrl: './add-program-form.component.html',
  styleUrls: ['./add-program-form.component.scss'],
  standalone: false,
})
export class AddProgramFormComponent implements OnInit {
  programForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.programForm = this.fb.group({
      title: ['', Validators.required],
      organizer: [''],
      desc: [''],
      kategori: ['', Validators.required],
      points: [0, Validators.required],
      target: [0, Validators.required],
      deadline: ['', Validators.required],
       icon: ['', Validators.required], // <-- UBAH BARIS INI
      badge: ['BARU'], // Properti ini hanya untuk tampilan, akan kita hapus saat submit
      participants: [0]
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // FUNGSI onSubmit() SUDAH DIMODIFIKASI
  onSubmit() {
    if (this.programForm.valid) {
      // Salin data dari form
      const formData = { ...this.programForm.value };

      // 1. Hapus properti 'badge' karena tidak ada di database
      delete formData.badge;

      // 2. Ubah format 'deadline' menjadi string MM-DD-YYYY
      const date = new Date(formData.deadline);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      formData.deadline = `${month}-${day}-${year}`;
      
      // Kirim data yang sudah bersih ke Tab 4
      this.modalCtrl.dismiss(formData, 'confirm');
    }
  }
}