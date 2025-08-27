// src/app/register/register.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: false,
})
export class RegisterPage {
  // Variabel untuk menampung input dari form
  email = '';
  password = '';
  namaLengkap = ''; // <-- 1. TAMBAHKAN PROPERTI INI
  sekolah = '';     // <-- 2. TAMBAHKAN PROPERTI INI

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async register() {
    try {
      // 3. BUAT OBJEK INI UNTUK MENGUMPULKAN DATA BARU
      const profileData = {
        namaLengkap: this.namaLengkap,
        sekolah: this.sekolah
      };
      
      // 4. KIRIM profileData SEBAGAI ARGUMEN KETIGA
      await this.authService.register(this.email, this.password, profileData);
      
      // Jika berhasil, tampilkan notifikasi dan arahkan ke halaman login
      this.showAlert('Registrasi Berhasil!', 'Silakan login dengan akun baru Anda.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      // Jika gagal, tampilkan pesan error dari Firebase
      this.showAlert('Registrasi Gagal', error.message);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}