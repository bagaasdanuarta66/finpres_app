// src/app/pages/add-program/add-program.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.page.html',
  styleUrls: ['./add-program.page.scss'],
  standalone: false,
})
export class AddProgramPage implements OnInit {

  programForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    // Inisialisasi form dengan validasi
    this.programForm = this.fb.group({
      namaProgram: ['', Validators.required],
      targetDana: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
  }

  async saveProgram() {
    if (this.programForm.invalid) {
      this.presentToast('Harap isi semua kolom dengan benar.');
      return;
    }

    try {
      const user = await firstValueFrom(this.authService.currentUser$);
      if (!user) {
        this.presentToast('Anda harus login untuk membuat program.');
        return;
      }

      const formData = this.programForm.value;
      // Panggil service untuk menyimpan data (ini akan kita buat di langkah berikutnya)
      await this.authService.addProgram(user.uid, formData);

      this.presentToast('Program baru berhasil disimpan!');
      // Arahkan pengguna kembali ke halaman daftar program
      this.router.navigate(['/tabs/tab3']);

    } catch (error) {
      console.error('Gagal menyimpan program', error);
      this.presentToast('Gagal menyimpan program. Coba lagi.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}